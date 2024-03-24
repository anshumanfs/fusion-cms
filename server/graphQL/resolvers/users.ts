import { dbModels } from '../../db';
import sendMail from '../../libs/mailer';
import Errors from '../../libs/errors';
import ChangePasswordTemplate from '../../libs/emailTemplates/changePassword.template';
import Config from '../../config.json';
import { oneWayEncoder, twoWayEncoder, twoWayDecoder } from '../../libs/encoderDecoder';

const registerUser = async (_: any, args: any) => {
  const { email, firstName, lastName, password } = args;
  const [user, userCount] = [await dbModels.users.findOne({ email }), await dbModels.users.countDocuments({})];
  if (user) {
    throw Errors.BAD_REQUEST('User already exists !');
  }
  const userData: any = {
    email,
    firstName,
    lastName,
    password: oneWayEncoder(password),
  };
  if (userCount === 0) {
    userData.role = 'admin'; // First user will be admin by default
  }
  const result = await dbModels.users.create(userData);
  return result;
};

const login = async (_: any, args: any) => {
  const { email, password } = args;
  const user = await dbModels.users.findOne({ email, password });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const token = await user.generateToken();
  // it will return token
  return token;
};

const modifyUser = async (_: any, args: any) => {
  const { id, email, role, firstName, lastName } = args;
  const user = await dbModels.users.findOne({ id });
  if (!user) {
    throw new Error('User not found');
  }
  const updatedUser = await user.update({ email, role, firstName, lastName });
  return updatedUser;
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
  const decodedCode = JSON.parse(twoWayDecoder(uniqueCode));
  if (!decodedCode.email) {
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
  const uniqueCode = twoWayEncoder(
    JSON.stringify({
      id: user.id,
    }),
    Config.secrets.twoWayEncryptionSecret
  );
  const uniqueLink = `${Config.DEPLOYMENT_URL}/reset-password/${uniqueCode}`;
  // Send email with unique link
  await sendMail(email, 'Reset Password', '', ChangePasswordTemplate(uniqueLink));
  return { message: 'Email sent successfully' };
};

export { registerUser, login, modifyUser, changePasswordByOldPass, forgotPassword, requestPasswordChangeEmail };
