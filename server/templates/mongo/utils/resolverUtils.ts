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

module.exports = { getProjections };
