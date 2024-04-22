import { gql } from 'graphql-tag';

const Schema = gql`
  extend type Query {
    getAccessSchema(email: String!, appName: String!, endPointName: String!): AccessSchema
    getAccessSchemas(filter: JSON): [AccessSchema]!
  }

  extend type Mutation {
    createAccessSchema(
      email: String!
      appName: String!
      endPointName: String!
      isAllowed: String!
      allowedInChain: Boolean!
    ): AccessSchema
    removeAccessSchema(email: String!, appName: String!, endPointName: String!): AccessSchema
  }

  type AccessSchema {
    _id: ID
    email: String
    appName: String
    endPointName: String
    isAllowed: String
    allowedInChain: Boolean
  }
`;

export default Schema;
