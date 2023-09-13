declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      CMS_ENV: 'development' | 'testing' | 'production' | 'performance';
      APP_MODE: 'monolith' | 'microservice';
      PORT: string;
      CIPHER_KEY: string;
    }
  }

  type DbModelsInput = {
    originalCollectionName: string;
    singularCollectionName: string;
    pluralCollectionName: string;
    schema: SchemaInput;
    appName: string;
    dbType: string;
  };

  type MongoSchemaFields = {
    required: boolean;
    type: string;
    isArray: boolean;
    enums: string | undefined | null;
    ref: string | undefined;
    defaultValue: string | undefined;
    isNullable: boolean | false;
    isIndex: boolean | false;
    isUnique: boolean | false;
    isSparse: boolean | false;
    foreignField: string | undefined;
  };

  type MongoSchemaInput = {
    [key: string]: MongoSchemaFields;
  };
}

export {};
