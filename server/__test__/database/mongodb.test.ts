import { execFileSync } from 'child_process';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import mongoose, { Connection } from 'mongoose';

const hasDocker = () => {
  try {
    execFileSync('docker', ['info'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const describeIfDocker = hasDocker() ? describe : describe.skip;

describeIfDocker('MongoDB integration smoke', () => {
  let container: StartedMongoDBContainer;
  let connection: Connection;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:7').start();
    connection = await mongoose.createConnection(container.getConnectionString()).asPromise();
  }, 120000);

  afterAll(async () => {
    await connection?.close();
    await container?.stop();
  }, 30000);

  it('connects and performs CRUD against a real MongoDB container', async () => {
    const App = connection.model(
      'integration_apps',
      new mongoose.Schema(
        {
          appName: { type: String, required: true, unique: true },
          dbType: { type: String, required: true },
          running: { type: Boolean, default: false },
        },
        { collection: 'integration_apps' }
      )
    );

    const created = await App.create({ appName: 'Mongo Smoke App', dbType: 'mongo' });
    expect(created.appName).toBe('Mongo Smoke App');

    const found = await App.findOne({ appName: 'Mongo Smoke App' });
    expect(found?.dbType).toBe('mongo');

    const updated = await App.findOneAndUpdate({ appName: 'Mongo Smoke App' }, { running: true }, { new: true });
    expect(updated?.running).toBe(true);

    await App.deleteOne({ appName: 'Mongo Smoke App' });
    await expect(App.countDocuments({ appName: 'Mongo Smoke App' })).resolves.toBe(0);
  });
});
