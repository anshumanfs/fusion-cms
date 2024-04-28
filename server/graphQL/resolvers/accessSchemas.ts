import { dbModels } from '../../db';

const createAccessSchema = async (_: any, args: any, __: any, ___: any) => {
  let { email, appName, endPointName, isAllowed, allowedInChain } = args;
  const accessSchema = await dbModels.accessSchema.findOneAndUpdate(
    {
      email,
      appName,
      endPointName,
    },
    { isAllowed, allowedInChain },
    { upsert: true }
  );
  return accessSchema;
};

const removeAccessSchema = async (_: any, args: any, __: any, ___: any) => {
  const { email, appName, endPointName } = args;
  const accessSchema = await dbModels.accessSchema.findOneAndDelete({ email, appName, endPointName });
  return accessSchema;
};

const getAccessSchema = async (_: any, args: any, __: any, ___: any) => {
  const { email, appName, endPointName } = args;
  const accessSchema = await dbModels.accessSchema.findOne({ email, appName, endPointName });
  return accessSchema;
};

const getAccessSchemas = async (_: any, args: any, __: any, ___: any) => {
  const { filter } = args;
  const accessSchema = await dbModels.accessSchema.find(filter);
  return accessSchema;
};

export { createAccessSchema, removeAccessSchema, getAccessSchema, getAccessSchemas };
