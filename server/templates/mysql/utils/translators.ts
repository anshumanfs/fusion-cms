import lodash from 'lodash';
import { Op } from 'sequelize';

const keys: any = Object.keys(Op) || [];

const sequelizeOperatorsMap: any = {};
for (const key of keys) {
  sequelizeOperatorsMap[`Op.${key}`] = Op[key as keyof typeof Op];
}

/**
 * Replaces specific strings in a given string with their corresponding Sequelize functions.
 *
 * @param {string} str - The string to perform replacements on.
 * @return {string} The modified string with replacements.
 */
const replaceString = (str: string) => {
  str = lodash.replace(str, /\$fn/g, 'sequelize.fn');
  str = lodash.replace(str, /\$col/g, 'sequelize.col');
  str = lodash.replace(str, /\$literal/g, 'sequelize.literal');
  str = lodash.replace(str, /\$cast/g, 'sequelize.cast');
  str = lodash.replace(str, /\$where/g, 'sequelize.where');
  str = lodash.replace(str, /\$and/g, 'sequelize.and');
  str = lodash.replace(str, /\$or/g, 'sequelize.or');
  return str;
};

/**
 * Translates the given `where` clause to Sequelize operators.
 *
 * @param {any} where - The `where` clause to be translated.
 * @param {any} sequelize - The Sequelize instance.
 * @return {any} The translated `where` clause.
 */
const translateWhereToSequelize = (where: any, sequelize: any) => {
  // iterate over whereClause and replace keys with sequelize operators
  // return the new query
  if (lodash.isString(where)) {
    where = replaceString(where);
    if (where.startsWith('sequelize.')) {
      where = eval(where);
    }
    return where;
  }
  const newWhere: Record<symbol | string, any> = {};
  for (const key in where) {
    const value = where[key];
    if (lodash.isPlainObject(value)) {
      newWhere[key] = translateWhereToSequelize(value, sequelize);
    } else if (sequelizeOperatorsMap.hasOwnProperty(key)) {
      newWhere[sequelizeOperatorsMap[key]] = value;
    } else {
      newWhere[key] = value;
    }
  }
  return newWhere;
};

/**
 * Translates attributes to Sequelize format.
 *
 * @param {any[]} attributes - The array of attributes to be translated.
 * @param {any} sequelize - The Sequelize instance.
 * @return {any[]} The translated attributes.
 */
const translateAttributesToSequelize = (attributes: any[], sequelize: any) => {
  attributes.forEach((attribute, index) => {
    if (lodash.isArray(attribute)) {
      attributes[index] = translateAttributesToSequelize(attributes[index], sequelize);
    } else if (lodash.isString(attribute)) {
      attributes[index] = replaceString(attributes[index]);
      if (attributes[index].startsWith('sequelize.')) {
        attributes[index] = eval(attributes[index]);
      }
    }
  });
  return attributes;
};

/**
 * Translates an order object to the Sequelize format.
 *
 * @param {any} order - The order object to be translated.
 * @param {any} sequelize - The Sequelize instance.
 * @return {any} The translated order object in the Sequelize format.
 */
const translateOrderToSequelize = (order: any, sequelize: any) => {
  if (lodash.isString(order)) {
    order = replaceString(order);
    if (order.startsWith('sequelize.')) {
      order = eval(order);
    }
    return order;
  }
  if (lodash.isArray(order)) {
    order.forEach((_, index) => {
      if (lodash.isArray(_)) {
        order[index] = translateAttributesToSequelize(order[index], sequelize);
      } else if (lodash.isString(_)) {
        order[index] = replaceString(order[index]);
        if (order[index].startsWith('sequelize.')) {
          order[index] = eval(order[index]);
        }
      }
    });
    return order;
  }
};

/**
 * Translates a JSON query to a Sequelize query object.
 *
 * @param {any} jsonQuery - The JSON query to be translated.
 * @param {any} connection - The Sequelize connection object.
 * @return {any} The translated Sequelize query object.
 */
const translateQueryToSequelize = (jsonQuery: any, connection: any) => {
  const Query = lodash.cloneDeep(jsonQuery);
  const where = Query.where || {};
  const attributes = Query.attributes || undefined;
  const order = Query.order || undefined;
  const group = Query.group || undefined; // default group to empty string
  const limit = Query.limit || 20; // default limit to 20
  const offset = Query.offset || 0; // default offset to 0
  const finalQuery: any = {
    where: translateWhereToSequelize(where, connection),
  };
  if (attributes) {
    finalQuery.attributes = translateAttributesToSequelize(attributes, connection);
  }
  if (order) {
    finalQuery.order = translateOrderToSequelize(order, connection);
  }
  if (limit) {
    finalQuery.limit = limit;
  }
  if (offset) {
    finalQuery.offset = offset;
  }
  if (group) {
    finalQuery.group = group;
  }
  finalQuery.include = {
    all: true,
    nested: true,
  };
  finalQuery.raw = true;
  return finalQuery;
};

const translateResponseAfterEagerLoading = (response: any, pluralCollectionName: string) => {
  const appJSON = require('../app.json');
  const keysMap: any = {};
  const schema = appJSON.collections.find(
    (collection: any) => collection.pluralCollectionName === pluralCollectionName
  ).schema;
  for (const key in schema) {
    if (schema[key].hasOwnProperty('ref')) {
      keysMap[key] = schema[key].ref.options.as;
    }
  }
  if (lodash.isArray(response)) {
  }

  if (lodash.isPlainObject(response)) {
  }
};

export {
  translateWhereToSequelize,
  translateAttributesToSequelize,
  translateOrderToSequelize,
  translateQueryToSequelize,
};
