import { jsonToQueryType, jsonToCreateType, jsonToUpdateType, optionsTypes } from './utils/jsonToGraphQL';

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
        const mysqlCustomScalarTypeDefs = require('../../templates/mysql/utils/customScalar');
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
            \${mysqlCustomScalarTypeDefs.customScalarTypeDefs}
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
  pluralCollectionName: string,
  appJson: any
) => {
  const queryType = jsonToQueryType(jsonSchema, singularCollectionName, appJson);
  const createType = jsonToCreateType(jsonSchema, singularCollectionName);
  const updateType = jsonToUpdateType(jsonSchema, singularCollectionName);

  const graphqlSchema = `
        const Schema = \`#graphql
            extend type Query {
              ${singularCollectionName}(filters:JSONObject, options:findOneOptions): ${singularCollectionName}
              ${pluralCollectionName}(filters:JSONObject, options:findOptions): [${singularCollectionName}]
              count_${pluralCollectionName}(filters:JSONObject): Int
              aggregate_${pluralCollectionName}(pipeline:[JSON!]!): JSON
            }

            extend type Mutation {
              create_${singularCollectionName}(input: ${singularCollectionName}Create!): ${singularCollectionName}
              update_${singularCollectionName}(filters: JSONObject!, updates: ${singularCollectionName}Update!, options:updateOptions): ${singularCollectionName}
              delete_${singularCollectionName}(filters: JSONObject!, options:deleteOptions): ${singularCollectionName}
            }

            ${queryType}
            ${createType}
            ${updateType}
            ${optionsTypes}
            \`;
        module.exports = Schema;
    `;
  return graphqlSchema;
};

export { generateGraphqlSchema, createIndexSchema };
