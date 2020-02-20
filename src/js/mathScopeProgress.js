/**
 * @description Get progress from the scope on the basis of known TIME value relatively the timeline from 0 to 1 and relatively the timeline scope.
 * 
 * @param {number} t - Current time. From 0 to 1.
 * @param {Array<number>} scope - Relative timeline. Array of two numbers, each of them from 0 to 1.
 * 
 * @returns {number} Returns a progress value.
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.mathScopeProgress(.35, [0, 1]);
 * // => .5
 * 
 * Vevet.mathScopeProgress(.35, [.25, 1]);
 * // => .133
 */
function mathScopeProgress (t, scope) {

    let result = (t - scope[0]) / (scope[1] - scope[0]);

    return result;

}

export default mathScopeProgress;