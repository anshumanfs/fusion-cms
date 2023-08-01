/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/** 
 * +++++++++++++++++++++++++Mongo/Mongoose Populate Refs Extended+++++++++++++++++++++++++++++ 
 *                                                                                           + 
 * Objective :- To resolve Mongo DbRef queries at faster runtime                             + 
 *              To support the ODM migration to mongoose(from native mongo)                  + 
 *                                                                                           + 
 * How it works                                                                              + 
 * 1. It works on principle of memorization to avoid duplicate query                         + 
 * 2. It uses method of aggregation of queries to resolve things quicky                      + 
 * 3. Aggregate the queries related to a common collection                                   + 
 * 4. Run all the aggregations parallely                                                     + 
 * 5. Benchmark - This method works 2-4 times faster than existing method                    + 
 * 6. It has cross capability over the drivers , ODM's and ORM's available                   + 
 *                                                                                           + 
 * This Package is developed by Anshuman Nayak                                    + 
 * Don't Edit unless you have sufficent clarity                                              + 
 *                                                                                           + 
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
 */

const conn = require('../db')
const { ObjectId } = require('mongoose').mongo
const db = () => conn.getClient().db()

// associated with resolve-nested-promise (copied from https://www.npmjs.com/package/resolve-nested-promises) 

// Don't edit unless you have clarity 
const isLikelyAPromise = (obj) => typeof obj.then === 'function' && Object.getPrototypeOf(obj).constructor !== Object

// this is added to handle BigInt Parsing to Populate 
const customJSONSerializeAndParse = (data) => {
    if ([null, undefined].includes(data)) {
        return data
    }
    // Serialize 
    const json = JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? `BIGINT::${value}` : value))
    // Deserialize 
    const deserializedObject = JSON.parse(json, (key, value) => {
        if (typeof value === 'string' && value.startsWith('BIGINT::')) {
            return BigInt(value.substr(8))
        }
        return value
    })
    return deserializedObject
}

/**
 * Resolves nested promises in the payload.
 *
 * @param {any} payload - The payload to resolve.
 * @return {Promise<any>} - A promise that resolves the nested promises in the payload.
 */
const resolveNestedPromises = (payload) => {
    if (typeof payload !== 'object' || payload === null || payload instanceof Promise || isLikelyAPromise(payload)) {
        return Promise.resolve(payload)
    }

    if (Array.isArray(payload)) return Promise.all(payload.map(resolveNestedPromises))

    const promisesAccumulator = []
    const keysAccumulator = []

    Object.entries(payload).forEach(([key, value]) => {
        const promise = resolveNestedPromises(value)
        promisesAccumulator.push(promise)
        keysAccumulator.push(key)
    })

    return Promise.all(promisesAccumulator).then((results) => {
        return results.reduce((r, result, i) => ({ ...r, [keysAccumulator[i]]: result }), {})
    })
}
/**
 * Checks if a given key exists in an object or array recursively.
 *
 * @param {object|array} obj - The object or array to search in.
 * @param {string} key - The key to search for.
 * @return {boolean} Returns `true` if the key exists, `false` otherwise.
 */
const keyExists = (obj, key) => {
    if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
        return false
    }
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return true
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i += 1) {
            const result = keyExists(obj[i], key)
            if (result) {
                return result
            }
        }
    } else {
        Object.keys(obj).forEach((k) => {
            const result = keyExists(obj[k], key)
            if (result) {
                return result
            }
        })
    }
    return false
}

// Returns ordered results from db 
async function getOrderedResult(collection, keys, option) {
    const resultFromDb = await db()
        .collection(collection)
        .find({ _id: { $in: keys } }, option)
        .toArray()
    const obj = {}
    const orderedKeys = []
    resultFromDb.forEach((x) => {
        if (![null, undefined].includes(x)) {
            obj[x._id] = x
            orderedKeys.push(x._id.toString())
        }
    })
    const orderedResultFromDb = keys.map((key) => {
        if (orderedKeys.includes(key.toString())) {
            return obj[key]
        }
        const handleIfIdisInvalid = {}
        handleIfIdisInvalid._id = key
        Object.keys(obj[orderedKeys[0]]).forEach((k) => {
            if (k !== '_id') {
                handleIfIdisInvalid[k] = null
            }
        })
        return handleIfIdisInvalid
    })
    return orderedResultFromDb
}

// Populate functionality starts Here 
async function populate(object, fields_ = []) {
    const idArrays = {}
    const resultObj = {}
    // populate form db 
    const populateDb = async (option) => {
        for (const [collection, ids] of Object.entries(idArrays)) {
            const oidsArray = [...ids].map((id) => new ObjectId(id))
            resultObj[collection] = await getOrderedResult(collection, oidsArray, option)
        }
        await resolveNestedPromises(resultObj)
        const stringResultOb = customJSONSerializeAndParse(resultObj)
        if (keyExists(stringResultOb, '$ref')) {
            for (const [key, value] of Object.entries(stringResultOb)) {
                resultObj[key] = await populate(value, fields_)
            }
            await resolveNestedPromises(resultObj)
        }
        return resultObj
    }
    // for object 
    async function createIdArrayObject(o) {
        for (const [_key, value] of Object.entries(o)) {
            if (
                Object.prototype.toString.call(value) === '[object Object]' &&
                Object.prototype.hasOwnProperty.call(value, '$ref')
            ) {
                if (Object.prototype.hasOwnProperty.call(idArrays, value.$ref)) {
                    if (!idArrays[value.$ref].includes(value.$id)) {
                        idArrays[value.$ref].push(value.$id)
                    }
                } else {
                    idArrays[value.$ref] = [value.$id]
                }
            }
            if (
                Object.prototype.toString.call(value) === '[object Array]' &&
                value.length > 0 &&
                Object.prototype.hasOwnProperty.call(value[0], '$ref')
            ) {
                for (let i = 0; i < value.length; i += 1) {
                    if (Object.prototype.hasOwnProperty.call(idArrays, value[i].$ref)) {
                        if (!idArrays[value[i].$ref].includes(value[i].$id)) {
                            idArrays[value[i].$ref].push(value[i].$id)
                        }
                    } else {
                        idArrays[value[i].$ref] = [value[i].$id]
                    }
                }
            }
        }
    }
    // for array of objects 
    async function createIdArrayArray(o, fields) {
        const arr = []
        o.forEach((e) => {
            arr.push(createIdArrayObject(e, fields))
        })
    }
    // populate results 
    function populateResultObj(o) {
        for (const [key, value] of Object.entries(o)) {
            if (
                Object.prototype.toString.call(value) === '[object Object]' &&
                Object.prototype.hasOwnProperty.call(value, '$ref')
            ) {
                o[key] = resultObj[value.$ref][idArrays[value.$ref].indexOf(value.$id)]
            }
            if (
                Object.prototype.toString.call(value) === '[object Array]' &&
                value.length > 0 &&
                Object.prototype.hasOwnProperty.call(value[0], '$ref')
            ) {
                const promiseArray = []
                for (let i = 0; i < value.length; i += 1) {
                    promiseArray.push(resultObj[value[i].$ref][idArrays[value[i].$ref].indexOf(value[i].$id)])
                }
                o[key] = promiseArray
            }
        }
        return o
    }

    function populateResultArray(o) {
        const arr = []
        o.forEach((e) => {
            arr.push(populateResultObj(e))
        })
        return o
    }
    // v1 
    async function populateParallel(obj, fields = []) {
        let finalResult
        obj = customJSONSerializeAndParse(obj)
        const formttedFields = {
            _id: 0, // disabling id by default 
        }
        fields.forEach((e) => {
            formttedFields[e] = 1
        })
        const option = fields.length === 0 ? {} : { projection: formttedFields }
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            createIdArrayArray(obj)
            await populateDb(option)
            finalResult = populateResultArray(obj)
        }
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            createIdArrayObject(obj)
            await populateDb(option)
            finalResult = populateResultObj(obj)
        }
        return finalResult
    }
    const result = await populateParallel(object, fields_)
    return result
}
module.exports = { populate }