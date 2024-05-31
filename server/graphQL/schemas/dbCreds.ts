import { gql } from 'graphql-tag';

const Schema = gql`
  extend type Query {
    getDbCredential(appName: String!, env: environmentTypes!): dbCred
    getDbCredentials(filter: JSON): [dbCred]!
    testConnection(dbType: String!, configs: JSON!): JSON
  }

  extend type Mutation {
    removeDbCredentials(appName: String!, env: environmentTypes!): JSON
  }

  type dbCred {
    _id: ID
    appName: String
    sslFileName: String
    env: String
  }
`;

export default Schema;
