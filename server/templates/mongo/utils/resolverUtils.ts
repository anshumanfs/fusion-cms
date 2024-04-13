/**
 * Generates a mongo projection object based on the graphql input fields.
 *
 * @param {object} info - The information object.
 * @return {object} The projection object.
 */
const getProjections = (info: any) => {
  const projection: any = {};
  info.fieldNodes[0].selectionSet.selections
    .map((field: any) => field.name.value)
    .forEach((e: any) => {
      projection[e] = 1;
    });
  return projection;
};

const getPopulateOptions = (info: any) => {
  function populateOptionsHelper(fieldsArr: any) {
    const populateOptions: any = [];
    fieldsArr.forEach((e: any) => {
      if (e.selectionSet) {
        // essential to allow fallback to resolver chain
        let populateObj: any = {
          strictPopulate: false,
        };
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

module.exports = { getProjections, getPopulateOptions };
