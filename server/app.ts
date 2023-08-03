import Express from 'express';
import next from 'next';
import path from 'path';
import { runAsMicroService, runAsMonolith } from './appRunner';

require('dotenv').config();
const port = process.env.PORT || 3000;
const host = 'localhost';
const node_env = 'NODE_ENV' in process.env ? process.env.NODE_ENV.trim() : 'development';
const app_mode = 'APP_MODE' in process.env ? process.env.APP_MODE.trim() : 'monolith';
const dev = node_env === 'development';
const childProcess = require('child_process');
const app: Express.Application = Express();
const checkEnv = ['local', 'uat', 'development'];

const startExpressApp = async () => {
  app.get('/test', (_req, res) => {
    res.json({ status: 'All good', nodeVersion: childProcess.execSync('node -v').toString().trim() });
  });
  app.use(Express.json());

  app.listen(port);
  console.log(`\n✓ API is running on: http://${host}:${port}`);

  if (app_mode === 'monolith') {
    await runAsMonolith({ app, dev });
  } else {
    await runAsMicroService();
  }
  // App:
  app.get('/ping', (_req, res) => {
    res.status(200).json({ status: 'Working fine ! Inside Ping' });
  });
  app.get('/configprops', (_req, res) => {
    res.status(200).json({ status: 'Working fine ! Inside Config-Props' });
  });
  app.get('/aaa', (_req, res) => {
    res.status(200).json({ status: 'AAA - 12' });
  });
};

if (checkEnv.includes(node_env)) {
  const nextApp = next({ dev, dir: path.resolve(__dirname, '../'), port });
  const handle = nextApp.getRequestHandler();
  nextApp
    .prepare()
    .then(async () => {
      await startExpressApp();
      // handles next js endpoints
      app.all('*', (req, res) => {
        return handle(req, res);
      });
    })
    .catch((err: any) => {
      console.log(err);
    });
} else {
  startExpressApp();
}
