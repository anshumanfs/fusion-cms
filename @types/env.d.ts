declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
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
  };

  type MySQLSchemaFields = {
    required: boolean | false;
    type: string;
    isArray: boolean | false;
    enums: string | undefined | null;
    defaultValue: string | undefined;
    isNullable: boolean | false;
    isIndex: boolean | false;
    isUnique: boolean | false;
    isSparse: boolean | false;
    isPrimaryKey: boolean | false;
    autoIncrement: boolean | false;
  };

  type MySQLSchemaInput = {
    [key: string]: MySQLSchemaFields;
  };

  type MongoSchemaInput = {
    [key: string]: MongoSchemaFields;
  };
}

export {};
