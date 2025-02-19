import { Sequelize } from 'sequelize';
import logger from '../libs/logger';

interface SQLiteConnectionOptions {
  storage: string;
}

/**
 * Returns a Sequelize connection object for the given SQLite database.
 *
 * @param {string} appName - The name of the application.
 * @param {SQLiteConnectionOptions} config - The configuration options for the SQLite connection.
 * @return {Sequelize} The Sequelize connection object.
 */
function connector(appName: string, config: SQLiteConnectionOptions) {
  try {
    const conn = new Sequelize({
      dialect: 'sqlite',
      storage: config.storage,
      logging: process.env.ENABLE_SEQUELIZE_LOGGING === 'true',
    });

    conn.addHook('afterConnect', () => {
      logger.log(`✓ ${appName} SQLite connected`);
    });

    return conn;
  } catch (error) {
    throw new Error(`✗ ${appName} SQLite connection error: ${error}`);
  }
}

export { connector };
