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
    runApp(appName: String!): Message
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
    mongo: mongoConnection
    mysql: mySQLConnection
    dbType: databaseTypes!
    env: environmentTypes!
  }

  "MongoDB connection options can be found at https://mongoosejs.com/docs/connections.html#options"
  input mongoConnection {
    uri: String!
    options: JSON
  }

  "MySQL connection options can be found at https://www.npmjs.com/package/mysql#connection-options"
  input mySQLConnection {
    database: String!
    username: String!
    password: String!
    options: JSON
  }
`;

export default Schema;
