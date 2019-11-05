/**
 * @description Get progress from scope on the basis of known TIME value relatively the timeline from 0 to 1 and relatively the timeline scope.
 * 
 * @param {number} t - Current time. From 0 to 1.
 * @param {Array<number>} scope - Relative timeline. Array of two numbers, each of them from 0 to 1.
 * 
 * @returns {number} Returns a progress value.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.progress
 * 
 * @example 
 * 
 * Vevet.utils.progress(.5, [.25, .75]);
 * // => .5
 */
export function progress (t, scope) {

    let result = (t - scope[0]) / (scope[1] - scope[0]);

    return result;

}



/**
 * @description Get radians from degrees.
 * 
 * @param {number} val - Value in degrees.
 * 
 * @returns {number} Returns a value in radians.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.radians
 * 
 * @example 
 * 
 * Vevet.utils.radians(45);
 * // => .7853981633974483
 */
export function radians (val) {

    return val * Math.PI / 180;

}



/**
 * @description Get degrees from radians.
 * 
 * @param {number} val - Value in radians.
 * 
 * @returns {number} Returns a value in degrees.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.degrees
 * 
 * @example 
 * 
 * Vevet.utils.radians(.7853981633974483);
 * // => 45
 */

export function degrees (val) {

    return val * 180 / Math.PI;

}



/**
 * @description Linear interpolation.
 * 
 * @param {number} start - Current value.
 * @param {number} end - Target value.
 * @param {number} amt - Easing.
 * 
 * @returns {number} Returns a value.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.lerp
 * 
 * @example 
 * 
 * Vevet.utils.lerp(1, 10, .1);
 */
export function lerp (start, end, amt) {
    return (1 - amt) * start + amt * end;
}