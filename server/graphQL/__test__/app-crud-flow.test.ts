import { graphql } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

const mockStores = {
  apps: [] as any[],
  dbSchemas: [] as any[],
  dbCredentials: [] as any[],
  accessSchemas: [] as any[],
};

const matchesQuery = (record: any, query: Record<string, any> = {}) =>
  Object.entries(query).every(([key, value]) => record[key] === value);

const makeCollection = (store: any[]) => ({
  find: jest.fn(async (query: Record<string, any> = {}) => store.filter((record) => matchesQuery(record, query))),
  findOne: jest.fn(async (query: Record<string, any> = {}) => store.find((record) => matchesQuery(record, query))),
  deleteOne: jest.fn(async (query: Record<string, any> = {}) => {
    const index = store.findIndex((record) => matchesQuery(record, query));

    if (index === -1) {
      return { deletedCount: 0 };
    }

    store.splice(index, 1);
    return { deletedCount: 1 };
  }),
  deleteMany: jest.fn(async (query: Record<string, any> = {}) => {
    const beforeCount = store.length;
    const remaining = store.filter((record) => !matchesQuery(record, query));
    store.splice(0, store.length, ...remaining);
    return { deletedCount: beforeCount - remaining.length };
  }),
  findOneAndUpdate: jest.fn(async (query: Record<string, any> = {}, update: any = {}, options: any = {}) => {
    let record = store.find((existingRecord) => matchesQuery(existingRecord, query));

    if (!record && options.upsert) {
      record = { ...query };
      store.push(record);
    }

    if (!record) {
      return null;
    }

    Object.assign(record, update);
    return record;
  }),
  findOneAndDelete: jest.fn(async (query: Record<string, any> = {}) => {
    const index = store.findIndex((record) => matchesQuery(record, query));

    if (index === -1) {
      return null;
    }

    const [deletedRecord] = store.splice(index, 1);
    return deletedRecord;
  }),
});

const mockDbModels = {
  apps: makeCollection(mockStores.apps),
  dbSchemas: makeCollection(mockStores.dbSchemas),
  dbCredentials: makeCollection(mockStores.dbCredentials),
  accessSchema: makeCollection(mockStores.accessSchemas),
};

jest.mock('../../db', () => ({
  dbModels: mockDbModels,
}));

jest.mock('../../templates/mongo', () => ({
  createApp: jest.fn(async (input: any) => {
    mockStores.apps.push({ appName: input.appName, dbType: input.dbType, running: false });
    mockStores.dbCredentials.push({ appName: input.appName, env: input.env, dbType: input.dbType });
    return input;
  }),
  createDbModels: jest.fn(async (input: any) => {
    mockStores.dbSchemas.push(input);
    return input;
  }),
}));

jest.mock('../../templates/mysql', () => ({
  createApp: jest.fn(async (input: any) => {
    mockStores.apps.push({ appName: input.appName, dbType: input.dbType, running: false });
    mockStores.dbCredentials.push({ appName: input.appName, env: input.env, dbType: input.dbType });
    return input;
  }),
  createDbModels: jest.fn(async (input: any) => {
    mockStores.dbSchemas.push(input);
    return input;
  }),
}));

const getSchema = () => {
  const typeDefs = require('../schemas');
  const resolvers = require('../resolvers');
  return makeExecutableSchema({ typeDefs, resolvers });
};

const contextValue = {
  req: {
    body: {
      variables: {},
    },
  },
};

describe('GraphQL app CRUD flow', () => {
  beforeEach(() => {
    mockStores.apps.splice(0);
    mockStores.dbSchemas.splice(0);
    mockStores.dbCredentials.splice(0);
    mockStores.accessSchemas.splice(0);
    Object.values(mockDbModels).forEach((collection) =>
      Object.values(collection).forEach((mockFn: any) => mockFn.mockClear?.())
    );
  });

  it('creates, lists, runs, and removes an app through the executable GraphQL schema', async () => {
    const schema = getSchema();

    const createResult = await graphql({
      schema,
      source: `
        mutation CreateApp($input: createApp!) {
          createApp(input: $input) { message }
        }
      `,
      variableValues: {
        input: {
          appName: 'blog',
          dbType: 'mongo',
          env: 'development',
          mongo: {
            uri: 'mongodb://127.0.0.1:27017/blog',
          },
        },
      },
      contextValue,
    });
    expect(createResult.errors).toBeUndefined();
    expect(createResult.data?.createApp).toEqual({ message: 'App created successfully' });

    const listResult = await graphql({
      schema,
      source: '{ getAppsData { appName dbType running schemas { originalCollectionName } } }',
      contextValue,
    });
    expect(listResult.errors).toBeUndefined();
    expect(listResult.data?.getAppsData).toEqual([{ appName: 'blog', dbType: 'mongo', running: false, schemas: [] }]);

    const runResult = await graphql({
      schema,
      source: 'mutation { runApp(appName: "blog") { message } }',
      contextValue,
    });
    expect(runResult.errors).toBeUndefined();
    expect(runResult.data?.runApp).toEqual({ message: 'App started successfully' });

    mockStores.apps[0].running = false;
    const removeResult = await graphql({
      schema,
      source: 'mutation { removeApp(appName: "blog") }',
      contextValue,
    });
    expect(removeResult.errors).toBeUndefined();
    expect(removeResult.data?.removeApp).toEqual({
      deletedApp: { deletedCount: 1 },
      deletedCredentials: { deletedCount: 1 },
    });
  });
});

