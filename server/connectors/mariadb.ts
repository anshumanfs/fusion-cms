import { Sequelize } from 'sequelize';
import logger from '../libs/logger';

interface MariaDBConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialectOptions?: object; // Optional additional dialect options
}

/**
 * Returns a Sequelize connection object for the given MariaDB database.
 *
 * @param {string} appName - The name of the application.
 * @param {MariaDBConnectionOptions} config - The configuration options for the MariaDB connection.
 * @return {Sequelize} The Sequelize connection object.
 */
function connector(appName: string, config: MariaDBConnectionOptions) {
  try {
    const conn = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'mariadb',
      logging: process.env.ENABLE_SEQEULIZE_LOGGING === 'true',
      dialectOptions: config.dialectOptions || {},
    });

    conn.addHook('afterConnect', () => {
      logger.log(`✓ ${appName} MariaDB connected`);
    });

    return conn;
  } catch (error) {
    throw new Error(`✗ ${appName} MariaDB connection error: ${error}`);
  }
}

export { connector };
