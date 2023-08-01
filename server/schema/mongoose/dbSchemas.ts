import { Types } from '../../templates/mongo/utils/schemaHelper';
import { Schema } from 'mongoose';
import { conn } from '../../db';

const QuerySchema: any = new Schema(
    {
        _id: Types.ObjectId,
        appName: Types.String,
        singularCollectionName: Types.String,
        originalCollectionName: Types.String,
        pluralCollectionName: Types.String,
        schema: Types.Mixed,
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

export default conn.model('cms_dbSchemas', QuerySchema, 'cms_dbSchemas');
