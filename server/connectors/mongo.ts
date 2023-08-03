import mongoose from 'mongoose';
import Event from 'events';

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
  const { uri, options } = config;
  const conn = mongoose.createConnection(uri, options);
  conn.on('connected', () => {
    console.log(`✓ ${appName} MongoDB connected`);
  });
  conn.on('error', (err: any) => {
    console.log(`✗ ${appName} MongoDB connection error: ${err}`);
  });
  return conn;
}

export { connector };
