import { graphql } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { oneWayEncoder } from '../../libs/encoderDecoder';

const mockSendMail = jest.fn();
const mockUsersStore: any[] = [];
const mockMetadataStore: any[] = [];
const mockAuthCodesStore: any[] = [];

const matchesQuery = (record: any, query: Record<string, any> = {}) =>
  Object.entries(query).every(([key, value]) => record[key] === value);

const mockDbModels = {
  users: {
    findOne: jest.fn(async (query: Record<string, any>) => mockUsersStore.find((user) => matchesQuery(user, query))),
    find: jest.fn(async (query: Record<string, any> = {}) =>
      mockUsersStore.filter((user) => matchesQuery(user, query))
    ),
    countDocuments: jest.fn(async () => mockUsersStore.length),
    create: jest.fn(async (user: any) => {
      const createdUser = {
        _id: `${mockUsersStore.length + 1}`,
        role: 'user',
        isVerified: false,
        isBlocked: false,
        ...user,
      };
      mockUsersStore.push(createdUser);
      return createdUser;
    }),
    findOneAndUpdate: jest.fn(async (query: Record<string, any>, update: any) => {
      const user = mockUsersStore.find((existingUser) => matchesQuery(existingUser, query));

      if (!user) {
        return null;
      }

      Object.assign(user, update);
      return user;
    }),
    getTableName: jest.fn(() => 'cms_users'),
  },
  metadata: {
    find: jest.fn(async (query: Record<string, any> = {}) =>
      mockMetadataStore.filter((metadata) => matchesQuery(metadata, query))
    ),
    createMany: jest.fn(async (metadata: any[]) => {
      mockMetadataStore.push(...metadata);
      return metadata;
    }),
  },
  authCodes: {
    findOne: jest.fn(async (query: Record<string, any>) =>
      mockAuthCodesStore.find((code) => matchesQuery(code, query))
    ),
    findOneAndUpdate: jest.fn(async (query: Record<string, any>, update: any) => {
      const authCode = mockAuthCodesStore.find((code) => matchesQuery(code, query));

      if (!authCode) {
        return null;
      }

      Object.assign(authCode, update);
      return authCode;
    }),
  },
};

jest.mock('../../db', () => ({
  dbModels: mockDbModels,
}));

jest.mock('../../libs/mailer', () => ({
  __esModule: true,
  default: (...args: any[]) => mockSendMail(...args),
}));

const getSchema = () => {
  const typeDefs = require('../schemas');
  const resolvers = require('../resolvers');
  return makeExecutableSchema({ typeDefs, resolvers });
};

describe('GraphQL auth flow', () => {
  beforeEach(() => {
    mockSendMail.mockClear();
    mockUsersStore.splice(0);
    mockMetadataStore.splice(0);
    mockAuthCodesStore.splice(0);
    Object.values(mockDbModels.users).forEach((mockFn: any) => mockFn.mockClear?.());
    Object.values(mockDbModels.metadata).forEach((mockFn: any) => mockFn.mockClear?.());
    Object.values(mockDbModels.authCodes).forEach((mockFn: any) => mockFn.mockClear?.());
  });

  it('registers the first user as admin through the executable GraphQL schema', async () => {
    const schema = getSchema();
    const result = await graphql({
      schema,
      source: `
        mutation Register($email: String!, $firstName: String!, $lastName: String!, $password: String!) {
          registerUser(email: $email, firstName: $firstName, lastName: $lastName, password: $password) {
            _id
            email
            role
            isVerified
          }
        }
      `,
      variableValues: {
        email: 'admin@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
        password: 'passw0rd',
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.registerUser).toEqual({
      _id: '1',
      email: 'admin@example.com',
      role: 'admin',
      isVerified: true,
    });
    expect(mockUsersStore[0].password).toBe(oneWayEncoder('passw0rd'));
  });

  it('logs in and refreshes tokens through the executable GraphQL schema', async () => {
    const schema = getSchema();
    mockUsersStore.push({
      _id: '1',
      email: 'admin@example.com',
      password: oneWayEncoder('passw0rd'),
      isVerified: true,
      isBlocked: false,
      role: 'admin',
    });

    const loginResult = await graphql({
      schema,
      source: `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            refreshToken
          }
        }
      `,
      variableValues: {
        email: 'admin@example.com',
        password: 'passw0rd',
      },
    });
    expect(loginResult.errors).toBeUndefined();

    const refreshToken = (loginResult.data?.login as any).refreshToken;
    const refreshResult = await graphql({
      schema,
      source: `
        mutation Refresh($refreshToken: String!) {
          requestNewToken(refreshToken: $refreshToken) {
            token
            refreshToken
          }
        }
      `,
      variableValues: { refreshToken },
    });

    expect(refreshResult.errors).toBeUndefined();
    expect(refreshResult.data?.requestNewToken).toEqual({
      token: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
