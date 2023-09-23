/**
 * Maps a GraphQL field to the corresponding SQL string and attributes.
 *
 * @param {any} info - The info object containing the field nodes.
 * @return {Object} - An object with the SQL string and attributes.
 */
const mapGqlFieldToSql = (info: any) => {
  const fields = info.fieldNodes[0].selectionSet.selections.map((field: any) => field.name.value);
  return {
    sqlString: fields.join(','),
    attributes: fields,
  };
};

/**
 * Generates the eager loading options for a given GraphQL query.
 *
 * @param {any} info - the GraphQL query information
 * @param {string} pluralCollectionName - the plural name of the collection
 * @return {any} the eager loading options for the query
 */
const getEagerLoadingOptions = (info: any, pluralCollectionName: string) => {
  const appJSON = require('../app.json');
  const { collections } = appJSON;
  function populateOptionsHelper(fieldsArr: any) {
    const includeOptions: any = [];
    fieldsArr.forEach((e: any) => {
      if (e.selectionSet) {
        const { schema } = collections.find(
          (collection: any) => collection.pluralCollectionName === pluralCollectionName
        );
        let includeObj: any = {};
        // finding object that is being referenced
        const referenceObj = collections.find(
          (collection: any) => schema[e.name.value].ref.to === collection.originalCollectionName
        );
        // add require statement for dbModels
        includeObj.model = require(`../dbModels/${referenceObj.pluralCollectionName}.js`);
        includeObj.include = populateOptionsHelper(e.selectionSet.selections);
        includeOptions.push(includeObj);
      }
    });
    return includeOptions;
  }
  const result = populateOptionsHelper(info.fieldNodes[0].selectionSet.selections);
  return result;
};

module.exports = { mapGqlFieldToSql, getEagerLoadingOptions };
