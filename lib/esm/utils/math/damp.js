import { lerp } from './lerp';
/**
 * Linear interpolation with factor based on user's FPS.
 *
 * {@link http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/}
 *
 * @group Utils
 *
 * @param {number} current - The starting value.
 * @param {number} target - The end value.
 * @param {number} factor - The interpolation factor, typically between 0 and 1. A lower value results in slower interpolation, while a higher value makes it faster.
 * @param {number} delta - Time elapsed since the last update in milliseconds
 * @param {number} [approximation=0] - A small threshold to determine when the difference between the interpolated value and the target is negligible. If the difference is within this threshold, the function returns `target` directly.
 */
export function damp(current, target, factor, delta, approximation = 0) {
    return lerp(current, target, 1 - Math.exp(-factor * 60 * (delta / 1000)), approximation);
}
//# sourceMappingURL=damp.js.map