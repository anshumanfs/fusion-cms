import { z } from 'zod';

const mongooseConnectionSchema = z.union([
  z.string().url(),
  z.string().startsWith('mongodb://') || z.string().startsWith('mongodb+srv://'),
]);

const mongooseConfigSchema = z.object({
  uri: mongooseConnectionSchema,
  options: z.optional(
    z
      .object({
        bufferCommands: z.boolean(),
        autoIndex: z.boolean(),
        dbName: z.string(),
        user: z.string(),
        pass: z.string(),
        maxPoolSize: z.number(),
        minPoolSize: z.number(),
        socketTimeoutMS: z.number(),
        family: z.number(),
        authSource: z.string(),
        serverSelectionTimeoutMS: z.number(),
        heartbeatFrequencyMS: z.number(),
      })
      .partial()
  ),
});

const sequelizeConfigSchema = z.object({
  dialect: z.optional(z.string()),
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
  logging: z.optional(z.boolean()),
});

const metaDataDbSchema = z.object({
  type: z.string(),
  orm: z.string(),
  configs: z.union([mongooseConfigSchema, sequelizeConfigSchema]),
});

const secretSchema = z.object({
  bearerSecret: z.string(),
  refreshTokenSecret: z.string(),
  apiKeySecret: z.string(),
  passwordSecret: z.string(),
});

const configJsonSchema = z.object({
  metadataDb: metaDataDbSchema,
  secrets: secretSchema,
});

export { configJsonSchema, metaDataDbSchema, secretSchema };
