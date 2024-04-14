import lodash from 'lodash';
/**
 * Converts a JSON schema to a Snowflake schema.
 *
 * @param {MySQLSchemaInput} schema - The JSON schema to convert.
 * @return {string} - The MySQL schema string.
 */
const jsonToSequelizeSchema = (schema: MySQLSchemaInput) => {
  const jsonSchema: MySQLSchemaInput = lodash.cloneDeep(schema);
  let dbSchemaString = '{';
  for (const [key, value] of Object.entries(jsonSchema)) {
    let schemaPart = ``;
    let {
      isNullable,
      required,
      isArray,
      type,
      enums,
      defaultValue,
      isPrimaryKey,
      isUnique,
      autoIncrement,
    }: MySQLSchemaFields = value;
    if (required) {
      schemaPart = `{
        type: DataTypes.${type}
      }`;
    } else {
      schemaPart = `Optional({
        type: DataTypes.${type}
      })`;
    }

    if (!isNullable) {
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

    if (isPrimaryKey) {
      schemaPart = `primaryKey(${schemaPart})`;
    }
    if (isUnique) {
      if (isUnique === 'compositeIndex') {
        schemaPart = `unique(${schemaPart}, true)`;
      } else {
        schemaPart = `unique(${schemaPart})`;
      }
    }
    if (autoIncrement) {
      schemaPart = `autoIncrement(${schemaPart})`;
    }

    if (![undefined, null, ''].includes(enums)) {
      schemaPart = `addEnums(${schemaPart},${enums})`;
    }
    if (![undefined, null, ''].includes(defaultValue)) {
      schemaPart = `addDefaultValue(${schemaPart},${defaultValue})`;
    }

    dbSchemaString = dbSchemaString + key + ':' + schemaPart + ',';
  }
  dbSchemaString = dbSchemaString + '}';
  return dbSchemaString;
};

const relationshipParts = (pluralCollectionName: string, schema: MySQLSchemaInput, appJSON: any) => {
  const jsonSchema = lodash.cloneDeep(schema);
  const relationshipRequires = new Set();
  let relationshipRequirementString = '';
  let relationshipString = '';
  for (const [key, value] of Object.entries(jsonSchema)) {
    const { ref } = value;
    if (ref) {
      const { to, type, options } = ref;
      const record = appJSON.collections.find((e: any) => e.originalCollectionName === to);
      relationshipRequires.add(record.pluralCollectionName);
      relationshipString += `${pluralCollectionName}Schema.${type}(${
        record.pluralCollectionName
      }Schema, ${JSON.stringify(options)});\n`;
    }
  }
  relationshipRequires.forEach((requirement) => {
    relationshipRequirementString += `const ${requirement}Schema = require('./${requirement}.js');\n`;
  });
  return { relationshipRequirementString, relationshipString };
};

/**
 * Generates a Snowflake schema for a given collection.
 *
 * @param {string} originalCollectionName - The original name of the collection.
 * @param {string} pluralCollectionName - The plural name of the collection.
 * @param {MySQLSchemaInput} schema - The schema for the collection in MySQL format.
 * @return {string} The generated schema content.
 */
const generateMySqlSchema = (
  originalCollectionName: string,
  pluralCollectionName: string,
  schema: MySQLSchemaInput,
  appJson: any
) => {
  const schemaString = jsonToSequelizeSchema(schema);
  const { relationshipRequirementString, relationshipString } = relationshipParts(
    pluralCollectionName,
    schema,
    appJson
  );
  const schemaContentToWrite = ` 
    const conn = require('../db.js'); 
    const { DataTypes } = require('sequelize'); 
    const sequelize = require('../db.js'); 
    const { 
      addEnums, 
      unique, 
      addDefaultValue, 
      primaryKey, 
      ObjArray, 
      autoIncrement, 
      Nullable, 
      Types, 
      Optional 
    } = require('../utils/schemaHelper');
    ${relationshipRequirementString}
 
    const ${pluralCollectionName}Schema = sequelize.define('${pluralCollectionName}', 
        ${schemaString}, 
      { 
        tableName : '${originalCollectionName}',
        timestamps: false
      });
    ${relationshipString}
    ${pluralCollectionName}Schema.sync();
    module.exports =  ${pluralCollectionName}Schema;`;
  return schemaContentToWrite;
};

export { generateMySqlSchema };
