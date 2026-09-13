import { oneWayEncoder, twoWayEncoder } from '../../../libs/encoderDecoder';

const mockSendMail = jest.fn();
const mockUsersStore: any[] = [];
const mockMetadataStore: any[] = [];
const mockAuthCodesStore: any[] = [];

const matchesQuery = (record: any, query: Record<string, any>) =>
  Object.entries(query).every(([key, value]) => {
    if (value && typeof value === 'object' && '$in' in value) {
      return value.$in.includes(record[key]);
    }

    return record[key] === value;
  });

const mockDbModels = {
  users: {
    findOne: jest.fn(async (query: Record<string, any>) => mockUsersStore.find((user) => matchesQuery(user, query))),
    find: jest.fn(async (query: Record<string, any> = {}) => mockUsersStore.filter((user) => matchesQuery(user, query))),
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
    findOne: jest.fn(async (query: Record<string, any>) => mockAuthCodesStore.find((code) => matchesQuery(code, query))),
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

jest.mock('../../../db', () => ({
  dbModels: mockDbModels,
}));

jest.mock('../../../libs/mailer', () => ({
  __esModule: true,
  default: (...args: any[]) => mockSendMail(...args),
}));

describe('user authentication flow', () => {
  beforeEach(() => {
    mockSendMail.mockClear();
    mockUsersStore.splice(0);
    mockMetadataStore.splice(0);
    mockAuthCodesStore.splice(0);
    Object.values(mockDbModels.users).forEach((mockFn: any) => mockFn.mockClear?.());
    Object.values(mockDbModels.metadata).forEach((mockFn: any) => mockFn.mockClear?.());
    Object.values(mockDbModels.authCodes).forEach((mockFn: any) => mockFn.mockClear?.());
  });

  it('registers the first user as a verified admin and stores metadata', async () => {
    const { registerUser } = await import('../users');

    const result = await registerUser(null, {
      email: 'admin@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      password: 'passw0rd',
      metadata: {
        team: 'platform',
      },
    });

    expect(result.role).toBe('admin');
    expect(result.isVerified).toBe(true);
    expect(result.password).toBe(oneWayEncoder('passw0rd'));
    expect(result.metadata).toEqual({ team: 'platform' });
    expect(mockMetadataStore).toEqual([
      {
        tableName: 'cms_users',
        referenceId: '1',
        key: 'team',
        value: 'platform',
      },
    ]);
    expect(mockSendMail).toHaveBeenCalledWith(
      'admin@example.com',
      expect.stringContaining('Activate'),
      '',
      expect.stringContaining('Ada')
    );
  });

  it('logs in a verified user and refreshes tokens', async () => {
    const { login, requestNewToken } = await import('../users');

    mockUsersStore.push({
      _id: '1',
      email: 'admin@example.com',
      password: oneWayEncoder('passw0rd'),
      isVerified: true,
      isBlocked: false,
      role: 'admin',
    });

    const tokenResult = await login(null, {
      email: 'admin@example.com',
      password: 'passw0rd',
      rememberMe: false,
    });
    const refreshedTokenResult = await requestNewToken(null, {
      refreshToken: tokenResult.refreshToken,
    });

    expect(tokenResult.token).toBeTruthy();
    expect(tokenResult.refreshToken).toBeTruthy();
    expect(refreshedTokenResult.token).toBeTruthy();
    expect(refreshedTokenResult.refreshToken).toBeTruthy();
  });

  it('allows public auth mutations but blocks protected app manager operations without credentials', async () => {
    const { authMiddleware } = await import('../../../middlewares/auth');

    await expect(
      authMiddleware({
        baseUrl: '/appManager',
        headers: {},
        body: {
          query: 'mutation { registerUser(email: "admin@example.com", firstName: "Ada", lastName: "Lovelace", password: "passw0rd") { _id } }',
        },
      } as any)
    ).resolves.toEqual({
      req: expect.any(Object),
    });

    await expect(
      authMiddleware({
        baseUrl: '/appManager',
        headers: {},
        body: {
          query: '{ getUsers { _id } }',
        },
      } as any)
    ).rejects.toThrow('API key or token not found');
  });

  it('authenticates protected app manager operations with a bearer token', async () => {
    const { login } = await import('../users');
    const { authMiddleware } = await import('../../../middlewares/auth');

    mockUsersStore.push({
      _id: '1',
      email: 'admin@example.com',
      password: oneWayEncoder('passw0rd'),
      isVerified: true,
      isBlocked: false,
      role: 'admin',
    });

    const { token } = await login(null, {
      email: 'admin@example.com',
      password: 'passw0rd',
      rememberMe: false,
    });
    const req: any = {
      baseUrl: '/appManager',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        query: '{ getUsers { _id } }',
      },
    };

    await expect(authMiddleware(req)).resolves.toEqual({ req });
    expect(req.body.user).toMatchObject({
      _id: '1',
      email: 'admin@example.com',
      role: 'admin',
    });
  });

  it('sends password reset email and applies a valid password reset token', async () => {
    const { forgotPassword, requestPasswordChangeEmail } = await import('../users');

    mockUsersStore.push({
      _id: '1',
      email: 'admin@example.com',
      password: oneWayEncoder('old-password'),
      isVerified: true,
      isBlocked: false,
      role: 'admin',
    });

    await expect(
      requestPasswordChangeEmail(null, {
        email: 'admin@example.com',
      })
    ).resolves.toEqual({ message: 'Email sent successfully' });
    expect(mockSendMail).toHaveBeenCalledWith(
      'admin@example.com',
      expect.stringContaining('Reset Password'),
      '',
      expect.stringContaining('/auth/validate?entity=reset&token=')
    );

    const uniqueCode = encodeURIComponent(
      twoWayEncoder(
        JSON.stringify({
          email: 'admin@example.com',
          date: new Date().toISOString(),
        })
      )
    );

    await expect(
      forgotPassword(null, {
        uniqueCode,
        password: 'new-password',
      })
    ).resolves.toEqual({ message: 'Password updated successfully' });
    expect(mockUsersStore[0].password).toBe(oneWayEncoder('new-password'));
  });
});
