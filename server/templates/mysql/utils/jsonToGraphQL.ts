import lodash from 'lodash';

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
const jsonToQueryType = (json: any, name: string) => {
  let object: any;
  if (typeof json === 'string') {
    object = JSON.parse(json);
  } else {
    object = lodash.cloneDeep(json);
  }
  let subQueryString = ``;
  const queryFields = Object.keys(object).map((field) => {
    if (lodash.isPlainObject(object[field].type)) {
      subQueryString += jsonToQueryType(object[field].type, field);
      object[field].type = `${field}`;
    }
    if (object[field].isArray) {
      object[field].type = `[${object[field].type}]`;
    }
    object[field].type = replaceAllParenthesis(object[field].type, '');
    return `${field}: ${object[field].type}`;
  });
  const queryType: string = `
    ${subQueryString}
    type ${name} {
        ${queryFields.join('\n  ')}
    }
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
const jsonToMutationType = (json: any, name: string) => {
  let object: any;
  if (typeof json === 'string') {
    object = JSON.parse(json);
  } else {
    object = lodash.cloneDeep(json);
  }
  let subMutationString = ``;
  const mutationFields = Object.keys(object).map((field) => {
    if (lodash.isPlainObject(object[field].type)) {
      subMutationString += jsonToMutationType(object[field].type, field);
      object[field].type = `${field}Input`;
    }
    if (object[field].isArray) {
      object[field].type = `[${object[field].type}]`;
    }
    if (object[field].isRequired) {
      object[field].type = `${object[field].type}!`;
    }
    object[field].type = replaceAllParenthesis(object[field].type, '');
    return `${field}: ${object[field].type}`;
  });
  const mutationType: string = `
        ${subMutationString}
        input ${name}Input {
            ${mutationFields.join('\n  ')}
        }
    `;
  return mutationType;
};

export { jsonToQueryType, jsonToMutationType };
