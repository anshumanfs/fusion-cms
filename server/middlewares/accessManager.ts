import { dbModels } from '../db';
import Errors from '../libs/errors';

const getRequestedFields = (info: any) => {
  const fieldObj: any = {};
  info.fieldNodes[0].selectionSet.selections.forEach((field: any) => {
    fieldObj[field.name.value] = field.selectionSet ? getRequestedFields(field) : true;
  });
};
/*
Example of accessSchema:
{
  email: '',
  appName: '',
  endPointName: '',
  isAllowed: 'true' | 'false' | '{ function: (parent,args,context,info,result) => { return result; },precedence:'pre'|'post'}',
  allowedInChain: false | true,
}

if isAllowed is true then function will be exectued in preAccess and postAccess will be skipped

if isAllowed is false then access will be denied and error will be thrown

if isAllowed is a function then it will be executed in preAccess or postAccess based on precedence

if precedence is pre then the function will be executed in preAccess

if precedence is post then the function will be executed in postAccess

if precendence is pre and allowedInChain is true then the function will be executed in preAccess and postAccess will be skipped, rest of the accessSchema will be ignored in resolver chain

if precendence is post and allowedInChain is true then the function will be executed in postAccess, rest of the accessSchema will be ignored in resolver chain

if allowedInChain is false then the accessCheck will be done in preAccess and postAccess, and accessCheck will be done in resolver chain also
*/

const checkPreAccess = async (
  parent: any,
  args: any,
  context: any,
  info: any,
  appName: string,
  endPointName: string
) => {
  // if allowedInChain is true that means previous resolver has allowed the access
  if (context?.accessCheck?.allowedInChain) {
    return;
  }
  const accessSchema = await dbModels.accessSchema.findOne({
    email: context.req.body.user.email,
    appName,
    endPointName,
  });
  context.accessCheck = {};
  context.accessCheck.accessSchema = accessSchema;
  if (!accessSchema || accessSchema.isAllowed === 'false') {
    throw Errors.UNAUTHORIZED('Access denied, please contact the admin');
  }
  if (accessSchema.isAllowed === 'true') {
    context.accessCheck.allowedInChain = accessSchema.allowedInChain;
    context.accessCheck.post = false;
    return;
  }
  try {
    const jsonAccess = JSON.parse(accessSchema.isAllowed); // {function:'()=>{}',precedence:'pre'|'post'}
    if ((jsonAccess.precedence = 'pre')) {
      context.accessCheck.post = false;
      context.accessCheck.allowedInChain = accessSchema.allowedInChain;
      const preFn = eval(`${jsonAccess.function}`);
      return preFn(parent, args, context, info);
    }
    // if precedence is post then set post to true and store the function in context
    // dont set allowedInChain to true as it will be set by the postcheck function
    if ((jsonAccess.precedence = 'post')) {
      context.accessCheck.post = true;
      const postFn = eval(`${jsonAccess.function}`);
      context.accessCheck.function = postFn;
      return;
    }
  } catch (error) {
    console.log('Error in preAccess function', error);
    throw Errors.INTERNAL_SERVER_ERROR('Error in preAccess function');
  }
  context.accessCheck.post = true;
  return;
};
// post function should have result as last argument
const checkPostAccess = async (parent: any, args: any, context: any, info: any, result: any) => {
  if (context.accessCheck.post) {
    // if allowedInChain is true that means previous resolver has allowed the access
    if (context?.accessCheck?.allowedInChain) {
      return result;
    }
    if (!context.accessCheck.function) {
      throw Errors.INTERNAL_SERVER_ERROR('Post function not found');
    }
    // it will be set here so that it can be used in the next resolver not in the current resolver
    context.accessCheck.allowedInChain = context.accessCheck.accessSchema.allowedInChain;
    return context.accessCheck.function(parent, args, context, info, result);
  }
  return result;
};

export { checkPreAccess, checkPostAccess };
