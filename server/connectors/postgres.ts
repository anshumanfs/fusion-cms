import { Sequelize } from 'sequelize';
import logger from '../libs/logger';

interface PostgresConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean; // Optional SSL support
}

/**
 * Returns a Sequelize connection object for the given PostgreSQL database.
 *
 * @param {string} appName - The name of the application.
 * @param {PostgresConnectionOptions} config - The configuration options for the PostgreSQL connection.
 * @return {Sequelize} The Sequelize connection object.
 */
function connector(appName: string, config: PostgresConnectionOptions) {
  try {
    const conn = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'postgres',
      logging: process.env.ENABLE_SEQEULIZE_LOGGING === 'true',
      dialectOptions: config.ssl ? { ssl: { require: true, rejectUnauthorized: false } } : undefined,
    });

    conn.addHook('afterConnect', () => {
      logger.log(`✓ ${appName} PostgreSQL connected`);
    });

    return conn;
  } catch (error) {
    throw new Error(`✗ ${appName} PostgreSQL connection error: ${error}`);
  }
}

export { connector };
