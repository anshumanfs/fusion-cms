declare global {
  interface TempJson {
    dbSchemas: Array<{
      appName: string;
      originalCollectionName: string;
      singularCollectionName: string;
      pluralCollectionName: string;
      schema: any;
    }>;
    apps: Array<{
      _id: string;
      appName: string;
      port: number;
      running: boolean;
      isAppCompleted: boolean;
      dbType: string;
    }>;
    dbCredentials: Array<{
      _id: string;
      appName: string;
      env: string;
      credentials: string;
    }>;
  }
}

export {};
