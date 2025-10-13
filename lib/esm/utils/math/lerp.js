/**
 * Performs linear interpolation (LERP) between a current value and a target value using an easing factor.
 *
 * Linear interpolation calculates an intermediate value between `current` and `target`
 * based on a given `factor`, providing smooth transitions.
 *
 * @param {number} current - The starting value.
 * @param {number} target - The end value.
 * @param {number} factor - The interpolation factor, typically between 0 and 1. A lower value results in slower interpolation, while a higher value makes it faster.
 * @param {number} [approximation=0] - A small threshold to determine when the difference between the interpolated value and the target is negligible. If the difference is within this threshold, the function returns `target` directly.
 * @returns {number} - The interpolated value.
 *
 * @group Utils
 *
 * @example
 * lerp(0, 1, 0.4);
 * // => 0.4 (40% progress from 0 to 1)
 *
 * lerp(0.75, 0.8, 0.98);
 * // => 0.799 (close to the target but not exactly 0.8)
 *
 * lerp(0.75, 0.8, 0.98, 0.01);
 * // => 0.8 (within the approximation threshold)
 */
export function lerp(current, target, factor, approximation = 0) {
    const value = current + (target - current) * factor;
    const difference = Math.abs(target - value);
    if (difference <= approximation) {
        return target;
    }
    return value;
}
//# sourceMappingURL=lerp.js.map