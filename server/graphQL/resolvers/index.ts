import { createApp, getAppData, getAppsData, updateApp, removeApp } from './apps';
import { getDbCredential, getDbCredentials, removeDbCredentials } from './dbCreds';
const { resolvers: scalarResolvers } = require('graphql-scalars');
const Query = {
  getAppData,
  getAppsData,
  getDbCredential,
  getDbCredentials,
};

const Mutation = {
  createApp,
  updateApp,
  removeApp,
  removeDbCredentials,
};

module.exports = { ...scalarResolvers, Mutation, Query };
