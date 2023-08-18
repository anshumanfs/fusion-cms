import { jsonToQueryType, jsonToCreateType, jsonToUpdateType } from './utils/jsonToGraphQL';

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
        const { customScalarTypeDefs } = require('./utils/customScalar');
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
  const queryType = jsonToQueryType(jsonSchema, singularCollectionName);
  const createType = jsonToCreateType(jsonSchema, singularCollectionName);
  const updateType = jsonToUpdateType(jsonSchema, singularCollectionName);

  const graphqlSchema = `
        const Schema = \`#graphql
            extend type Query {
              ${singularCollectionName}(filters:JSONObject): ${singularCollectionName}
              ${pluralCollectionName}(filters:JSONObject, options:QueryOptions): [${singularCollectionName}]
              count_${pluralCollectionName}(filters:JSONObject): Int
              aggregate_${pluralCollectionName}(pipeline:[JSON!]!): JSON
            }

            extend type Mutation {
              create_${singularCollectionName}(input: ${singularCollectionName}Create!): ${singularCollectionName}
              update_${singularCollectionName}(filters: JSONObject!, updates: ${singularCollectionName}Update!): ${singularCollectionName}
              delete_${singularCollectionName}(filters: JSONObject!): ${singularCollectionName}
            }

            input QueryOptions {
              batchSize: Int
              comment: String
              hint: JSON
              limit: Int!
              projection: JSONObject
              readPreference: String
              skip: Int
              sort: JSONObject
            }
            
            ${queryType}
            ${createType}
            ${updateType}
            \`;
        module.exports = Schema;
    `;
  return graphqlSchema;
};

export { generateGraphqlSchema, createIndexSchema };
