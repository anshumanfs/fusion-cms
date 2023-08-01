import { Types, addEnums } from '../../templates/mongo/utils/schemaHelper';
import { Schema } from 'mongoose';
import { conn } from '../../db';

const QuerySchema: any = new Schema(
    {
        _id: Types.ObjectId,
        appName: Types.String,
        port: Types.Number,
        running: Types.Boolean,
        isAppCompleted: Types.Boolean,
        dbType: addEnums(Types.String, ['mongo', 'snowflake']),
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
        },
        toObject: {
            getters: true,
        },
    }
);
QuerySchema.virtual('creds', {
    ref: 'gateway_dbCreds',
    localField: 'appName',
    foreignField: 'appName',
});

QuerySchema.virtual('schemas', {
    ref: 'cms_dbSchemas',
    localField: 'appName',
    foreignField: 'appName',
});

export default conn.model('cms_apps', QuerySchema, 'cms_apps');
