import { execFileSync } from 'child_process';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

const hasDocker = () => {
  try {
    execFileSync('docker', ['info'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const describeIfDocker = hasDocker() ? describe : describe.skip;

describeIfDocker('MySQL integration smoke', () => {
  let container: StartedMySqlContainer;
  let pool: Pool;

  beforeAll(async () => {
    container = await new MySqlContainer('mysql:8.4')
      .withDatabase('fusion_cms_test')
      .withUsername('fusion')
      .withUserPassword('fusion-pass')
      .start();

    pool = mysql.createPool(container.getConnectionUri());
    await pool.query(`
      CREATE TABLE integration_apps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        appName VARCHAR(255) NOT NULL UNIQUE,
        dbType VARCHAR(50) NOT NULL,
        running BOOLEAN NOT NULL DEFAULT false
      )
    `);
  }, 120000);

  afterAll(async () => {
    await pool?.end();
    await container?.stop();
  }, 30000);

  beforeEach(async () => {
    await pool.query('DELETE FROM integration_apps');
  });

  it('connects and performs CRUD against a real MySQL container', async () => {
    const [insertResult] = await pool.query<ResultSetHeader>(
      'INSERT INTO integration_apps (appName, dbType, running) VALUES (?, ?, ?)',
      ['MySQL Smoke App', 'mysql', false]
    );
    expect(insertResult.affectedRows).toBe(1);

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM integration_apps WHERE appName = ?', [
      'MySQL Smoke App',
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].dbType).toBe('mysql');

    const [updateResult] = await pool.query<ResultSetHeader>(
      'UPDATE integration_apps SET running = ? WHERE appName = ?',
      [true, 'MySQL Smoke App']
    );
    expect(updateResult.affectedRows).toBe(1);

    const [deleteResult] = await pool.query<ResultSetHeader>('DELETE FROM integration_apps WHERE appName = ?', [
      'MySQL Smoke App',
    ]);
    expect(deleteResult.affectedRows).toBe(1);
  });
});

