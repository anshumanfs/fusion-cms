import { Sequelize } from 'sequelize';
import logger from '../libs/logger';

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
  try {
    const conn = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'mysql',
      logging: process.env.ENABLE_SEQEULIZE_LOGGING === 'true',
    });
    conn.addHook('afterConnect', (connection: any) => {
      logger.log(`✓ ${appName} MySQL connected`);
    });
    return conn;
  } catch (error) {
    throw new Error(`✗ ${appName} MySQL connection error: ${error}`);
  }
}

export { connector };
