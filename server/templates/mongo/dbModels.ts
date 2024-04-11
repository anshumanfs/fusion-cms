import lodash from 'lodash';

/**
 * Generates a Mongoose schema string from a JSON schema.
 *
 * @param {MongoSchemaInput} schema - The JSON schema to convert.
 * @returns {string} - The generated Mongoose schema string.
 */
const jsonToMongooseSchema = (schema: MongoSchemaInput, pluralCollectionName: string) => {
  const jsonSchema = lodash.cloneDeep(schema);
  const virtualTypes: any = {};
  let dbSchemaString = '{';
  for (const [key, value] of Object.entries(jsonSchema)) {
    let schemaPart = ``;
    let { isNullable, required, isArray, type, enums, defaultValue, ref, isIndex, isUnique, isSparse, foreignField } =
      value;

    type = type === 'DbRef' ? `DbRef('${ref}')` : `${type}()`;

    if (required) {
      schemaPart = `Types.${type}`;
    } else {
      schemaPart = `Optional(Types.${type})`;
    }

    if (type !== 'DbRef' && lodash.isString(ref)) {
      virtualTypes[`${key}_virtual`] = {
        ref,
        localField: key,
        foreignField: foreignField || '_id',
      };
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
  let virtualTypeString = '';
  Object.keys(virtualTypes).forEach((key) => {
    virtualTypeString += `${pluralCollectionName}Schema.virtual('${key}',${JSON.stringify(virtualTypes[key])});\n`;
  });

  return { dbSchemaString, virtualTypeString, virtualTypes };
};

const postHookGenerator = (operationName: any = 'find', virtuals: any = [], pluralCollectionName: string) => {
  let postHookString = ``;
  Object.keys(virtuals).forEach((virtual: any) => {
    postHookString += `
      ${pluralCollectionName}Schema.post("${operationName}", async function (docs,next) {
        if (lodash.isArray(docs)) {
          docs.forEach((doc) => {
            if (doc.hasOwnProperty("${virtual}")) {

              doc.${virtuals[virtual].localField} = doc.${virtual}.length > 1 ? doc.${virtual} : doc.${virtual}[0] || {};
              delete doc.${virtual};
            }
          });
        }
        if(lodash.isObject(docs)){
          if (docs.hasOwnProperty("${virtual}")) {
            docs.${virtuals[virtual].localField} = docs.${virtual}[0] || {};
            delete docs.${virtual};
          }
        }
      });
    `;
  });
  return postHookString;
};

const createPostHookString = (pluralCollectionName: string) => {
  return `
    ${pluralCollectionName}Schema.post("save", async function (docs,next) {
      const virtualArr = Object.keys(${pluralCollectionName}Schema.virtuals); 
      const fieldsToBeExcluded = ['_id', '__v', 'createdAt', 'updatedAt', 'id'];
      const virtualFields = virtualArr.filter((virtual) => !fieldsToBeExcluded.includes(virtual));
      docs = await docs.populate(virtualFields);
    });
  `;
};

const updatePostHookString = (pluralCollectionName: string) => {
  return `
    ${pluralCollectionName}Schema.post("findOneAndUpdate", async function (docs,next) {
      const virtualArr = Object.keys(${pluralCollectionName}Schema.virtuals); 
      const fieldsToBeExcluded = ['_id', '__v', 'createdAt', 'updatedAt', 'id'];
      const virtualFields = virtualArr.filter((virtual) => !fieldsToBeExcluded.includes(virtual));
      docs = await docs.populate(virtualFields);
    });`;
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
  const { dbSchemaString, virtualTypeString, virtualTypes } = jsonToMongooseSchema(schema, pluralCollectionName);
  const postHookFindString = postHookGenerator('find', virtualTypes, pluralCollectionName);
  const postHookFindOneString = postHookGenerator('findOne', virtualTypes, pluralCollectionName);
  const modelFileContent = `
        const conn = require('../db');
        const lodash = require('lodash');
        const mongoose = require('mongoose');
        const {addEnums, addDefaultValue, addRef, index, unique, sparse, ObjArray, Nullable, Types, Optional } = require('../utils/schemaHelper');
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
        ${virtualTypeString}
        ${postHookFindString}
        ${postHookFindOneString}
        ${createPostHookString(pluralCollectionName)}
        ${updatePostHookString(pluralCollectionName)}
        module.exports = conn.model('${originalCollectionName}', ${pluralCollectionName}Schema, '${originalCollectionName}');
    `;
  return modelFileContent;
};

export { generateModelFileContent };
