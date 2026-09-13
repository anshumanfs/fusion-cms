const addHook = jest.fn();

jest.mock('sequelize', () => ({
  Sequelize: jest.fn(() => ({ addHook })),
}));

jest.mock('../../libs/logger', () => ({
  __esModule: true,
  default: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

describe('MySQL connector', () => {
  const originalEnv = process.env.ENABLE_SEQEULIZE_LOGGING;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENABLE_SEQEULIZE_LOGGING = 'true';
  });

  afterAll(() => {
    process.env.ENABLE_SEQEULIZE_LOGGING = originalEnv;
  });

  it('creates a Sequelize MySQL connection with dialect and credentials', async () => {
    const { Sequelize } = await import('sequelize');
    const { connector } = await import('../mysql');

    const conn = connector('blog', {
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'secret',
      database: 'blog',
    });

    expect(conn).toEqual({ addHook });
    expect(Sequelize).toHaveBeenCalledWith('blog', 'root', 'secret', {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
      logging: true,
    });
    expect(addHook).toHaveBeenCalledWith('afterConnect', expect.any(Function));
  });

  it('surfaces constructor failures with connector context', async () => {
    const { Sequelize } = await import('sequelize');
    const { connector } = await import('../mysql');

    (Sequelize as unknown as jest.Mock).mockImplementationOnce(() => {
      throw new Error('bad mysql config');
    });

    expect(() =>
      connector('blog', {
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'secret',
        database: 'blog',
      })
    ).toThrow('blog MySQL connection error: Error: bad mysql config');
  });
});

export {};
