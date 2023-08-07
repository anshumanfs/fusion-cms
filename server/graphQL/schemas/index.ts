import Apps from './apps';
import dbCreds from './dbCreds';
import AppSchemas from './appSchemas';
const { typeDefs: scalarTypeDefs } = require('graphql-scalars');

export const Schema = `#graphql 
  ${scalarTypeDefs}, 
  type Query, 
  type Mutation`;

module.exports = [Apps, AppSchemas, dbCreds, Schema];
