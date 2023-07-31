declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            CIPHER_KEY: string;
        }
    }

    type MongoSchemaFields = {
        required: boolean;
        type: string;
        isArray: boolean;
        enums: string[] | undefined;
        ref: string | undefined;
        defaultValue: string | undefined;
        isNullable: boolean | false;
        isIndex: boolean | false;
        isUnique: boolean | false;
        isSparse: boolean | false;
    }

    type MySQLSchemaFields = {
        required: boolean | false;
        type: string;
        isArray: boolean | false;
        enums: string[] | undefined;
        defaultValue: string | undefined;
        isNullable: boolean | false;
        isIndex: boolean | false;
        isUnique: boolean | false;
        isSparse: boolean | false;
        isPrimaryKey: boolean | false;
    }

    type SchemaInput = {
        [key: string]: MongoSchemaFields | MySQLSchemaFields;
    }
}

export { }