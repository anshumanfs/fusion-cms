import chalk from 'chalk';

const env = process.env.NODE_ENV || 'development';

const log = (message: string) => {
  if (env === 'development') {
    console.log(message);
  }
};

const getTime = () => {
  return new Date().toISOString();
};

const logger = {
  info: (message: string) => {
    log(`${chalk.cyan(`[INFO]`)} ${message}`);
  },
  error: (message: string) => {
    log(`${chalk.red(`[ERROR]`)} ${message}`);
  },
  warn: (message: string) => {
    log(`${chalk.yellow(`[WARN]`)} ${message}`);
  },
  debug: (message: string) => {
    log(`${chalk.blue(`[DEBUG]`)} ${message}`);
  },
  log: (message: string) => {
    log(`${chalk.white(`[LOG]`)} ${message}`);
  },
  success: (message: string) => {
    log(`${chalk.green(`[SUCCESS]`)} ${message}`);
  },
  verbose: (message: string) => {
    log(`${chalk.magenta(`[VERBOSE]`)} ${message}`);
  },
  http: (message: string) => {
    log(`${chalk.blue(`[HTTP]`)} ${message}`);
  },
};

export default logger;
