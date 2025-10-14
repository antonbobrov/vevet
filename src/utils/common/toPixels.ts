import { initVevet } from '@/global/initVevet';

type TCache = Map<string | number, number>;

declare global {
  interface Window {
    vevet5_toPixelsCache: TCache;
  }
}

const isBrowser = typeof window !== 'undefined';

/**
 * Transform value to pixels. Supported units: `px` | 'rem' | 'vw' | 'vh' | 'svh'.
 *
 * @group Utils
 *
 * @example
 * toPixels('100px'); // => 100
 * toPixels('1vw'); // => 19.20
 */
export function toPixels(value: string | number) {
  if (!isBrowser) {
    return 0;
  }
  const app = initVevet();

  if (!window.vevet5_toPixelsCache) {
    window.vevet5_toPixelsCache = new Map();

    app.onResize(
      'any',
      () => {
        window.vevet5_toPixelsCache.clear();
      },
      { name: 'toPixels' },
    );
  }

  if (window.vevet5_toPixelsCache.has(value)) {
    return window.vevet5_toPixelsCache.get(value)!;
  }

  let finalValue = 0;
  const num = parseFloat(`${value}`);

  if (typeof value === 'number') {
    finalValue = value;
  } else if (Number.isNaN(num)) {
    finalValue = 0;
  } else if (value.includes('rem')) {
    finalValue = num * app.rem;
  } else if (value.includes('vw')) {
    finalValue = num * app.vw;
  } else if (value.includes('vh')) {
    finalValue = num * app.vh;
  } else if (value.includes('svh')) {
    finalValue = num * app.svh;
  } else if (value.includes('px')) {
    finalValue = num;
  }

  window.vevet5_toPixelsCache.set(value, finalValue);

  return finalValue;
}
