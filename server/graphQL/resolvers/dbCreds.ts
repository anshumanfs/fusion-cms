import { dbModels } from '../../db';
import Errors from '../../libs/errors';
import { connectorLocations } from '../../db';

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

const testConnection = async (_: any, args: any) => {
  const { dbType, configs } = args;
  const { connector } = require(connectorLocations[dbType as keyof typeof connectorLocations]);
  const conn = connector('test', configs);
  if (dbType === 'mongo') {
    return new Promise((resolve, reject) => {
      conn.on('error', (err: any) => {
        reject({
          message: 'Connection failed',
          error: err,
          status: false,
        });
      });
      conn.on('connected', () => {
        resolve({
          message: 'Connection successful',
          status: true,
        });
      });
    });
  }
  if (['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql', 'oracle', 'db2'].includes(dbType)) {
    return conn
      .authenticate()
      .then(() => {
        return {
          message: 'Connection successful',
          status: true,
        };
      })
      .catch((err: any) => {
        return {
          message: 'Connection failed',
          error: err,
          status: false,
        };
      });
  }
  return {
    message: 'Invalid dbType',
    status: false,
  };
};

export { getDbCredential, getDbCredentials, removeDbCredentials, testConnection };
