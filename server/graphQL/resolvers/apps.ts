import { dbModels } from '../../db';
import Errors from '../../libs/errors';
const templates = {
  mongo: require('../../templates/mongo'),
  mysql: require('../../templates/mysql'),
};

const getAppsData = async (_: any, args: any) => {
  const { filter } = args;
  const appsData = await dbModels.apps.find(filter || {});
  const schemas = await dbModels.dbSchemas.find({});
  appsData.forEach((app: any) => {
    app.schemas = schemas.filter((schema: any) => schema.appName === app.appName);
  });
  return appsData;
};

const getAppData = async (_: any, args: any) => {
  const { appName } = args;
  const appData = await dbModels.apps.findOne({ appName });
  if (!appData) {
    throw Errors.NOT_FOUND('No app exists with provided appName');
  }
  return appData;
};

const createApp = async (_: any, args: any, { req }: any) => {
  const { appName, dbType, env } = args.input;
  const findApp = await dbModels.apps.findOne({ appName });
  if (!findApp) {
    const indexInput = { credentials: args.input[dbType], appName, dbType, env };
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
    const indexInput = { credentials: args.input[dbType], appName, dbType, env };
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
    const deletedApp = await dbModels.apps.deleteOne({ appName });
    const deletedCredentials = await dbModels.dbCredentials.deleteMany({ appName });
    return { deletedApp, deletedCredentials };
  }
};

const runApp = async (_: any, args: any) => {
  const { appName } = args;
  const findApp = await dbModels.apps.findOne({ appName });
  if (!findApp) {
    throw Errors.BAD_REQUEST('No application found with provided appName');
  } else {
    const { running } = findApp;
    await dbModels.apps.findOneAndUpdate({ appName }, { running: !running });
    return { message: `App ${running ? 'stopped' : 'started'} successfully` };
  }
};

export { createApp, getAppData, getAppsData, updateApp, removeApp, runApp };
