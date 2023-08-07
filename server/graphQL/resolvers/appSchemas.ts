import { dbModels } from '../../db';

const templates = {
  mongo: require('../../templates/mongo'),
  mysql: require('../../templates/mysql'),
};

const createAppSchema = async (_: any, args: any) => {
  const { appName, originalCollectionName, singularCollectionName, pluralCollectionName, schema } = args.input;
  const { dbType } = await dbModels.apps.findOne({ appName });
  if (!dbType) {
    throw new Error('App not found');
  } else {
    await templates[dbType as keyof typeof templates].createDbModels(args.input);
    return { message: 'App Schema Created Successfully', status: 1 };
  }
};

const removeAppSchema = async (_: any, args: any) => {
  const { appName, originalCollectionName } = args;
  const { dbType } = await dbModels.apps.findOne({ appName });
  if (!dbType) {
    throw new Error('App not found');
  } else {
    const appSchema = await dbModels.dbSchemas.deleteOne({ appName, originalCollectionName });
    return { message: 'App Schema Removed Successfully', deletedData: appSchema };
  }
};

const getAppSchema = async (_: any, args: any) => {
  const { appName, originalCollectionName } = args;
  const { dbType } = await dbModels.apps.findOne({ appName });
  if (!dbType) {
    throw new Error('App not found');
  } else {
    const appSchema = await dbModels.dbSchemas.findOne({ appName, originalCollectionName });
    return appSchema;
  }
};

const getAppSchemas = async (_: any, args: any) => {
  const { appName } = args;
  const { dbType } = await dbModels.apps.findOne({ appName });
  if (!dbType) {
    throw new Error('App not found');
  } else {
    const appSchema = await dbModels.dbSchemas.find({ appName });
    return appSchema;
  }
};

export { createAppSchema, removeAppSchema, getAppSchema, getAppSchemas };
