import { gql } from 'graphql-tag';

const userSchema = gql`
  extend type Query {
    getUser(id: ID!): User
    getUsers(filters: JSON, page: Int): [User]!
    getOwnDetails: User
    getUsersByMetadata(metaDataFilter: JSON): [User]!
    getUsersCount: Int!
  }

  extend type Mutation {
    activateAccount(uniqueCode: String!): Response
    inviteUsersToRegister(emails: [String!]): Response
    changePasswordByOldPass(id: ID!, oldPassword: String!, newPassword: String!): Response
    forgotPassword(uniqueCode: String!, password: String!): Response
    login(email: String!, password: String!): Token
    modifyOwnDetails(firstName: String, lastName: String): User
    modifyUser(id: ID!, email: String, role: String, firstName: String, lastName: String, isBlocked: String): User
    modifyUserMetadata(id: ID!, metadata: JSON): User
    registerUser(
      email: String!
      firstName: String!
      lastName: String!
      password: String!
      inviteCode: String
      metadata: JSON
    ): User
    requestNewToken(refreshToken: String!): Token
    requestPasswordChangeEmail(email: String!): Response
  }

  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    role: String
    isVerified: Boolean
    isBlocked: Boolean
    metadata: JSON
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
