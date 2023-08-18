import lodash from 'lodash';

/**
 * Generates a Mongoose schema string from a JSON schema.
 *
 * @param {MongoSchemaInput} schema - The JSON schema to convert.
 * @returns {string} - The generated Mongoose schema string.
 */
const jsonToMongooseSchema = (schema: MongoSchemaInput) => {
  const jsonSchema = lodash.cloneDeep(schema);
  let dbSchemaString = '{';
  for (const [key, value] of Object.entries(jsonSchema)) {
    let schemaPart = ``;
    let { isNullable, required, isArray, type, enums, defaultValue, ref, isIndex, isUnique, isSparse } = value;
    type = type === 'DbRef' ? `DbRef('${ref}')` : `${type}()`;
    if (required) {
      schemaPart = `Types.${type}`;
    } else {
      schemaPart = `Optional(Types.${type})`;
    }

    if (!['true', true].includes(isNullable)) {
      if (isArray) {
        schemaPart = `ObjArray(${schemaPart})`;
      }
    } else {
      if (isArray) {
        schemaPart = `Nullable.ObjArray(ObjArray(${schemaPart}))`;
      } else {
        schemaPart = `Nullable.Types(${schemaPart})`;
      }
    }

    if (![undefined, null, ''].includes(enums)) {
      schemaPart = `addEnums(${schemaPart}, ${enums})`;
    }

    if (![undefined, null, ''].includes(defaultValue)) {
      schemaPart = `addDefaultValue(${schemaPart}, ${defaultValue})`;
    }

    if (isIndex) {
      schemaPart = `index(${schemaPart})`;
    }

    if (isUnique) {
      schemaPart = `unique(${schemaPart})`;
    }

    if (isSparse) {
      schemaPart = `sparse(${schemaPart})`;
    }
    dbSchemaString += `${key}: ${schemaPart},`;
  }
  dbSchemaString += '}';
  return dbSchemaString;
};

/**
 * Generates the content of a model file based on the provided parameters.
 *
 * @param {string} originalCollectionName - The name of the original collection.
 * @param {string} pluralCollectionName - The pluralized name of the collection.
 * @param {MongoSchemaInput} schema - The input schema for generating the model file content.
 * @return {string} The generated model file content.
 */
const generateModelFileContent = (
  originalCollectionName: string,
  pluralCollectionName: string,
  schema: MongoSchemaInput
) => {
  const dbSchemaString = jsonToMongooseSchema(schema);
  const modelFileContent = `
        const conn = require('../db');
        const mongoose = require('mongoose');
        const {addEnums, addDefaultValue, index, unique, sparse, ObjArray, Nullable, Types, Optional } = require('../utils/schemaHelper');
        const ${pluralCollectionName}Schema = new mongoose.Schema(
            ${dbSchemaString},
            {
                toObject: {
                    getters: true,
                },
                toJSON: {
                    getters: true,
                }
            }
        );
        module.exports = conn.model('${originalCollectionName}', ${pluralCollectionName}Schema, '${originalCollectionName}');
    `;
  return modelFileContent;
};

export { generateModelFileContent };
