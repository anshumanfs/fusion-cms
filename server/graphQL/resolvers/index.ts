import { createApp, getAppData, getAppsData, updateApp, removeApp } from './apps';
import { getdbCred, getdbCreds, createdbCred, updatedbCred, removedbCred } from './dbCreds';
const { resolvers: scalarResolvers } = require('graphql-scalars');
const Query = {
  getAppData,
  getAppsData,
  getdbCred,
  getdbCreds,
};

const Mutation = {
  createApp,
  createdbCred,
  updateApp,
  updatedbCred,
  removeApp,
  removedbCred,
};

module.exports = { ...scalarResolvers, Mutation, Query };
