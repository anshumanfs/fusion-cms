const Schema = `#graphql 
  extend type Query { 
    getdbCred(appName: String!, env: environmentTypes!): dbCred 
    getdbCreds(filter: JSON): [dbCred]! 
  } 
 
  extend type Mutation { 
    createdbCred(input: createdbCred!): dbCred 
    updatedbCred(input: createdbCred!): dbCred 
    removedbCred(appName: String!, env: environmentTypes!): JSON 
  } 
 
  type dbCred { 
    _id: ID, 
    appName: String 
    sslFileName: String 
    env: String 
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
 
  input createdbCred{ 
    appName: String! 
    mongo: createMongo  
    snowflake: createSnowflake 
    dbType: databaseTypes! 
    env: environmentTypes! 
  } 
 
  input createMongo { 
    dbUsername: String! 
    dbPassword: String! 
    dbUrl: String! 
    useSSL: Boolean 
  } 
 
  input createSnowflake { 
    username: String! 
    password: String! 
    accountName: String! 
    dbName: String! 
    dbSchemaName: String! 
    dbWarehouseName: String! 
    roleName: String ! 
  } `;

export default Schema;
