import { Callbacks, ICallbacksMap } from '@/base/Callbacks';

export interface IViewportCallbacksMap extends ICallbacksMap {
  /**
   * When the width is changed regardless of the height
   */
  width: undefined;

  /**
   * When the height is changed regardless of the width
   */
  height: undefined;

  /**
   * When both the width and height are changed
   */
  both: undefined;

  /**
   * When only the width is changed
   */
  width_: undefined;

  /**
   * When only the height is changed
   */
  height_: undefined;

  /**
   * Width or height change
   */
  any: undefined;

  /**
   * On any resize trigger: width, height or body size change
   */
  trigger: undefined;
}

export interface IViewport {
  /** Current viewport width */
  width: number;

  /** Current viewport height */
  height: number;

  /**
   * Current viewport small height
   *
   * Used to prevent layout shifts on some browsers such as In-App Safari.
   */
  sHeight: number;

  /**
   * Page scrollbar width
   */
  scrollbarWidth: number;

  /** Current viewport width divided by 100 */
  vw: number;

  /** Current viewport height divided by 100 */
  vh: number;

  /**
   * Current viewport small height divided by 100 (svh).
   *
   * Used to prevent layout shifts on some browsers such as In-App Safari.
   */
  svh: number;

  /** Root `font-size` in pixels (`1rem` to pixels) */
  rem: number;

  /** Is viewport in landscape mode */
  landscape: boolean;

  /** Is viewport in portrait mode */
  portrait: boolean;

  /** Device pixel ratio */
  dpr: number;

  /** Lower device pixel ratio (1 for desktop and maximum 2 for mobile devices) */
  lowerDpr: number;

  /** SM breakpoint is active */
  sm: boolean;

  /** MD breakpoint is active */
  md: boolean;

  /** LG breakpoint is active */
  lg: boolean;
}

export type TViewportCallbacks = Callbacks<IViewportCallbacksMap>;

export type TViewportCallbacksOn = TViewportCallbacks['on'];
