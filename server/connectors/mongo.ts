import mongoose from 'mongoose';

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

export default function connect(config: MongooseConfig) {
  const { uri, options } = config;
  const conn = mongoose.createConnection(uri, options);
  return conn;
}
