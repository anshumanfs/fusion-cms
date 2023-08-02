import AppSchema from './apps';
import dbCredSchema from './dbCreds';
const { typeDefs: scalarTypeDefs } = require('graphql-scalars');

export const Schema = `#graphql 
  ${scalarTypeDefs} 
  type Query  
  type Mutation `;

module.exports = [AppSchema, dbCredSchema, Schema];
