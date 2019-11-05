/**
 * @description Generate a random id.
 * 
 * @param {string|number} [prefix=id]
 * 
 * @returns {string}
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.id
 * 
 * @public
 * 
 * @example 
 * 
 * Vevet.utils.id('name');
 * // => 'id_1563641265586_284'
 */

export function id (prefix = 'id') {

    let id = `${+new Date()}_${Math.round(Math.random() * 1000)}`;

    return `${prefix}_${id}`;

}