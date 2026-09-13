import sequelizeQueryServices from '../sequelize';

describe('sequelize query services', () => {
  const makeModel = () => ({
    tableName: 'posts',
    rawAttributes: {
      id: {},
      title: {},
      status: {},
      views: {},
    },
    count: jest.fn(async () => 2),
    findAll: jest.fn(async () => [{ title: 'Hello' }]),
    findOne: jest.fn(async () => ({ id: 1, title: 'Hello', views: 2 })),
    update: jest.fn(async () => [1]),
    destroy: jest.fn(async () => 1),
    create: jest.fn(async (data) => data),
    bulkCreate: jest.fn(async (data) => data),
  });

  it('maps query filters and inclusive projections into Sequelize findAll options', async () => {
    const model = makeModel();
    const services = sequelizeQueryServices(model) as any;

    await expect(
      services.find({ status: 'published' }, { title: 1, status: 1 }, { limit: 5, offset: 10 })
    ).resolves.toEqual([{ title: 'Hello' }]);

    expect(model.findAll).toHaveBeenCalledWith({
      where: { status: 'published' },
      attributes: ['title', 'status'],
      limit: 5,
      offset: 10,
    });
  });

  it('maps exclusive projections and forwards count/find/create/delete operations', async () => {
    const model = makeModel();
    const services = sequelizeQueryServices(model) as any;

    expect(services.getTableName()).toBe('posts');
    await expect(services.countDocuments({ status: 'published' })).resolves.toBe(2);
    await expect(services.findOne({ id: 1 }, { views: 0 })).resolves.toEqual({ id: 1, title: 'Hello', views: 2 });
    await expect(services.create({ title: 'Hello' })).resolves.toEqual({ title: 'Hello' });
    await expect(services.createMany([{ title: 'Hello' }])).resolves.toEqual([{ title: 'Hello' }]);
    await expect(services.findOneAndDelete({ id: 1 })).resolves.toBe(1);

    expect(model.count).toHaveBeenCalledWith({ where: { status: 'published' } });
    expect(model.findOne).toHaveBeenCalledWith({ where: { id: 1 }, attributes: ['id', 'title', 'status'] });
    expect(model.bulkCreate).toHaveBeenCalledWith([{ title: 'Hello' }]);
    expect(model.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('updates existing rows, supports $inc updates, and returns the updated record', async () => {
    const model = makeModel();
    const services = sequelizeQueryServices(model) as any;

    await expect(services.findOneAndUpdate({ id: 1 }, { $inc: { views: 3 } })).resolves.toEqual({
      id: 1,
      title: 'Hello',
      views: 2,
    });

    expect(model.update).toHaveBeenCalledWith({ views: 5 }, { where: { id: 1 } });
    expect(model.findOne).toHaveBeenLastCalledWith({ where: { id: 1 } });
  });

  it('creates a row when findOneAndUpdate misses with upsert enabled', async () => {
    const model = makeModel();
    model.findOne.mockResolvedValueOnce(null as any);
    const services = sequelizeQueryServices(model) as any;

    await expect(services.findOneAndUpdate({ id: 2 }, { title: 'New' }, { upsert: true })).resolves.toEqual({
      id: 2,
      title: 'New',
    });

    expect(model.create).toHaveBeenCalledWith({ id: 2, title: 'New' }, { upsert: true });
  });

  it('requires filters for mutation helpers', async () => {
    const services = sequelizeQueryServices(makeModel()) as any;

    await expect(services.findOneAndUpdate(null, { title: 'Nope' })).rejects.toThrow(
      'Filter is required for findOneAndUpdate'
    );
    await expect(services.updateOne(null, { title: 'Nope' })).rejects.toThrow('Filter is required for updateOne');
    await expect(services.updateMany(null, { title: 'Nope' })).rejects.toThrow('Filter is required for updateMany');
    await expect(services.deleteOne(null)).rejects.toThrow('Filter is required for deleteOne');
    await expect(services.deleteMany(null)).rejects.toThrow('Filter is required for deleteMany');
  });
});
