import { Sequelize } from 'sequelize';
import logger from '../libs/logger';

interface MSSQLConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialectOptions?: object; // Optional additional dialect options
}

/**
 * Returns a Sequelize connection object for the given MSSQL database.
 *
 * @param {string} appName - The name of the application.
 * @param {MSSQLConnectionOptions} config - The configuration options for the MSSQL connection.
 * @return {Sequelize} The Sequelize connection object.
 */
function connector(appName: string, config: MSSQLConnectionOptions) {
  try {
    const conn = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'mssql',
      logging: process.env.ENABLE_SEQEULIZE_LOGGING === 'true',
      dialectOptions: config.dialectOptions || {
        options: {
          encrypt: true, // Required for Azure SQL
          enableArithAbort: true,
        },
      },
    });

    conn.addHook('afterConnect', () => {
      logger.log(`✓ ${appName} MSSQL connected`);
    });

    return conn;
  } catch (error) {
    throw new Error(`✗ ${appName} MSSQL connection error: ${error}`);
  }
}

export { connector };
