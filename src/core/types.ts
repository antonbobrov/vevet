/**
 * Application configuration properties for initializing Vevet.
 */
export interface ICoreProps {
  /**
   * Medium breakpoint in pixels.
   * When changing this property, you need to
   * update the SASS variable: `$md`. The values must be equal.
   * @default 1199
   */
  md: number;

  /**
   * Small breakpoint in pixels.
   * When changing this property, you need to
   * update the SASS variable: `$sm`. The values must be equal.
   * @default 899
   */
  sm: number;

  /**
   * Timeout (in milliseconds) for viewport callbacks debouncing.
   * @default 16
   */
  resizeDebounce: number;

  /**
   * If need to apply class names for the root element: such as browser, OS name, etc.
   * @default false
   */
  applyClassNames: boolean;
}
