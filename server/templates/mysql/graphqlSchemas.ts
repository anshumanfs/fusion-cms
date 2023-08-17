import { jsonToQueryType, jsonToCreateType, jsonToUpdateType } from './utils/jsonToGraphQL';

const createIndexSchema = () => {
  const indexSchemaContent = `  
      const fs = require('fs-extra'); 
      const path = require('path'); 
      const directory = path.resolve(__dirname,'./graphQlSchemas');
      const { customScalarTypeDefs } = require('./utils/customScalar'); 
      const importedModules = []; 
      fs.readdirSync(directory) 
        .filter((file) => file.endsWith('.js')) 
        .forEach((file) => { 
          const moduleName = file.substring(0, file.length - 3); 
          importedModules.push(require(path.join(directory, file))); 
        }); 
      const Schema = \`#graphql
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
  const createType = jsonToCreateType(jsonSchema, singularCollectionName);
  const updateType = jsonToUpdateType(jsonSchema, singularCollectionName);
  const graphqlSchemaString = `  
      const Schema = \`#graphql 
        extend type Query { 
          ${pluralCollectionName}(where:JSON, order:JSON, group:String, limit:Int, offset:Int): [${singularCollectionName}]
          
          ${singularCollectionName}(where:JSON, order:JSON, group:String): ${singularCollectionName} 
          
          count_${pluralCollectionName}(where:JSON) : Int
        }
        extend type Mutation {
          create_${singularCollectionName}(input:${singularCollectionName}Create!): ${singularCollectionName} 
         
          update_${singularCollectionName}(where:JSON!, updates:${singularCollectionName}Update!): ${singularCollectionName} 
         
          delete_${singularCollectionName}(where:JSON!): ${singularCollectionName} 
        }
        
        ${queryType}
        ${createType}
        ${updateType}\`; 
      module.exports = Schema;`;
  return graphqlSchemaString;
};

export { generateGqlSchema, createIndexSchema };
