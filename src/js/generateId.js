/**
 * @description Generate a random id.
 * 
 * @param {string|number} [prefix=id]
 * 
 * @returns {string}
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.generateId('name');
 * // => 'name_1563641265586_284'
 */

function generateId (prefix = 'id') {

    let id = `${+new Date()}_${Math.round(Math.random() * 1000)}`;

    return `${prefix}_${id}`;

}

export default generateId;