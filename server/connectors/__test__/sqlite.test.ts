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

describe('SQLite connector', () => {
  const originalEnv = process.env.ENABLE_SEQUELIZE_LOGGING;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENABLE_SEQUELIZE_LOGGING = 'true';
  });

  afterAll(() => {
    process.env.ENABLE_SEQUELIZE_LOGGING = originalEnv;
  });

  it('creates a Sequelize SQLite connection with storage and logging options', async () => {
    const { Sequelize } = await import('sequelize');
    const { connector } = await import('../sqlite');

    const conn = connector('metadata', { storage: '.temp/metadata.sqlite' });

    expect(conn).toEqual({ addHook });
    expect(Sequelize).toHaveBeenCalledWith({
      dialect: 'sqlite',
      storage: '.temp/metadata.sqlite',
      logging: true,
    });
    expect(addHook).toHaveBeenCalledWith('afterConnect', expect.any(Function));
  });

  it('surfaces constructor failures with connector context', async () => {
    const { Sequelize } = await import('sequelize');
    const { connector } = await import('../sqlite');

    (Sequelize as unknown as jest.Mock).mockImplementationOnce(() => {
      throw new Error('bad storage');
    });

    expect(() => connector('metadata', { storage: '/nope.sqlite' })).toThrow(
      'metadata SQLite connection error: Error: bad storage'
    );
  });
});

export {};
