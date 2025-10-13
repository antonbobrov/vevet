/**
 * Normalize wheel delta. This function is re-exported from `normalize-wheel` for convenience.
 * It helps normalize the wheel event's delta values (spinX, spinY, pixelX, pixelY) across different browsers.
 *
 * @see https://www.npmjs.com/package/normalize-wheel
 *
 * @group Utils
 *
 * @example
 *
 * document.addEventListener('wheel', (event) => {
 *   const normalized = normalizeWheel(event);
 *   console.log(normalized);
 *   // => { spinX: -0, spinY: 1.25, pixelX: -0, pixelY: 125 }
 * });
 */
export declare function normalizeWheel(event: WheelEvent): {
    spinX: number;
    spinY: number;
    pixelX: number;
    pixelY: number;
};
/**
 * Type definition for the normalized wheel event.
 */
export type TNormalizeWheel = ReturnType<typeof normalizeWheel>;
//# sourceMappingURL=normalizeWheel.d.ts.map