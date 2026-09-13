import mongooseQueryServices from '../mongoose';

describe('mongoose query services', () => {
  const makeModel = () => ({
    collection: {
      collectionName: 'posts',
    },
    countDocuments: jest.fn(async () => 2),
    find: jest.fn(async () => [{ title: 'Hello' }]),
    findOne: jest.fn(async () => ({ title: 'Hello' })),
    findOneAndUpdate: jest.fn(async () => ({ title: 'Updated' })),
    findOneAndDelete: jest.fn(async () => ({ title: 'Deleted' })),
    create: jest.fn(async (data) => data),
    insertMany: jest.fn(async (data) => data),
    updateOne: jest.fn(async () => ({ modifiedCount: 1 })),
    updateMany: jest.fn(async () => ({ modifiedCount: 2 })),
    deleteOne: jest.fn(async () => ({ deletedCount: 1 })),
    deleteMany: jest.fn(async () => ({ deletedCount: 2 })),
  });

  it('forwards read and write calls to the Mongoose model', async () => {
    const model = makeModel();
    const services = mongooseQueryServices(model) as any;

    expect(services.getTableName()).toBe('posts');
    await expect(services.countDocuments({ status: 'published' })).resolves.toBe(2);
    await expect(services.find({ status: 'published' }, { title: 1 }, { limit: 10 })).resolves.toEqual([
      { title: 'Hello' },
    ]);
    await expect(services.findOne({ slug: 'hello' })).resolves.toEqual({ title: 'Hello' });
    await expect(services.create({ title: 'Hello' })).resolves.toEqual({ title: 'Hello' });
    await expect(services.createMany([{ title: 'Hello' }])).resolves.toEqual([{ title: 'Hello' }]);
    await expect(services.findOneAndUpdate({ slug: 'hello' }, { title: 'Updated' })).resolves.toEqual({
      title: 'Updated',
    });
    await expect(services.findOneAndDelete({ slug: 'hello' })).resolves.toEqual({ title: 'Deleted' });

    expect(model.find).toHaveBeenCalledWith({ status: 'published' }, { title: 1 }, { limit: 10 });
    expect(model.insertMany).toHaveBeenCalledWith([{ title: 'Hello' }]);
  });

  it('requires filters for bulk mutations that can affect many records', async () => {
    const services = mongooseQueryServices(makeModel()) as any;

    await expect(services.updateOne(null, { title: 'Nope' })).rejects.toThrow('Filter is required for updateOne');
    await expect(services.updateMany(null, { title: 'Nope' })).rejects.toThrow('Filter is required for updateMany');
    await expect(services.deleteOne(null)).rejects.toThrow('Filter is required for deleteOne');
    await expect(services.deleteMany(null)).rejects.toThrow('Filter is required for deleteMany');
  });
});
