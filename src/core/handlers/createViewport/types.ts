import { Callbacks, ICallbacksMap } from '@/base/Callbacks';

export interface IViewportCallbacksMap extends ICallbacksMap {
  /**
   * Triggered when the viewport width changes (ignores height).
   */
  width: undefined;

  /**
   * Triggered when the viewport height changes (ignores width).
   */
  height: undefined;

  /**
   * Triggered when both width and height change.
   */
  both: undefined;

  /**
   * Triggered only when the width changes (height remains the same).
   */
  onlyWidth: undefined;

  /**
   * Triggered only when the height changes (width remains the same).
   */
  onlyHeight: undefined;

  /**
   * Triggered when either width or height changes.
   */
  any: undefined;

  /**
   * Triggered on any resize event, including width, height, or body size changes.
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
}

export type TViewportCallbacks = Callbacks<IViewportCallbacksMap>;

export type TViewportCallbacksOn = TViewportCallbacks['on'];
