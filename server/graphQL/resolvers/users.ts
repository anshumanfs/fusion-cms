import ActivateAccountTemplate from '../../libs/emailTemplates/activateAccount.template';
import ChangePasswordTemplate from '../../libs/emailTemplates/changePassword.template';
import SendAPIKeyTemplate from '../../libs/emailTemplates/apiKey.template';
import nodeCrypto from 'node:crypto';
import Config from '../../../config.json';
import Errors from '../../libs/errors';
import sendMail from '../../libs/mailer';
import { dbModels } from '../../db';
import { oneWayEncoder, twoWayDecoder, twoWayEncoder } from '../../libs/encoderDecoder';

const getUser = async (_: any, args: any) => {
  const { id } = args;
  const user = await dbModels.users.findOne({ id });
  const metadata = (await dbModels.metadata.find({ referenceId: id })) || [];
  const parsedMetadata = metadata.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  return { ...user, metadata: parsedMetadata };
};

const getUsers = async (_: any, args: any) => {
  const { page } = args;
  const users = await dbModels.users.find({}, {}, { skip: (page - 1) * 10, limit: 10 });
  const metadata = await dbModels.metadata.find({ referenceId: { $in: users.map((user: any) => user._id) } });
  const parsedMetadata = metadata.reduce((acc: any, curr: any) => {
    if (!acc[curr.referenceId]) {
      acc[curr.referenceId] = {};
    }
    acc[curr.referenceId][curr.key] = curr.value;
    return acc;
  }, {});
  users.forEach((user: any) => {
    user.metadata = parsedMetadata[user._id];
  });
  return users;
};

const getUsersByMetadata = async (_: any, args: any) => {
  const { metaDataFilter } = args;
  const metadata = await dbModels.metadata.find({
    $or: [
      ...Object.keys(metaDataFilter).map((metaKey: any) => ({
        tableName: dbModels.users.getTableName(),
        key: metaKey,
        value: metaDataFilter[metaKey],
      })),
    ],
  });
  const users = await dbModels.users.find({ _id: { $in: metadata.map((meta: any) => meta.referenceId) } });
  const parsedMetadata = metadata.reduce((acc: any, curr: any) => {
    if (!acc[curr.referenceId]) {
      acc[curr.referenceId] = {};
    }
    acc[curr.referenceId][curr.key] = curr.value;
    return acc;
  }, {});
  users.forEach((user: any) => {
    user.metadata = parsedMetadata[user._id];
  });
  return users;
};

const getUsersCount = async (_: any, args: any) => {
  const count = await dbModels.users.countDocuments({});
  return count || 0;
};

const registerUser = async (_: any, args: any) => {
  const { email, firstName, lastName, password, metadata } = args;
  const [user, userCount] = [await dbModels.users.findOne({ email }), await dbModels.users.countDocuments({})];
  if (user) {
    throw Errors.BAD_REQUEST('User already exists !');
  }
  const userData: any = {
    apiKey: nodeCrypto.randomUUID(),
    email,
    firstName,
    lastName,
    password: oneWayEncoder(password),
  };
  if (userCount === 0) {
    userData.role = 'admin'; // First user will be admin by default
  }
  const dataToEncrypt = JSON.stringify({ email, date: new Date().toISOString() });
  const uniqueCode = encodeURIComponent(twoWayEncoder(dataToEncrypt, Config.secrets.uniqueEmailSecret));
  const uniqueAccountActivationLink = `${Config.DEPLOYMENT_URL}/auth/validate?entity=user&token=${uniqueCode}`;
  await sendMail(
    email,
    `Activate your ${Config.APP_NAME} account`,
    '',
    ActivateAccountTemplate(uniqueAccountActivationLink, firstName)
  );
  const result = await dbModels.users.create(userData);
  if (!result) {
    throw Errors.NOT_IMPLEMENTED('User not created');
  }
  if (metadata) {
    const referenceId = result._id;
    const metadatas = Object.keys(metadata).map((key) => ({
      tableName: dbModels?.users?.getTableName() || 'default_table_users',
      referenceId,
      key,
      value: metadata[key],
    }));
    if (metadatas.length > 0) {
      const metaDataResult = await dbModels.metadata.createMany([...metadatas]);
      if (!metaDataResult) {
        throw Errors.NOT_IMPLEMENTED('Metadata not created');
      }
    }
    result.metadata = metadata;
  }
  return result;
};

const activateAccount = async (_: any, args: any) => {
  const currentTime = new Date().getTime();
  const allowedTime = Config.envConfigurations.uniqueEmailExpiration * 60 * 1000;
  const { uniqueCode } = args;
  const { email, date } = JSON.parse(twoWayDecoder(decodeURIComponent(uniqueCode), Config.secrets.uniqueEmailSecret));
  if (!date || !email || currentTime - new Date(date).getTime() > allowedTime) {
    throw Errors.BAD_REQUEST('Invalid code');
  }
  const user = await dbModels.users.findOne({ email });
  if (!user) {
    throw Errors.BAD_REQUEST('User not found');
  }
  if (user.isActive) {
    throw Errors.BAD_REQUEST('Account already activated');
  }
  const updatedUser = await dbModels.users.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
  if (updatedUser) {
    await sendMail(updatedUser.email, `API Key for ${Config.APP_NAME}`, '', SendAPIKeyTemplate(updatedUser.apiKey));
  } else {
    throw Errors.NOT_IMPLEMENTED('Account not activated');
  }
  return { message: 'Account activated successfully' };
};

const login = async (_: any, args: any) => {
  const { email, password } = args;
  const encodedPassword = oneWayEncoder(password);
  const user = await dbModels.users.findOne({ email, password: encodedPassword });
  if (!user) {
    throw Errors.UNAUTHORIZED('Invalid email or password');
  }
  const tokenCredentials = {
    email,
    createdAt: new Date().toISOString(),
  };
  const token = twoWayEncoder(JSON.stringify({ ...tokenCredentials, type: 'token' }), Config.secrets.bearerSecret);
  const refreshToken = twoWayEncoder(
    JSON.stringify({ ...tokenCredentials, type: 'refreshToken' }),
    Config.secrets.refreshTokenSecret
  );
  return { token, refreshToken };
};

const requestNewToken = async (_: any, args: any) => {
  const { refreshToken } = args;
  if (!refreshToken) {
    throw Errors.UNAUTHORIZED('Refresh token not found');
  }
  const decryptedRefreshToken = JSON.parse(twoWayDecoder(refreshToken, Config.secrets.refreshTokenSecret));
  const refreshTokenValidityInMs = Config.envConfigurations.refreshTokenExpiration * 60 * 1000;

  const refreshTokenCreatedAt = new Date(decryptedRefreshToken.createdAt).getTime();
  const currentTime = new Date().getTime();

  if (currentTime - refreshTokenCreatedAt > refreshTokenValidityInMs) {
    throw Errors.UNAUTHORIZED('Refresh token expired');
  }
  const user = await dbModels.users.findOne({ email: decryptedRefreshToken.email });
  if (!user) {
    throw Errors.UNAUTHORIZED('Invalid refresh token');
  }
  if (!user.isVerified || user.isBlocked) {
    throw Errors.UNAUTHORIZED('User is either not verified or blocked by the admin');
  }

  const tokenCredentials = {
    email: decryptedRefreshToken.email,
    createdAt: new Date().toISOString(),
  };

  const token = twoWayEncoder(JSON.stringify({ ...tokenCredentials, type: 'token' }), Config.secrets.bearerSecret);
  const newRefreshToken = twoWayEncoder(
    JSON.stringify({ ...tokenCredentials, type: 'refreshToken' }),
    Config.secrets.refreshTokenSecret
  );

  return { token, refreshToken: newRefreshToken };
};

const modifyUser = async (_: any, args: any) => {
  const { _id } = args;
  const user = await dbModels.users.findOne({ _id });
  if (!user) {
    throw new Error('User not found');
  }
  delete args.id;
  const updatedUser = await dbModels.users.findOneAndUpdate({ _id }, args);
  const metadata = (await dbModels.metadata.find({ referenceId: _id })) || [];
  return { ...updatedUser, metadata };
};

const modifyUserMetadata = async (_: any, args: any) => {
  const { id, metadata } = args;
  const user = await dbModels.users.findOne({ id });
  if (!user) {
    throw Errors.BAD_REQUEST('User not found');
  }
  const referenceId = id;
  const metadatas = Object.keys(metadata).map((key) => ({
    tableName: dbModels?.users?.getTableName() || 'default_table_users',
    referenceId,
    key,
    value: metadata[key],
  }));
  const promiseArr = metadatas.map((meta) =>
    dbModels.metadata.findOneAndUpdate({ tableName: meta.tableName, referenceId, key: meta.key }, meta, {
      upsert: true,
    })
  );
  const metaDataResult = await Promise.all(promiseArr);
  if (!metaDataResult) {
    throw Errors.NOT_IMPLEMENTED('Metadata not updated');
  }
  return { message: 'Metadata updated successfully' };
};

/**
 * Password can be changed in three ways
 * 1. By the user itself (if the user knows the current password)
 * 2. By the user (if the user forgets the password and requests for a new password using email otp)
 * 3. By the admin (by sending user a unique password change email)
 */
const changePasswordByOldPass = async (_: any, args: any) => {
  const { id, oldPassword, newPassword } = args;
  const user = await dbModels.users.findOne({ id });
  if (!user) {
    throw Errors.BAD_REQUEST('User not found');
  }
  if (user.password !== oneWayEncoder(oldPassword)) {
    throw Errors.UNAUTHORIZED('Invalid old password');
  }
  user.password = oneWayEncoder(newPassword);
  const updatedUser = await dbModels.users.findOneAndUpdate(
    { id },
    {
      password: user.password,
    }
  );
  if (!updatedUser) {
    throw Errors.NOT_IMPLEMENTED('Password not updated');
  }
  return { message: 'Password updated successfully' };
};

const forgotPassword = async (_: any, args: any) => {
  const { uniqueCode, password } = args;
  const decodedCode = JSON.parse(twoWayDecoder(decodeURIComponent(uniqueCode)));
  const currentTime = new Date().getTime();
  const allowedTime = Config.envConfigurations.uniqueEmailExpiration * 60 * 1000;
  if (!decodedCode.email || !decodedCode.date || currentTime - new Date(decodedCode.date).getTime() > allowedTime) {
    throw Errors.BAD_REQUEST('Invalid code');
  }
  const updatedUser = await dbModels.users.findOneAndUpdate(
    { email: decodedCode.email },
    {
      password: oneWayEncoder(password),
    }
  );
  if (!updatedUser) {
    throw Errors.NOT_IMPLEMENTED('Password not updated');
  }
  return { message: 'Password updated successfully' };
};

const requestPasswordChangeEmail = async (_: any, args: any) => {
  const { email } = args;
  const user = await dbModels.users.findOne({
    email,
  });
  if (!user) {
    throw Errors.BAD_REQUEST('User not found');
  }
  const uniqueCode = encodeURIComponent(
    twoWayEncoder(
      JSON.stringify({
        email: user.email,
        date: new Date().toISOString(),
      }),
      Config.secrets.twoWayEncryptionSecret
    )
  );
  const uniqueLink = `${Config.DEPLOYMENT_URL}/auth/validate?entity=reset&token=${uniqueCode}`;
  // Send email with unique link
  await sendMail(email, `Reset Password ${Config.APP_NAME}`, '', ChangePasswordTemplate(uniqueLink));
  return { message: 'Email sent successfully' };
};

export {
  activateAccount,
  changePasswordByOldPass,
  forgotPassword,
  getUser,
  getUsers,
  getUsersByMetadata,
  getUsersCount,
  login,
  modifyUser,
  modifyUserMetadata,
  registerUser,
  requestNewToken,
  requestPasswordChangeEmail,
};
