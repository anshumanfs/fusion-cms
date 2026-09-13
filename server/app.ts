import Express from 'express';
import next from 'next';
import path from 'path';
import { runAsMicroService, runAsMonolith } from './appRunner';
import logger from './libs/logger';
import { applySentinel } from './libs/expressSentinel';

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const port = parseInt(process.env.PORT || '3000');
const host = '127.0.0.1';
const node_env = process?.env?.NODE_ENV?.trim() || 'development';
const app_mode = process?.env?.APP_MODE?.trim() || 'monolith';
const dev = node_env === 'development';
const childProcess = require('child_process');
const app: Express.Application = Express();
const checkEnv = ['local', 'development'];

const startExpressApp = async () => {
  app.get('/test', (_req, res) => {
    res.json({ status: 'All good', nodeVersion: childProcess.execSync('node -v').toString().trim() });
  });
  app.get('/ping', (_req, res) => {
    res.status(200).json({ status: 'Working fine ! Inside Ping' });
  });
  app.use(Express.json());
  applySentinel(app);

  if (app_mode === 'monolith') {
    await runAsMonolith({ app, dev });
  } else {
    await runAsMicroService();
  }

  app.listen(port);
  logger.info(`✓ API is running on: http://${host}:${port}`);
};

if (checkEnv.includes(node_env)) {
  const nextApp = next({ dev, dir: path.resolve(__dirname, '../../'), port, webpack: true });
  const handle = nextApp.getRequestHandler();
  nextApp
    .prepare()
    .then(async () => {
      try {
        await startExpressApp();
      } catch (err: any) {
        logger.error(err);
      }
      // handles next js endpoints
      app.all('*', (req, res) => {
        return handle(req, res);
      });
    })
    .catch((err: any) => {
      logger.error(err);
    });
} else {
  startExpressApp();
}
