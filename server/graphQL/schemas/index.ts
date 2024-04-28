import Apps from './apps';
import dbCreds from './dbCreds';
import AppSchemas from './appSchemas';
import AccessSchema from './accessSchemas';
import userSchema from './users';
const { typeDefs: scalarTypeDefs } = require('graphql-scalars');

export const Schema = `#graphql 
  ${scalarTypeDefs}, 
  type Query, 
  type Mutation`;

module.exports = [AccessSchema, Apps, AppSchemas, dbCreds, Schema, userSchema];
