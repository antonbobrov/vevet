let mergeWith = require('lodash.mergewith');

/**
 * @description Merge properties except for arrays.
 * 
 * @param {object} obj - Object with new data.
 * @param {object} source - Object with old data.
 * 
 * @returns {object} Returns a new merged object.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.merge
 * 
 * @public
 */
export function merge(obj, source) {
    return mergeWith(obj, source, (objValue, srcValue) => {
        if (Array.isArray(objValue)) {
            return srcValue;
        }
    });
}