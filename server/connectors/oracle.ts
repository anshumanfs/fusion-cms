import { Sequelize } from 'sequelize';
import logger from '../libs/logger';

interface OracleConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialectOptions?: object; // Optional additional dialect options
}

/**
 * Returns a Sequelize connection object for the given Oracle database.
 *
 * @param {string} appName - The name of the application.
 * @param {OracleConnectionOptions} config - The configuration options for the Oracle connection.
 * @return {Sequelize} The Sequelize connection object.
 */
function connector(appName: string, config: OracleConnectionOptions) {
  try {
    const conn = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'oracle',
      logging: process.env.ENABLE_SEQEULIZE_LOGGING === 'true',
      dialectOptions: config.dialectOptions || {},
    });

    conn.addHook('afterConnect', () => {
      logger.log(`✓ ${appName} OracleDB connected`);
    });

    return conn;
  } catch (error) {
    throw new Error(`✗ ${appName} OracleDB connection error: ${error}`);
  }
}

export { connector };
