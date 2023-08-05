import { dbModels } from '../../db';
import Errors from '../../libs/errors';

const getDbCredentials = async (_: any, args: any) => {
  const { filter } = args;
  const dbCredentialsData = await dbModels.dbCredentials.find(filter || {});
  return dbCredentialsData;
};

const getDbCredential = async (_: any, args: any) => {
  const { appName, env } = args;
  const dbCredData = await dbModels.dbCredentials.findOne({ appName, env });
  if (!dbCredData) {
    throw Errors.NOT_FOUND('No dbCred exists with provided appName and env.');
  }
  return dbCredData;
};

const removeDbCredentials = async (_: any, args: any) => {
  const { appName, env } = args;
  const findData = await dbModels.dbCredentials.findOne({ appName, env });
  if (!findData) {
    throw Errors.BAD_REQUEST('No application found with provided appName and env');
  }
  const deleteCred = await dbModels.dbCredentials.deleteOne({ appName, env });
  return deleteCred;
};

export { getDbCredential, getDbCredentials, removeDbCredentials };
