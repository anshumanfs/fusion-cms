import lodash from 'lodash';

// Keys will be of type of Graphql types , and values will be the sequalize types.
const SQL_DATA_TYPES = {
  ARRAY: 'ARRAY',
  BigInt: 'BIGINT',
  Boolean: 'BOOLEAN',
  CHAR: 'CHAR',
  CIDR: 'CIDR',
  CITEXT: 'CITEXT',
  Date: 'DATE',
  DATEONLY: 'DATEONLY',
  DECIMAL: 'DECIMAL',
  DOUBLE: 'DOUBLE',
  ENUM: 'ENUM',
  Float: 'FLOAT',
  GEOGRAPHY: 'GEOGRAPHY',
  GEOMETRY: 'GEOMETRY',
  HSTORE: 'HSTORE',
  Int: 'INTEGER',
  INET: 'INET',
  JSON: 'JSON',
  JSONB: 'JSONB',
  MACADDR: 'MACADDR',
  MEDIUMINT: 'MEDIUMINT',
  DateTime: 'NOW',
  NUMBER: 'NUMBER',
  RANGE: 'RANGE',
  REAL: 'REAL',
  SMALLINT: 'SMALLINT',
  String: 'STRING',
  TEXT: 'TEXT',
  Time: 'TIME',
  TINYINT: 'TINYINT',
  TSVECTOR: 'TSVECTOR',
  UUID: 'UUID',
  UUIDV1: 'UUIDV1',
  UUIDV4: 'UUIDV4',
  VIRTUAL: 'VIRTUAL',
};
const arrayOfGqlDataTypes = Object.keys(SQL_DATA_TYPES);

const jsonGraphQLMapper = (schema: MySQLSchemaInput) => {
  const jsonData: MySQLSchemaInput = lodash.cloneDeep(schema);
  for (const [key, value] of Object.entries(jsonData)) {
    let type;
    arrayOfGqlDataTypes.forEach((element) => {
      if (SQL_DATA_TYPES[element as keyof typeof SQL_DATA_TYPES] === value.type) {
        type = element;
      }
    });
    if (type === undefined) {
      type = 'Any';
    }
    value.type = type;
    if (value.isArray) {
      value.type = `[${value.type}]`;
    }
  }
  return jsonData;
};

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
      const Schema = \#graphql 
        \${scalarTypeDefs} 
        \${customScalarTypeDefs} 
        scalar Any 
        type Query 
        type Mutation 
        extend type Query{ 
          RAW_SQL(sql:String, Type: String ): JSON 
        } 
        \; 
      module.exports = [...importedModules,Schema];`;
  return indexSchemaContent;
};

const generateGqlSchema = (
  jsonSchema: MySQLSchemaInput,
  singularCollectionName: string,
  pluralCollectionName: string
) => {
  const jsonSchemaWithGqlTypes: MySQLSchemaInput = jsonGraphQLMapper(jsonSchema);
  let idType = 'ID!';
  // Generating the GraphQL schema file
  const queryFields = Object.keys(jsonSchemaWithGqlTypes).map((field) => {
    if (field === '_id') {
      idType = jsonSchemaWithGqlTypes[field].type + '!';
    }
    return `${field}: ${jsonSchemaWithGqlTypes[field].type}`;
  });

  const inputFields = Object.keys(jsonSchemaWithGqlTypes).map((field) => {
    let type = jsonSchemaWithGqlTypes[field].hasOwnProperty('ref') ? 'Any' : jsonSchemaWithGqlTypes[field].type;
    if (jsonSchemaWithGqlTypes[field].required) {
      type = type + '!';
    }
    return `${field}: ${type}`;
  });

  const graphqlSchemaString = `  
      const Schema = \#graphql 
        extend type Query { 
              ${pluralCollectionName}( filter:JSON, options:QueryOptions ): [${singularCollectionName}] 
              ${singularCollectionName}(id: ${idType}): ${singularCollectionName} 
              count_${pluralCollectionName} : Int 
        } 
         
        type ${singularCollectionName} { 
          ${queryFields.join('\n  ')} 
        } 
   
        input ${singularCollectionName}Input { 
          ${inputFields.join('\n  ')} 
        } 
   
        input QueryOptions { 
          distinct: Boolean 
          group: Any 
          limit: Int 
          offset: Int 
          order: [Any] 
          subQuery: Boolean 
        } 
         
        extend type Mutation { 
          create_${singularCollectionName}( 
          input: ${singularCollectionName}Input 
          ): ${singularCollectionName} 
         
          update_${singularCollectionName}( 
            _id: ${idType}, 
            updates: ${singularCollectionName}Input 
          ): ${singularCollectionName} 
         
          delete_${singularCollectionName}(_id: ${idType}): ${singularCollectionName} 
        }\; 
      module.exports = Schema;`;
  return graphqlSchemaString;
};

export { generateGqlSchema, createIndexSchema };
