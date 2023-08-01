/**
 * Generates a mongo projection object based on the graphql input fields.
 *
 * @param {object} info - The information object.
 * @return {object} The projection object.
 */
const getProjections = (info) => {
    const projection = {}
    info.fieldNodes[0].selectionSet.selections
        .map((field) => field.name.value)
        .forEach((e) => {
            projection[e] = 1
        })
    return projection
}

module.exports = { getProjections }