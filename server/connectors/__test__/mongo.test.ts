const on = jest.fn();

jest.mock('mongoose', () => ({
  __esModule: true,
  default: {
    createConnection: jest.fn(() => ({ on })),
  },
}));

jest.mock('../../libs/logger', () => ({
  __esModule: true,
  default: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Mongo connector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a Mongoose connection with URI and options', async () => {
    const mongoose = (await import('mongoose')).default;
    const { connector } = await import('../mongo');

    const options = {
      dbName: 'blog',
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 1000,
    };
    const conn = connector('blog', {
      uri: 'mongodb://127.0.0.1:27017/blog',
      options,
    });

    expect(conn).toEqual({ on });
    expect(mongoose.createConnection).toHaveBeenCalledWith('mongodb://127.0.0.1:27017/blog', options);
    expect(on).toHaveBeenCalledWith('connected', expect.any(Function));
    expect(on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('surfaces synchronous connection creation failures with connector context', async () => {
    const mongoose = (await import('mongoose')).default;
    const { connector } = await import('../mongo');

    (mongoose.createConnection as jest.Mock).mockImplementationOnce(() => {
      throw new Error('bad mongo uri');
    });

    expect(() => connector('blog', { uri: 'mongodb://bad-host' })).toThrow(
      'blog MongoDB connection error: Error: bad mongo uri'
    );
  });
});
