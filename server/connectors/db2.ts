import { Sequelize } from 'sequelize';
import logger from '../libs/logger';

interface DB2ConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialectOptions?: object; // Optional additional dialect options
}

/**
 * Returns a Sequelize connection object for the given IBM Db2 database.
 *
 * @param {string} appName - The name of the application.
 * @param {DB2ConnectionOptions} config - The configuration options for the Db2 connection.
 * @return {Sequelize} The Sequelize connection object.
 */
function connector(appName: string, config: DB2ConnectionOptions) {
  try {
    const conn = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'db2',
      logging: process.env.ENABLE_SEQEULIZE_LOGGING === 'true',
      dialectOptions: config.dialectOptions || {},
    });

    conn.addHook('afterConnect', () => {
      logger.log(`✓ ${appName} IBM Db2 connected`);
    });

    return conn;
  } catch (error) {
    throw new Error(`✗ ${appName} IBM Db2 connection error: ${error}`);
  }
}

export { connector };
