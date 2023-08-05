import { Request, Response } from 'express';
import { dbModels } from '../db';

const changeRunningStatus = async (req: Request, res: Response) => {
  const { status, appName } = req.params;
  const appStatus = await dbModels.apps.findOne({ appName });
  if (appStatus === null) {
    res.send({ message: 'App Not Found' });
  } else {
    if (!appStatus.isAppCompleted) {
      res.send({ message: 'Incomplete application found' });
    } else {
      const running = status === 'true' ? true : false;
      await dbModels.apps.findOneAndUpdate({ appName }, { running });
      res.send({ message: 'Restarting the app.. Please wait ...' });
      console.log('Restarting Application Please wait....');
    }
  }
};

const buildAppsFromDB = async () => {
  const APP_ENV = ('NODE_ENV' in process.env ? process.env.NODE_ENV.trim() : 'development').toLowerCase();
  const QUERY_ENV = APP_ENV === 'development' ? 'development' : APP_ENV;
  console.log('✔ Started Generating Apps From Data');
  const templates = {
    mongo: require('../templates/mongo'),
    mysql: require('../templates/mysql'),
  };
  const promiseArr: any[] = [];
  const data = await dbModels.apps.find({});
  const appsRelatedToCurrentEnv = (await dbModels.dbCredentials.find({ env: QUERY_ENV })).map((e: any) => e.appName);
  const allApps = await dbModels.apps.find({ appName: { $in: appsRelatedToCurrentEnv } });
  const buildApp = async ({ appName, dbType }: { appName: string; dbType: string }) => {
    const appSchemas = await dbModels.dbSchemas.find({ appName });
    return await Promise.allSettled(
      appSchemas.map((e: any) => templates[dbType as keyof typeof templates].createDbModels(e))
    );
  };
  allApps.forEach((e: any) => {
    const { appName, dbType, isAppCompleted } = e;
    if (isAppCompleted) {
      promiseArr.push(buildApp({ appName, dbType }));
    }
  });
  await Promise.allSettled(promiseArr);
  console.log('✔ Apps Built Successfully');
  return;
};

const buildApps = async (req: Request, res: Response) => {
  await buildAppsFromDB();
  res.send({
    message: 'All applications models , routes , resolvers, schemas updated',
  });
};

export { changeRunningStatus, buildApps, buildAppsFromDB };
