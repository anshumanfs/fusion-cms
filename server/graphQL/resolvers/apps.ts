import { dbModels } from '../db';
import Errors from '../../libs/errors';
const templates = {
  mongo: require('../templates/mongoTemplate'),
  snowflake: require('../templates/snowflake'),
};

const getAppsData = async (_: any, args: any) => {
  const { filter } = args;
  const appsData = await dbModels.apps.find(filter || {}).populate(['schemas']);
  return appsData;
};

const getAppData = async (_: any, args: any) => {
  const { appName } = args;
  const appData = await dbModels.apps.findOne({ appName }).populate(['schemas']);
  if (!appData) {
    throw Errors.NOT_FOUND('No app exists with provided appName');
  }
  return appData;
};

const createApp = async (_: any, args: any, { req }: any) => {
  const { appName, dbType, env } = args.input;
  const findApp = await dbModels.apps.findOne({ appName });
  if (!findApp) {
    const indexInput = { ...args.input[dbType], appName, dbType, env };
    await templates[dbType as keyof typeof templates].createApp(indexInput, req.body.variables);
    return { message: 'App created successfully' };
  } else {
    throw Errors.BAD_REQUEST(
      `App already exists with appName - ${appName}. Please perform updateApp operation to update existing application`
    );
  }
};

const updateApp = async (_: any, args: any, { req }: any) => {
  const { appName, dbType, env } = args.input;
  const findApp = await dbModels.apps.findOne({ appName });
  if (!findApp) {
    throw Errors.BAD_REQUEST('Application not found. Please create one application with provided appName');
  } else {
    const indexInput = { ...args.input[dbType], appName, dbType, env };
    await templates[dbType as keyof typeof templates].createApp(indexInput, req.body.variables);
    return { message: 'App updated successfully' };
  }
};

const removeApp = async (_: any, args: any) => {
  const { appName } = args;
  const findApp = await dbModels.apps.findOne({ appName });
  if (!findApp) {
    throw Errors.BAD_REQUEST('No application found with provided appName');
  } else {
    const { running } = findApp;
    if (Boolean(running) === true) {
      throw Errors.NOT_ACCEPTABLE('The app is running please close it before to remove.');
    }

    const deleteApp = await dbModels.apps.deleteOne({ appName });
    const deleteCreds = await dbModels.dbCreds.deleteMany({ appName });
    return { deleteApp, deleteCreds };
  }
};

export { createApp, getAppData, getAppsData, updateApp, removeApp };
