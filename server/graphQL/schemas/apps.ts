const Schema = `#graphql 
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
   
  enum environmentTypes{ 
    dev 
    sit 
    uat 
    perf 
    prod 
  } 
 
  enum databaseTypes{ 
    mongo 
    snowflake 
  } 
 
  input createApp{ 
    appName: String! 
    mongo: createMongo  
    mysql: createMySQL 
    dbType: databaseTypes! 
    env: environmentTypes! 
  } 
 
  input createMongo { 
    dbUsername: String! 
    dbPassword: String! 
    dbUrl: String! 
    useSSL: Boolean 
  } 
 
  input createMySQL { 
    username: String!
    password: String! 
    accountName: String! 
    dbName: String! 
    dbSchemaName: String! 
    dbWarehouseName: String! 
    roleName: String ! 
  } `;

export default Schema;
