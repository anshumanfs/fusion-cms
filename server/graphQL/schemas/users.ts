import { gql } from 'graphql-tag';

const userSchema = gql`
  extend type Query {
    getUser(id: ID!): User
    getUsers(page: Int): [User]!
    getUsersCount: Int!
  }

  extend type Mutation {
    activateAccount(uniqueCode: String!): Response
    changePasswordByOldPass(id: ID!, oldPassword: String!, newPassword: String!): Response
    forgotPassword(uniqueCode: String!, password: String!): Response
    login(email: String!, password: String!): Token
    modifyUser(id: ID!, email: String, role: String, firstName: String, lastName: String): User
    registerUser(email: String!, firstName: String!, lastName: String!, password: String!): User
    requestNewToken(refreshToken: String!): Token
    requestPasswordChangeEmail(email: String!): Response
  }

  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    role: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Response {
    message: String
  }

  type Token {
    token: String!
    refreshToken: String!
  }
`;

export default userSchema;
