import chalk from 'chalk';
import fs from 'fs-extra';

const env = process.env.NODE_ENV || 'development';
const logFile = '../../.logs/logs.txt';

const getTime = () => {
  return new Date().toISOString();
};

const log = (message: string) => {
  if (env === 'development') {
    console.log(message);
  } else {
    fs.ensureFileSync(logFile);
    fs.appendFileSync(logFile, `${getTime()} ${message}\n`);
  }
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
  event: (message: string) => {
    log(`${chalk.hex('#d604b0')(`[EVENT]`)} ${message}`);
  },
  log: (message: string) => {
    log(`${message}`);
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
