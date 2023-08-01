import { Types } from '../../templates/mongo/utils/schemaHelper';
import { Schema } from 'mongoose';
import { conn } from '../../db';
const QuerySchema: any = new Schema(
    {
        _id: Types.ObjectId,
        userName: Types.String,
        appName: Types.String,
        canCreate: Types.Mixed,
        canRead: Types.Mixed,
        canUpdate: Types.Mixed,
        canDelete: Types.Mixed,
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

export default conn.model('cms_accessSchemas', QuerySchema, 'cms_accessSchemas');
