import { gql } from 'graphql-tag';

const userSchema = gql`
  extend type Query {
    getUser(id: ID!): User
    getUsers: [User]!
  }

  extend type Mutation {
    registerUser(email: String!, password: String!): User | Response
    registerAdmin(firstName: String!, lastName: String!, email: String!, password: String!): User | Response
    login(email: String!, password: String!): String | Response
    modifyUser(id: ID!, email: String, role: String, firstName: String, lastName: String): User
    changePassword(id: ID!, password: String!): PasswordChangeResponse
  }

  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    role: String
    createdAt: String
    updatedAt: String
  }

  type Response {
    message: String
    status: Boolean
  }
`;

export default userSchema;
