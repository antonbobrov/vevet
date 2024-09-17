import { easing as easingProgress } from 'easing-progress';
import { getApp } from '../internal/getApp';

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
 * Easing progress
 *
 * @example
 *
 * easing(0.35, EaseInBounce); // => 0.167
 * easing(0.35, [.25, .1, .25, 1]); // => 0.604
 * easing(0.35, (value) => Math.sin(Math.PI * 0.5 * value)); // => 0.522
 */
export const easing: typeof easingProgress = (
  progress,
  easingType = getApp()?.props.easing ?? false,
) => easingProgress(progress, easingType);
