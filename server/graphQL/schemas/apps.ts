import { gql } from 'graphql-tag';

const Schema = gql`
  extend type Query {
    getAppData(appName: String!): App
    getAppsData(filter: JSON): [App]!
  }

  extend type Mutation {
    createApp(input: createApp!): Message
    updateApp(input: createApp!): Message
    removeApp(appName: String!): JSON
  }

  type App {
    _id: ID
    appName: String
    dbType: String
    isAppCompleted: Boolean
    port: Int
    running: Boolean
    schemas: JSON
  }

  type Message {
    message: String
  }

  enum environmentTypes {
    development
    production
  }

  enum databaseTypes {
    mongo
    mysql
  }

  input createApp {
    appName: String!
    mongo: mongoConnectionConfigs
    mysql: mySQLConnectionConfigs
    dbType: databaseTypes!
    env: environmentTypes!
  }

  "MongoDB connection configs can be found at https://mongoosejs.com/docs/connections.html#options"
  input mongoConnectionConfigs {
    uri: String!
    options: JSON
  }

  "MySQL connection configs can be found at https://www.npmjs.com/package/mysql#connection-options"
  input mySQLConnectionConfigs {
    database: String!
    username: String!
    password: String!
    options: JSON
  }
`;

export default Schema;
