import { gql } from 'graphql-tag';

const userSchema = gql`
  extend type Query {
    getUser(id: ID!): User
    getUsers(page: Int): [User]!
  }

  extend type Mutation {
    activateAccount(uniqueCode: String!): Response
    changePasswordByOldPass(id: ID!, oldPassword: String!, newPassword: String!): Response
    forgotPassword(uniqueCode: String!, password: String!): Response
    login(email: String!, password: String!): AuthenticationResponse
    modifyUser(id: ID!, email: String, role: String, firstName: String, lastName: String): UserResponse
    registerUser(email: String!, firstName: String!, lastName: String!, password: String!): UserResponse
    requestNewToken(refreshToken: String!): AuthenticationResponse
    requestPasswordChangeEmail(email: String!): Response
  }

  union AuthenticationResponse = Token | Response
  union UserResponse = User | Response

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
  }

  type Token {
    token: String!
    refreshToken: String!
  }
`;

export default userSchema;
