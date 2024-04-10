import { createApp, getAppData, getAppsData, updateApp, removeApp } from './apps';
import { getDbCredential, getDbCredentials, removeDbCredentials } from './dbCreds';
import { getAppSchema, getAppSchemas, createAppSchema, removeAppSchema } from './appSchemas';
import {
  activateAccount,
  changePasswordByOldPass,
  forgotPassword,
  getUser,
  getUsers,
  login,
  modifyUser,
  registerUser,
  requestNewToken,
  requestPasswordChangeEmail,
} from './users';
const { resolvers: scalarResolvers } = require('graphql-scalars');
const Query = {
  getAppData,
  getAppsData,
  getDbCredential,
  getDbCredentials,
  getAppSchema,
  getAppSchemas,
  getUser,
  getUsers,
};

const Mutation = {
  createApp,
  updateApp,
  removeApp,
  removeDbCredentials,
  createAppSchema,
  removeAppSchema,
  activateAccount,
  changePasswordByOldPass,
  forgotPassword,
  login,
  modifyUser,
  registerUser,
  requestNewToken,
  requestPasswordChangeEmail,
};

module.exports = { ...scalarResolvers, Mutation, Query };
