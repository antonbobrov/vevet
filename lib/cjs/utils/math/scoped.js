"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoped = scoped;
/**
 * Calculate the relative progress of a value within a given range (scope).
 *
 * This function determines how far a `value` is within the specified range `[min, max]`,
 * returning a normalized value between 0 and 1. If the value is outside the range, the result
 * can exceed 0 or 1 unless clamped separately.
 *
 * @param {number} value - The input value for which the relative progress is calculated.
 * @param {number} min - The start of the range. Defaults to 0.
 * @param {number} max - The end of the range. Defaults to 1.
 * @returns {number} - The relative progress of the value within the range `[min, max]`.
 *
 * @group Utils
 *
 * @example
 * scoped(0.35, 0, 1);
 * // => 0.35  // Progress of 0.35 within the range [0, 1]
 *
 * scoped(0.35, 0.25, 1);
 * // => 0.133  // Progress of 0.35 within the range [0.25, 1]
 *
 * scoped(0.35, 0.25, 0.9);
 * // => 0.153  // Progress of 0.35 within the range [0.25, 0.9]
 */
function scoped(value, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return (value - min) / (max - min);
}
//# sourceMappingURL=scoped.js.map