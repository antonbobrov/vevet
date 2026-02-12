import { easing as easingProgress } from 'easing-progress';

import { initVevet } from '@/global/initVevet';

export {
  EaseInBack,
  EaseInBounce,
  EaseInCirc,
  EaseInCubic,
  EaseInElastic,
  EaseInExpo,
  EaseInOutBack,
  EaseInOutBounce,
  EaseInOutCirc,
  EaseInOutCubic,
  EaseInOutElastic,
  EaseInOutExpo,
  EaseInOutQuad,
  EaseInOutQuart,
  EaseInOutQuint,
  EaseInOutSine,
  EaseInQuad,
  EaseInQuart,
  EaseInQuint,
  EaseInSine,
  EaseOutBack,
  EaseOutBounce,
  EaseOutCirc,
  EaseOutCubic,
  EaseOutElastic,
  EaseOutExpo,
  EaseOutQuad,
  EaseOutQuart,
  EaseOutQuint,
  EaseOutSine,
} from 'easing-progress';

export type {
  TEasingBezier,
  TEasingFunction,
  TEasingType,
} from 'easing-progress';

/**
 * Applies an easing function to a given progress value.
 *
 * This function calculates eased progress using a specified easing function,
 * bezier curve, or custom easing function.
 *
 * @param {number} progress - The current progress value, typically between 0 and 1.
 * @param {TEasingType} easingType - The easing method to apply. It can be:
 *   - A predefined easing function (e.g., `EaseInBounce`).
 *   - A bezier array (e.g., `[0.25, 0.1, 0.25, 1]`).
 *   - A custom easing function (e.g., `(value) => Math.sin(Math.PI * 0.5 * value)`).
 * @returns {number} - The eased progress value.
 *
 * @group Utils
 *
 * @example
 * easing(0.35, EaseInBounce);
 * // => 0.167 (eased progress using EaseInBounce)
 *
 * easing(0.35, [0.25, 0.1, 0.25, 1]);
 * // => 0.604 (eased progress using a bezier curve)
 *
 * easing(0.35, (value) => Math.sin(Math.PI * 0.5 * value));
 * // => 0.522 (eased progress using a custom easing function)
 */
export const easing: typeof easingProgress = (
  progress,
  easingType = initVevet().props.easing ?? false,
) => easingProgress(progress, easingType);
