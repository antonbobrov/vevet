/**
 * @description Generate a random id.
 * 
 * @param {string|number} [prefix=id]
 * 
 * @returns {string}
 * 
 * @memberof Vevet
 * 
 * @public
 * 
 * @example 
 * 
 * Vevet.id('name');
 * // => 'name_1563641265586_284'
 */

export function id (prefix = 'id') {

    let id = `${+new Date()}_${Math.round(Math.random() * 1000)}`;

    return `${prefix}_${id}`;

}