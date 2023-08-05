const generateDbConFile = (appName: string) => {
  const dbConString = `  
      const { Sequelize } = require('sequelize'); 
      const path = require('path'); 
      const { database, username, password, options } = require('./app.json').dbCreds; 
      const conn = new Sequelize(database, username, password, { 
          dialect: 'mysql', 
          dialectOptions: options
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
