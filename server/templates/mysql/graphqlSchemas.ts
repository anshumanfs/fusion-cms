import { jsonToQueryType, jsonToMutationType } from './utils/jsonToGraphQL';

const createIndexSchema = () => {
  const indexSchemaContent = `  
      const fs = require('fs-extra'); 
      const path = require('path'); 
      const directory = path.resolve(__dirname,'./graphQlSchemas'); 
      const { typeDefs: scalarTypeDefs } = require('graphql-scalars'); 
      const { customScalarTypeDefs } = require('./utils/customScalars'); 
      const importedModules = []; 
      fs.readdirSync(directory) 
        .filter((file) => file.endsWith('.js')) 
        .forEach((file) => { 
          const moduleName = file.substring(0, file.length - 3); 
          importedModules.push(require(path.join(directory, file))); 
        }); 
      const Schema = \`#graphql 
        \${scalarTypeDefs} 
        \${customScalarTypeDefs} 
        scalar Any 
        type Query 
        type Mutation 
        extend type Query{ 
          RAW_SQL(sql:String, Type: String ): JSON 
        } 
        \`; 
      module.exports = [...importedModules,Schema];`;
  return indexSchemaContent;
};

const generateGqlSchema = (
  jsonSchema: MySQLSchemaInput,
  singularCollectionName: string,
  pluralCollectionName: string
) => {
  const queryType = jsonToQueryType(jsonSchema, singularCollectionName);
  const mutationType = jsonToMutationType(jsonSchema, singularCollectionName);
  const graphqlSchemaString = `  
      const Schema = \`#graphql 
        extend type Query { 
          ${pluralCollectionName}(filter:JSONObject, options:QueryOptions ): [${singularCollectionName}] 
          
          ${singularCollectionName}(filter:JSONObject): ${singularCollectionName} 
          
          count_${pluralCollectionName}(filter:JSONObject) : Int 
        }
        extend type Mutation {
          create_${singularCollectionName}(input:${singularCollectionName}Input): ${singularCollectionName} 
         
          update_${singularCollectionName}(filter:JSONObject!, updates:${singularCollectionName}Input): ${singularCollectionName} 
         
          delete_${singularCollectionName}(filter:JSONObject!): ${singularCollectionName} 
        }
        
        ${queryType}
        ${mutationType}
        input QueryOptions { 
          distinct: Boolean 
          group: Any 
          limit: Int 
          offset: Int 
          order: [Any] 
          subQuery: Boolean 
        }\`; 
      module.exports = Schema;`;
  return graphqlSchemaString;
};

export { generateGqlSchema, createIndexSchema };
