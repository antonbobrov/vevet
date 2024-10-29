import { TEasingType } from '@/utils/math';

/**
 * Application configuration properties for initializing Vevet.
 */
export interface IVevetProps {
  /**
   * Tablet identification max width in pixels.
   * When changing this property, you need to
   * update SASS variables: `$viewport-tablet`. The values must be equal.
   * @default 1199
   */
  tablet: number;

  /**
   * Phone identification max width in pixels.
   * When changing this property, you need to
   * update SASS variables: `$viewport-phone`. The values must be equal.
   * @default 899
   */
  phone: number;

  /**
   * Timeout (in ms) for viewport callbacks debouncing.
   * @default 16
   */
  resizeDebounce: number;

  /**
   * Default easing function used in animations.
   * Accepts a cubic-bezier array, function or an easing name defined {@link https://antonbobrov.github.io/easing-progress/|here}.
   * @default [.25, .1, .25, 1]
   */
  easing: TEasingType;

  /**
   * Enable or disable WebP support check in the browser.
   * @default false
   */
  checkWebpSupport: boolean;
}
