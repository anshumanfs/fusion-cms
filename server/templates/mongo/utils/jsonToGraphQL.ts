import lodash from 'lodash';
import tempJsonData from '../../../../data/.temp.json';

const tempJson: TempJson = tempJsonData;

const replaceAllParenthesis = (text: string, replacement: string) => {
  const pattern = /\([\w\W]*?\)/g;
  return text.replace(pattern, replacement);
};

// KEY: Mongo type, VALUE: GraphQL type
const mongoToGraphQLMapper: any = {
  Boolean: 'Boolean',
  Buffer: 'Buffer',
  Date: 'Date',
  DateTime: 'DateTime',
  DbRef: 'DbRef',
  Decimal128: 'Decimal128',
  Email: 'EmailAddress',
  Map: 'Map',
  Mixed: 'Mixed',
  NegativeNumber: 'NegativeInt',
  Number: 'Number',
  ObjectId: 'ObjectID',
  PositiveNumber: 'PositiveInt',
  String: 'String',
  Time: 'Time',
  UUID: 'UUID',
};

/**
 * Converts a JSON object to a GraphQL query type.
 *
 * @param {any} json - The JSON object to convert.
 * @param {string} name - The name of the query type.
 * @return {string} The GraphQL query type.
 */
const jsonToQueryType = (json: any, singularCollectionName: string, appJson: any) => {
  let object: any;
  let federationTypes = ``;
  if (typeof json === 'string') {
    object = JSON.parse(json);
  } else {
    object = lodash.cloneDeep(json);
  }
  let subQueryString = ``;
  const queryFields = Object.keys(object).map((field) => {
    if (lodash.isPlainObject(object[field].type)) {
      subQueryString += jsonToQueryType(object[field].type, field, appJson.appName);
      object[field].type = `${field}`;
    }
    object[field].type = mongoToGraphQLMapper[object[field].type];
    if (object[field].isArray) {
      object[field].type = `[${object[field].type}]`;
    }

    // handles references to other collections within the same app
    if (object[field].hasOwnProperty('ref') && lodash.isString(object[field].ref)) {
      let refGraphQLType = appJson.collections.find(
        (e: any) => e.originalCollectionName === object[field].ref
      ).singularCollectionName;
      if (object[field].isArray) {
        object[field].type = `[${refGraphQLType}]`;
      } else {
        object[field].type = `${refGraphQLType}`;
      }
    }
    // handles references to other collections or in other apps // federation
    if (object[field].hasOwnProperty('federate') && lodash.isPlainObject(object[field].federate)) {
      let appName = object[field].federate.appName;
      let refCollectionName = object[field].federate.collection;
      let allCollections = lodash.filter(tempJson.dbSchemas, {
        appName,
      });
      let refCollectionSchema = lodash.filter(allCollections, {
        originalCollectionName: refCollectionName,
      });
      federationTypes += jsonToQueryType(refCollectionSchema[0].schema, refCollectionSchema[0].originalCollectionName, {
        appName,
      });
      if (object[field].isArray) {
        object[field].type = `[${refCollectionName}]`;
      } else {
        object[field].type = `${refCollectionName}`;
      }
    }

    object[field].type = replaceAllParenthesis(object[field].type, '');
    return `${field}: ${object[field].type}`;
  });
  const queryType: string = `
    ${subQueryString}
    type ${singularCollectionName} {
        ${queryFields.join('\n  ')}
    }
    ${federationTypes}
  `;
  return queryType;
};

/**
 * Generates the mutation type for a given JSON object and name.
 *
 * @param {any} json - The JSON object to generate the mutation type from.
 * @param {string} name - The name of the mutation type.
 * @return {string} The generated mutation type.
 */
const jsonToCreateType = (json: any, name: string) => {
  let object: any;
  if (typeof json === 'string') {
    object = JSON.parse(json);
  } else {
    object = lodash.cloneDeep(json);
  }
  let subMutationString = ``;
  const mutationFields = Object.keys(object).map((field) => {
    if (lodash.isPlainObject(object[field].type)) {
      subMutationString += jsonToCreateType(object[field].type, field);
      object[field].type = `${field}Input`;
    }
    object[field].type = mongoToGraphQLMapper[object[field].type];
    if (object[field].isArray) {
      object[field].type = `[${object[field].type}]`;
    }
    if (object[field].required) {
      object[field].type = `${object[field].type}!`;
    }

    object[field].type = replaceAllParenthesis(object[field].type, '');
    return `${field}: ${object[field].type}`;
  });
  const mutationType: string = `
        ${subMutationString}
        input ${name}Create {
            ${mutationFields.join('\n  ')}
        }
    `;
  return mutationType;
};

const jsonToUpdateType = (json: any, name: string) => {
  let object: any;
  if (typeof json === 'string') {
    object = JSON.parse(json);
  } else {
    object = lodash.cloneDeep(json);
  }
  let subMutationString = ``;
  const mutationFields = Object.keys(object).map((field) => {
    if (lodash.isPlainObject(object[field].type)) {
      subMutationString += jsonToUpdateType(object[field].type, field);
      object[field].type = `${field}Input`;
    }
    object[field].type = mongoToGraphQLMapper[object[field].type];
    if (object[field].isArray) {
      object[field].type = `[${object[field].type}]`;
    }
    object[field].type = replaceAllParenthesis(object[field].type, '');
    return `${field}: ${object[field].type}`;
  });
  const mutationType: string = `
        ${subMutationString}
        input ${name}Update {
            ${mutationFields.join('\n  ')}
        }
    `;
  return mutationType;
};

const optionsTypes = `
    input findOptions {
        limit: Int
        skip: Int
        hint: JSON
        comment: String
        lean: Boolean
        useBigInt64: Boolean
        maxTimeMs: Int
        sort: JSON
    }
    
    input findOneOptions {
      lean: Boolean
    }

    input updateOptions {
        lean: Boolean
        populate: JSON
        upsert: Boolean
        timestamps: Boolean
        sort: JSON
        useBigInt64: Boolean
    }

    input deleteOptions {
        lean: Boolean
        populate: JSON
        sort: JSON
        useBigInt64: Boolean
    }
`;

export { jsonToQueryType, jsonToCreateType, jsonToUpdateType, optionsTypes };
