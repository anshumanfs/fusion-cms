import { Sequelize } from 'sequelize';

interface MySQLConnectionOptions {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export default function connect(appName: string, config: MySQLConnectionOptions) {
    const conn = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        port: config.port,
        dialect: 'mysql',
    });

    conn.authenticate()
        .then(() => {
            console.log(`✓ ${appName} MySQL connected`);
        })
        .catch((err) => {
            console.log(`✗ ${appName} MySQL connection error: ${err}`);
        });
    return conn;
}
