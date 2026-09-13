import { execFileSync } from 'child_process';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

const { Client } = require('pg');

const hasDocker = () => {
  try {
    execFileSync('docker', ['info'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const describeIfDocker = hasDocker() ? describe : describe.skip;

describeIfDocker('PostgreSQL integration smoke', () => {
  let container: StartedTestContainer;
  let client: any;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:16-alpine')
      .withEnvironment({
        POSTGRES_DB: 'fusion_cms_test',
        POSTGRES_USER: 'fusion',
        POSTGRES_PASSWORD: 'fusion-pass',
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage(/database system is ready to accept connections/))
      .start();

    client = new Client({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      database: 'fusion_cms_test',
      user: 'fusion',
      password: 'fusion-pass',
    });
    await client.connect();
    await client.query(`
      CREATE TABLE integration_apps (
        id SERIAL PRIMARY KEY,
        "appName" VARCHAR(255) NOT NULL UNIQUE,
        "dbType" VARCHAR(50) NOT NULL,
        running BOOLEAN NOT NULL DEFAULT false
      )
    `);
  }, 120000);

  afterAll(async () => {
    await client?.end();
    await container?.stop();
  }, 30000);

  beforeEach(async () => {
    await client.query('DELETE FROM integration_apps');
  });

  it('connects and performs CRUD against a real PostgreSQL container', async () => {
    const insertResult = await client.query(
      'INSERT INTO integration_apps ("appName", "dbType", running) VALUES ($1, $2, $3) RETURNING id',
      ['Postgres Smoke App', 'postgres', false]
    );
    expect(insertResult.rowCount).toBe(1);

    const readResult = await client.query('SELECT * FROM integration_apps WHERE "appName" = $1', [
      'Postgres Smoke App',
    ]);
    expect(readResult.rows).toHaveLength(1);
    expect(readResult.rows[0].dbType).toBe('postgres');

    const updateResult = await client.query('UPDATE integration_apps SET running = $1 WHERE "appName" = $2', [
      true,
      'Postgres Smoke App',
    ]);
    expect(updateResult.rowCount).toBe(1);

    const deleteResult = await client.query('DELETE FROM integration_apps WHERE "appName" = $1', [
      'Postgres Smoke App',
    ]);
    expect(deleteResult.rowCount).toBe(1);
  });
});
