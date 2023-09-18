const generateDbConFile = (appName: string) => {
  const dbConString = `  
      const { Sequelize } = require('sequelize'); 
      const { database, username, password, options } = require('./app.json').dbCredentials; 
      const conn = new Sequelize(database, username, password, { 
          dialect: 'mysql',
          logging: false, 
          dialectOptions: options
      });
      const logger = require('../../libs/logger');
      conn.authenticate().then(() => { 
        logger.default.log('✓ ${appName} :- Database Connected Successfully'); 
      }).catch(err => { 
        logger.default.error('✗ ${appName} :- Unable to establish Connection', err); 
      }); 
      module.exports =conn;`;
  return dbConString;
};

export { generateDbConFile };
