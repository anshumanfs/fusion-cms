import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';
import config from '../../config.json';
const { Types, index } = require('../../templates/mongo/utils/schemaHelper');

/**
 * this schema is used to store metadata for tables
 * like storing other data related to user table
 * example: storing user's profile image, user's address, etc
 * {
 *  tableName: 'cms_users',
 *  key: 'profileImage',
 *  value: 'https://example.com/image.jpg'
 * }
 */
const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId(),
    tableName: index(Types.String()),
    referenceId: index(Types.ObjectId()),
    key: index(Types.String()),
    value: index(Types.String()),
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
    autoIndex: true,
  }
);
const model = conn.model('cms_table_metas', QuerySchema, 'cms_table_metas');
const services = mongooseQueryServices(model);
export { model, services };
