import lodash from 'lodash';

/**
 * Transforms a JSON schema to a GraphQL schema.
 *
 * @param {SchemaInput} schema - The JSON schema to be transformed.
 * @return {SchemaInput} - The transformed GraphQL schema.
 */
const jsonGraphqlMapper = (schema: SchemaInput) => {
    const jsonData: SchemaInput = lodash.cloneDeep(schema);
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
                value.type = 'ID';
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
}

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
}

