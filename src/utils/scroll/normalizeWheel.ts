import normalizeWheelFunc from 'normalize-wheel';

/**
 * Normalize wheel delta. This function is reexported from `normalize-wheel` for convenience.
 *
 * @see https://www.npmjs.com/package/normalize-wheel
 *
 * @example
 *
 * normalizeWheel(event); // => { spinX: -0, spinY: 1.25, pixelX: -0, pixelY: 125 }
 */
export function normalizeWheel(event: WheelEvent) {
  return normalizeWheelFunc(event);
}
