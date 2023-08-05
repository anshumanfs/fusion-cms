import { Sequelize } from 'sequelize';

interface MySQLConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

/**
 * Returns a Sequelize connection object for the given MySQL database.
 *
 * @param {string} appName - The name of the application.
 * @param {MySQLConnectionOptions} config - The configuration options for the MySQL connection.
 * @return {Sequelize} The Sequelize connection object.
 */
function connector(appName: string, config: MySQLConnectionOptions) {
  const conn = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    logging: false,
  });
  conn.addHook('afterConnect', (connection: any) => {
    console.log(`✓ ${appName} MySQL connected`);
  });
  return conn;
}

export { connector };
