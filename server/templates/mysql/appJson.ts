import { dbModels } from '../../db';
const APP_ENV = ('NODE_ENV' in process.env ? process.env.NODE_ENV.trim() : 'development').toLowerCase();

const generateAppJsonFile = async (appName: string) => {
  // env = 'dev' if APP_ENV is local or else leave it as it is
  const env = APP_ENV;
  const dbCreds = await dbModels.dbCreds.findOne({ appName, env }, { _id: 0, appName: 0, env: 0 });
  const collections = await dbModels.dbSchemas.find({ appName }, { _id: 0, appName: 0 });
  return { dbCreds, collections };
};

export { generateAppJsonFile };
