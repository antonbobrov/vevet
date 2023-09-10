import easingProgress from 'easing-progress';

export { Easing } from 'easing-progress';

/**
 * Easing progress
 *
 * @example
 *
 * easing(0.35, Easing.easeInBounce); // => 0.167
 * easing(0.35, [.25, .1, .25, 1]); // => 0.604
 * easing(0.35, (value) => Math.sin(Math.PI * 0.5 * value)); // => 0.522
 */
export const easing: typeof easingProgress = (
  progress,
  easingType = window.vevetApp?.props.easing ?? false
) => easingProgress(progress, easingType);
