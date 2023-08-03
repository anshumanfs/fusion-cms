import { dbModels } from '../../db';
import Errors from '../../libs/errors';

const getdbCreds = async (_: any, args: any) => {
  const { filter } = args;
  const dbCredsData = await dbModels.dbCreds.find(filter || {});
  return dbCredsData;
};

const getdbCred = async (_: any, args: any) => {
  const { appName, env } = args;
  const dbCredData = await dbModels.dbCreds.findOne({ appName, env });
  if (!dbCredData) {
    throw Errors.NOT_FOUND('No dbCred exists with provided appName and env.');
  }
  return dbCredData;
};

const createdbCred = async (_: any, args: any, { req }: any) => {
  const data = args.input;
  const { appName, env, dbType } = data;
  const updates = data[dbType];
  if ([null, undefined].includes(updates)) {
    throw Errors.BAD_REQUEST(`Invalid Data.`);
  }
  if (dbType === 'mongo') {
    updates.sslFileName = `${appName}_${env}.pem`;
  }
  const dbCredData = await dbModels.dbCreds.findOneAndUpdate(
    { appName, env },
    {
      ...updates,
    },
    { upsert: true, new: true }
  );
  if (!dbCredData) {
    throw Errors.BAD_REQUEST(`Failed to create.`);
  }
  return dbCredData;
};

const updatedbCred = async (_: any, args: any, { req }: any) => {
  const data = args.input;
  const { appName, env, dbType } = data;
  const updates = data[dbType];
  if ([null, undefined].includes(updates)) {
    throw Errors.BAD_REQUEST(`Invalid Data.`);
  }
  const updateData = await dbModels.dbCreds.findOneAndUpdate({ appName, env }, { ...updates }, { new: true });
  if (!updateData) {
    throw Errors.BAD_REQUEST(`Failed to update.`);
  }
  return updateData;
};

const removedbCred = async (_: any, args: any) => {
  const { appName, env } = args;
  const findData = await dbModels.dbCreds.findOne({ appName, env });
  if (!findData) {
    throw Errors.BAD_REQUEST('No application found with provided appName and env');
  }
  const deleteCred = await dbModels.dbCreds.deleteOne({ appName, env });
  return deleteCred;
};

export { getdbCreds, getdbCred, createdbCred, updatedbCred, removedbCred };
