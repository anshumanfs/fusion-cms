import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';
const { Types, index, addEnums } = require('../../templates/mongo/utils/schemaHelper');

/**
 * This is the schema for SentinelLogs
 * This is used to store the logs of users who have been blocked,
 * and the reason for blocking them. Ips, emails, and emailSentCount etc
 *
 */
const SentinelLogs: any = new Schema(
  {
    _id: Types.ObjectId(),
    key: index(addEnums(Types.String(), ['ip', 'email', 'emailSentCount'])),
    value: index(Types.String()),
    blocked: index(Types.Boolean()),
    reason: index(Types.String()),
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
const model = conn.model('cms_table_sentinel_logs', SentinelLogs, 'cms_table_sentinel_logs');
const services = mongooseQueryServices(model);
export { model, services };
