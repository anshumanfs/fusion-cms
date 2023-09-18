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

const getEagerLoadingOptions = (info: any) => {
  function populateOptionsHelper(fieldsArr: any) {
    const populateOptions: any = [];
    fieldsArr.forEach((e: any) => {
      if (e.selectionSet) {
        let populateObj: any = {};
        populateObj.path = e.name.value;
        populateObj.populate = populateOptionsHelper(e.selectionSet.selections);
        populateOptions.push(populateObj);
      }
    });
    return populateOptions;
  }
  const result = populateOptionsHelper(info.fieldNodes[0].selectionSet.selections);
  return result;
};

module.exports = { mapGqlFieldToSql };
