import { createApp, getAppData, getAppsData, updateApp, removeApp } from './apps';
import { getDbCredential, getDbCredentials, removeDbCredentials } from './dbCreds';
import { getAppSchema, getAppSchemas, createAppSchema, removeAppSchema } from './appSchemas';
const { resolvers: scalarResolvers } = require('graphql-scalars');
const Query = {
  getAppData,
  getAppsData,
  getDbCredential,
  getDbCredentials,
  getAppSchema,
  getAppSchemas,
};

const Mutation = {
  createApp,
  updateApp,
  removeApp,
  removeDbCredentials,
  createAppSchema,
  removeAppSchema,
};

module.exports = { ...scalarResolvers, Mutation, Query };
