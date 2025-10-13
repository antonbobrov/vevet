"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closest = closest;
/**
 * Get closest value in array to target value.
 *
 * @example
 * closest(5, [3, 6, 9, 12, 15]); // => 6
 */
function closest(target, values) {
    return values.reduce(function (prev, curr) {
        return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
    });
}
//# sourceMappingURL=closest.js.map