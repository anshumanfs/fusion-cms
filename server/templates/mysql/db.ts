const generateDbConFile = (appName: string) => {
    const dbConString = `  
      const { Sequelize } = require('sequelize'); 
      const path = require('path'); 
      const { username, password, accountName, dbName, dbSchemaName, dbWarehouseName, roleName } = require('./app.json').dbCreds; 
      const conn = new Sequelize(dbName, null, null, { 
          dialect: 'snowflake', 
          dialectOptions: { 
            account: accountName, 
            role: roleName, 
            warehouse: dbWarehouseName, 
            schema: dbSchemaName 
          }, 
          username, 
          password, 
          database: dbName 
      }); 
      conn.authenticate().then(() => { 
        console.log('✔ ${appName} :- Database Connected Successfully'); 
      }).catch(err => { 
        console.error('❌ ${appName} :- Unable to establish Connection', err); 
      }); 
      module.exports =conn;`;
    return dbConString;
};

export { generateDbConFile };
