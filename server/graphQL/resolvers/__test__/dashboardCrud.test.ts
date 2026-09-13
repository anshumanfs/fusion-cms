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

const mockMongoTemplate = {
  createApp: jest.fn(async (input: any) => input),
  createDbModels: jest.fn(async (input: any) => input),
};

const mockMysqlTemplate = {
  createApp: jest.fn(async (input: any) => input),
  createDbModels: jest.fn(async (input: any) => input),
};

jest.mock('../../../db', () => ({
  dbModels: mockDbModels,
}));

jest.mock('../../../templates/mongo', () => mockMongoTemplate);
jest.mock('../../../templates/mysql', () => mockMysqlTemplate);

describe('dashboard CRUD resolvers', () => {
  beforeEach(() => {
    mockStores.apps.splice(0);
    mockStores.dbSchemas.splice(0);
    mockStores.dbCredentials.splice(0);
    mockStores.accessSchemas.splice(0);
    Object.values(mockDbModels).forEach((collection) =>
      Object.values(collection).forEach((mockFn: any) => mockFn.mockClear?.())
    );
    Object.values(mockMongoTemplate).forEach((mockFn: any) => mockFn.mockClear());
    Object.values(mockMysqlTemplate).forEach((mockFn: any) => mockFn.mockClear());
  });

  it('creates, lists, toggles, and removes an application with credentials', async () => {
    const { createApp, getAppsData, removeApp, runApp } = await import('../apps');

    await expect(
      createApp(
        null,
        {
          input: {
            appName: 'blog',
            dbType: 'mongo',
            env: 'development',
            mongo: {
              uri: 'mongodb://127.0.0.1:27017/blog',
            },
          },
        },
        {
          req: {
            body: {
              variables: {},
            },
          },
        }
      )
    ).resolves.toEqual({ message: 'App created successfully' });
    expect(mockMongoTemplate.createApp).toHaveBeenCalledWith(
      {
        appName: 'blog',
        dbType: 'mongo',
        env: 'development',
        credentials: {
          uri: 'mongodb://127.0.0.1:27017/blog',
        },
      },
      {}
    );

    mockStores.apps.push({ appName: 'blog', dbType: 'mongo', running: false });
    mockStores.dbCredentials.push({ appName: 'blog', env: 'development' });
    mockStores.dbSchemas.push({ appName: 'blog', originalCollectionName: 'posts' });

    await expect(getAppsData(null, {})).resolves.toEqual([
      {
        appName: 'blog',
        dbType: 'mongo',
        running: false,
        schemas: [{ appName: 'blog', originalCollectionName: 'posts' }],
      },
    ]);

    await expect(runApp(null, { appName: 'blog' })).resolves.toEqual({ message: 'App started successfully' });
    expect(mockStores.apps[0].running).toBe(true);
    await expect(removeApp(null, { appName: 'blog' })).rejects.toThrow('The app is running');

    mockStores.apps[0].running = false;
    await expect(removeApp(null, { appName: 'blog' })).resolves.toEqual({
      deletedApp: { deletedCount: 1 },
      deletedCredentials: { deletedCount: 1 },
    });
  });

  it('creates, reads, lists, and removes application schemas through the template layer', async () => {
    const { createAppSchema, getAppSchema, getAppSchemas, removeAppSchema } = await import('../appSchemas');

    mockStores.apps.push({ appName: 'blog', dbType: 'mongo' });
    mockStores.dbSchemas.push({
      appName: 'blog',
      originalCollectionName: 'posts',
      schema: {
        title: {
          type: 'String',
        },
      },
    });

    const input = {
      appName: 'blog',
      originalCollectionName: 'posts',
      singularCollectionName: 'post',
      pluralCollectionName: 'posts',
      schema: {
        title: {
          type: 'String',
        },
      },
    };

    await expect(createAppSchema(null, { input })).resolves.toEqual({
      message: 'App Schema Created Successfully',
      status: 1,
    });
    expect(mockMongoTemplate.createDbModels).toHaveBeenCalledWith(input);
    await expect(getAppSchema(null, { appName: 'blog', originalCollectionName: 'posts' })).resolves.toMatchObject({
      appName: 'blog',
      originalCollectionName: 'posts',
    });
    await expect(getAppSchemas(null, { appName: 'blog' })).resolves.toHaveLength(1);
    await expect(removeAppSchema(null, { appName: 'blog', originalCollectionName: 'posts' })).resolves.toEqual({
      message: 'App Schema Removed Successfully',
      deletedData: { deletedCount: 1 },
    });
  });

  it('removes database credentials by app and environment', async () => {
    const { getDbCredential, getDbCredentials, removeDbCredentials } = await import('../dbCreds');

    mockStores.dbCredentials.push({ appName: 'blog', env: 'development', dbType: 'mongo' });

    await expect(getDbCredentials(null, {})).resolves.toEqual([
      { appName: 'blog', env: 'development', dbType: 'mongo' },
    ]);
    await expect(getDbCredential(null, { appName: 'blog', env: 'development' })).resolves.toEqual({
      appName: 'blog',
      env: 'development',
      dbType: 'mongo',
    });
    await expect(removeDbCredentials(null, { appName: 'blog', env: 'development' })).resolves.toEqual({
      deletedCount: 1,
    });
  });

  it('upserts, reads, lists, and removes access schemas', async () => {
    const { createAccessSchema, getAccessSchema, getAccessSchemas, removeAccessSchema } = await import(
      '../accessSchemas'
    );

    const accessInput = {
      email: 'admin@example.com',
      appName: 'blog',
      endPointName: 'getPosts',
      isAllowed: 'true',
      allowedInChain: true,
    };

    await expect(createAccessSchema(null, accessInput, null, null)).resolves.toEqual(accessInput);
    await expect(getAccessSchema(null, accessInput, null, null)).resolves.toEqual(accessInput);
    await expect(getAccessSchemas(null, { filter: { email: 'admin@example.com' } }, null, null)).resolves.toEqual([
      accessInput,
    ]);
    await expect(removeAccessSchema(null, accessInput, null, null)).resolves.toEqual(accessInput);
    expect(mockStores.accessSchemas).toEqual([]);
  });
});
