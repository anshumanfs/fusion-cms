import { createApp, getAppData, getAppsData, updateApp, removeApp, runApp } from './apps';
import { getDbCredential, getDbCredentials, removeDbCredentials, testConnection } from './dbCreds';
import { getAppSchema, getAppSchemas, createAppSchema, removeAppSchema } from './appSchemas';
import { createAccessSchema, removeAccessSchema, getAccessSchema, getAccessSchemas } from './accessSchemas';
import {
  activateAccount,
  changePasswordByOldPass,
  forgotPassword,
  inviteUsersToRegister,
  getUser,
  getUsers,
  getOwnDetails,
  getUsersByMetadata,
  getUsersCount,
  login,
  modifyUser,
  modifyOwnDetails,
  modifyUserMetadata,
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
  testConnection,
  getAppSchema,
  getAppSchemas,
  getUser,
  getUsers,
  getOwnDetails,
  getUsersByMetadata,
  getUsersCount,
};

const Mutation = {
  inviteUsersToRegister,
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
  modifyOwnDetails,
  modifyUserMetadata,
  registerUser,
  requestNewToken,
  requestPasswordChangeEmail,
};

module.exports = { ...scalarResolvers, Mutation, Query };
