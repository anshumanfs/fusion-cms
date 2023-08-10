import lodash from 'lodash';

/**
 * Transforms a JSON schema to a GraphQL schema.
 *
 * @param {MongoSchemaInput} schema - The JSON schema to be transformed.
 * @return {MongoSchemaInput} - The transformed GraphQL schema.
 */
const jsonGraphqlMapper = (schema: MongoSchemaInput) => {
  const jsonData: MongoSchemaInput = lodash.cloneDeep(schema);
  for (const [key, value] of Object.entries(jsonData)) {
    switch (value.type) {
      case 'String':
        value.type = 'String';
        break;
      case 'BigInt':
        value.type = 'BigInt';
        break;
      case 'Number':
        value.type = 'Int';
        break;
      case 'PositiveNumber':
        value.type = 'PositiveInt';
        break;
      case 'NegativeNumber':
        value.type = 'NegativeInt';
        break;
      case 'Boolean':
        value.type = 'Boolean';
        break;
      case 'Buffer':
        value.type = 'Buffer';
        break;
      case 'Date':
        value.type = 'Date';
        break;
      case 'ObjectId':
        value.type = 'ObjectId';
        break;
      case 'Time':
        value.type = 'Time';
        break;
      case 'DateTime':
        value.type = 'DateTime';
        break;
      case 'Decimal128':
        value.type = 'Decimal128';
        break;
      case 'DbRef':
        value.type = 'DbRef';
        break;
      case 'JSON':
        value.type = 'JSON';
        break;
      case 'Mixed':
        value.type = 'Mixed';
        break;
      case 'Map':
        value.type = 'Map';
        break;
      case 'UUID':
        value.type = 'UUID';
        break;
      default:
        value.type = 'Any';
        break;
    }
    if (value.isArray) {
      value.type = `[${value.type}]`;
    }
  }
  return jsonData;
};

/**
 * Generates the index schema for the GraphQL API.
 *
 * @return {string} The generated index schema.
 */
const createIndexSchema = () => {
  const indexSchema = `
        const fs = require('fs-extra');
        const path = require('path');
        const directory = path.join(__dirname, './graphqlSchemas');
        const { typeDefs: scalarTypeDefs } = require('graphql-scalars');
        const { customScalarTypeDefs } = require('./libs/customScalars');
        const importedModules = [];
        fs.readdirSync(directory)
            .filter((file) => file.endsWith('.js'))
            .forEach((file) => {
                const moduleName = file.substring(0, file.length - 3);
                importedModules.push(require(path.join(directory, moduleName)));
            });
        const typeDefs = \`#graphql
            \${scalarTypeDefs}
            \${customScalarTypeDefs}
            scalar Any
            type Query
            type Mutation
        \`;
        module.exports = [...importedModules, typeDefs];
    `;
  return indexSchema;
};

/**
 * Generates a GraphQL schema based on the provided JSON schema.
 *
 * @param {MongoSchemaInput} jsonSchema - The JSON schema to generate the GraphQL schema from.
 * @param {string} singularCollectionName - The singular representative name of the collection.
 * @param {string} pluralCollectionName - The plural representative name of the collection.
 * @return {string} The generated GraphQL schema.
 */
const generateGraphqlSchema = (
  jsonSchema: MongoSchemaInput,
  singularCollectionName: string,
  pluralCollectionName: string
) => {
  const jsonSchemaWithGraphqlTypes = jsonGraphqlMapper(jsonSchema);
  let idType = 'ID!';
  // Generating graphql schema
  const queryFields = Object.keys(jsonSchemaWithGraphqlTypes).map((field) => {
    if (field === '_id') {
      idType = jsonSchemaWithGraphqlTypes[field].type + '!';
    }
    return `${field}: ${jsonSchemaWithGraphqlTypes[field].type}`;
  });

  const inputFields = Object.keys(jsonSchemaWithGraphqlTypes).map((field) => {
    let type = jsonSchemaWithGraphqlTypes[field].hasOwnProperty('ref')
      ? 'JSON'
      : jsonSchemaWithGraphqlTypes[field].type;
    if (jsonSchemaWithGraphqlTypes[field].required) {
      type = type + '!';
    }
    return `${field}: ${type}`;
  });

  const graphqlSchema = `
        const Schema = \`#graphql
            extend type Query {
              ${singularCollectionName}(filters:JSONObject): ${singularCollectionName}
              ${pluralCollectionName}(filters:JSONObject, options:QueryOptions): [${singularCollectionName}]
              count_${pluralCollectionName}(filters:JSONObject): Int
              aggregate_${pluralCollectionName}(pipeline:[JSON!]!): JSON
            }

            extend type Mutation {
              create_${singularCollectionName}(input:${singularCollectionName}Input): ${singularCollectionName}
              update_${singularCollectionName}(filters:JSONObject, updates: ${singularCollectionName}Input): ${singularCollectionName}
              delete_${singularCollectionName}(filters:JSONObject): ${singularCollectionName}
            }

            input ${singularCollectionName}Input {
                ${inputFields.join('\n')}
            }

            type ${singularCollectionName} {
                ${queryFields.join('\n')}
            }

            input QueryOptions {
                allowDiskUse: Boolean
                batchSize: Int
                comment: String
                hint: JSON
                limit: Int!
                projection: JSONObject
                readPreference: String
                skip: Int
                sort: JSONObject
            }\`;
        module.exports = Schema;
    `;
  return graphqlSchema;
};

export { generateGraphqlSchema, createIndexSchema };
