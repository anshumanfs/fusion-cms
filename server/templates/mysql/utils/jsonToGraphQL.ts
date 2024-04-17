import lodash from 'lodash';
import tempJson from '../../../../data/.temp.json';

const replaceAllParenthesis = (text: string, replacement: string) => {
  const pattern = /\([\w\W]*?\)/g;
  return text.replace(pattern, replacement);
};

/**
 * Converts a JSON object to a GraphQL query type.
 *
 * @param {any} json - The JSON object to convert.
 * @param {string} name - The name of the query type.
 * @return {string} The GraphQL query type.
 */
const jsonToQueryType = (json: any, name: string, appJson: any) => {
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
    if (object[field].isArray) {
      object[field].type = `[${object[field].type}]`;
    }
    if (object[field].hasOwnProperty('ref') && lodash.isPlainObject(object[field].ref)) {
      let refGraphQLType = appJson.collections.find(
        (e: any) => e.originalCollectionName === object[field].ref.to
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
    type ${name} {
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

export { jsonToQueryType, jsonToCreateType, jsonToUpdateType };
