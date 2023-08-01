import { Types } from '../../templates/mongo/utils/schemaHelper';
import { Schema } from 'mongoose';
import { conn } from '../../db';

const QuerySchema: any = new Schema(
    {
        _id: Types.ObjectId,
        userName: Types.String,
        useSSO: Types.Boolean,
        contactPerson: Types.DomainId,
        hashedApiKey: Types.String,
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

export default conn.model('cms_users', QuerySchema, 'cms_users');
