import mongoose from 'mongoose';
import logger from '../libs/logger';

// write an interface for mongoose createConnection options
interface MongooseConfigOptions {
  bufferCommands: boolean;
  autoIndex: boolean;
  dbName: string;
  user: string;
  pass: string;
  maxPoolSize: number;
  minPoolSize: number;
  socketTimeoutMS: number;
  family: number;
  authSource: string;
  serverSelectionTimeoutMS: number;
  heartbeatFrequencyMS: number;
}

interface MongooseConfig {
  uri: string;
  options: Partial<MongooseConfigOptions>;
}

function connector(appName: string, config: MongooseConfig) {
  try {
    const { uri, options } = config;
    const conn = mongoose.createConnection(uri, options);
    conn.on('connected', () => {
      logger.log(`✓ ${appName} MongoDB connected`);
    });
    conn.on('error', (err: any) => {
      logger.error(`✗ ${appName} MongoDB connection error: ${err}`);
    });
    return conn;
  } catch (error) {
    throw new Error(`${appName} MongoDB connection error: ${error}`);
  }
}

export { connector };
