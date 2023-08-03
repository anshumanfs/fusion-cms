import { Sequelize } from 'sequelize';

interface MySQLConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

function connector(appName: string, config: MySQLConnectionOptions) {
  const conn = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
  });

  conn.addHook('afterConnect', (connection: any) => {
    console.log(`✓ ${appName} MySQL connected`);
  });
  conn.addHook('afterDisconnect', () => {
    console.log(`✗ ${appName} MySQL disconnected`);
  });
  return conn;
}

export { connector };
