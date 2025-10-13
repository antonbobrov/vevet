type TCache = Map<string | number, number>;
declare global {
    interface Window {
        vevet5_toPixelsCache: TCache;
    }
}
/**
 * Transform value to pixels. Supported units: `px` | 'rem' | 'vw' | 'vh' | 'svh'.
 *
 * @group Utils
 *
 * @example
 * toPixels('100px'); // => 100
 * toPixels('1vw'); // => 19.20
 */
export declare function toPixels(value: string | number): number;
export {};
//# sourceMappingURL=toPixels.d.ts.map