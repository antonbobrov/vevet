"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clampScope = clampScope;
var scoped_1 = require("./scoped");
var clamp_1 = require("./clamp");
/**
 * Maps a value to a relative range and clamps the result within another range.
 *
 * This function first calculates the relative progress of `value` within `scope`
 * using the `scoped` function. Then, it clamps the resulting progress to `clamp`
 * using the `clamp` function.
 *
 * @param {number} value - The input value to be mapped and clamped.
 * @param {[number, number]} [scope=[0, 1]] - The range (start and end) within which to map the input value.
 * @param {[number, number]} [clamp=[0, 1]] - The range (start and end) within which to clamp the mapped value.
 * @returns {number} - The resulting value after mapping and clamping.
 *
 * @group Utils
 *
 * @example
 * clampScope(0.36, [0.35, 1]);
 * // => 0.015384 (relative progress of 0.36 within [0.35, 1], clamped to [0, 1])
 *
 * clampScope(0.36, [0.35, 1], [0.1, 1]);
 * // => 0.1 (relative progress of 0.36 within [0.35, 1], clamped to [0.1, 1])
 */
function clampScope(value, scope, clamp) {
    if (scope === void 0) { scope = [0, 1]; }
    if (clamp === void 0) { clamp = [0, 1]; }
    var scopedProgress = (0, scoped_1.scoped)(value, scope[0], scope[1]);
    return (0, clamp_1.clamp)(scopedProgress, clamp[0], clamp[1]);
}
//# sourceMappingURL=clampScope.js.map