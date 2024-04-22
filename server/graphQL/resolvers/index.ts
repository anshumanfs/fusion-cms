import { createApp, getAppData, getAppsData, updateApp, removeApp, runApp } from './apps';
import { getDbCredential, getDbCredentials, removeDbCredentials } from './dbCreds';
import { getAppSchema, getAppSchemas, createAppSchema, removeAppSchema } from './appSchemas';
import { createAccessSchema, removeAccessSchema, getAccessSchema, getAccessSchemas } from './accessSchemas';
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
  getAccessSchema,
  getAccessSchemas,
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
  createAccessSchema,
  removeAccessSchema,
  createApp,
  updateApp,
  removeApp,
  runApp,
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
