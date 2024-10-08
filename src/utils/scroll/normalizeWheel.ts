import normalizeWheelFunc from 'normalize-wheel';

/**
 * Normalize wheel delta. This function is re-exported from `normalize-wheel` for convenience.
 * It helps normalize the wheel event's delta values (spinX, spinY, pixelX, pixelY) across different browsers.
 *
 * @see https://www.npmjs.com/package/normalize-wheel
 *
 * @example
 *
 * document.addEventListener('wheel', (event) => {
 *   const normalized = normalizeWheel(event);
 *   console.log(normalized);
 *   // => { spinX: -0, spinY: 1.25, pixelX: -0, pixelY: 125 }
 * });
 */
export function normalizeWheel(event: WheelEvent) {
  return normalizeWheelFunc(event);
}

/**
 * Type definition for the normalized wheel event.
 */
export type TNormalizeWheel = ReturnType<typeof normalizeWheel>;
