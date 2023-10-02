import normalizeWheelFunc from 'normalize-wheel';

/**
 * Normalize wheel delta
 *
 * @example
 *
 * normalizeWheel(event); // => { spinX: -0, spinY: 1.25, pixelX: -0, pixelY: 125 }
 */
export function normalizeWheel(event: WheelEvent) {
  return normalizeWheelFunc(event);
}
