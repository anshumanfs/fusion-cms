import { gql } from 'graphql-tag';

const schema = gql`
  extend type Query {
    getAppSchemas(appName: String!): [appSchema]!
    getAppSchema(appName: String!, collectionName: String!): appSchema
  }

  extend type Mutation {
    createAppSchema(input: appSchemaInput!): JSON
    removeAppSchema(appName: String!, collectionName: String!): JSON
  }

  type appSchema {
    _id: ID
    appName: String
    singularCollectionName: String
    pluralCollectionName: String
    originalCollectionName: String
    schema: JSON
  }

  input appSchemaInput {
    _id: ID
    appName: String!
    singularCollectionName: String!
    pluralCollectionName: String!
    originalCollectionName: String!
    schema: JSON!
  }
`;

export default schema;
