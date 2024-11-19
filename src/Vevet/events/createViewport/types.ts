import { Callbacks, NCallbacks } from '@/base/Callbacks';

export interface IViewportCallbackTypes extends NCallbacks.ITypes {
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
  widthOnly: undefined;

  /**
   * When only the height is changed
   */
  heightOnly: undefined;

  /**
   * Any change
   */
  any: undefined;
}

/** Viewport size types */
export enum EBreakpoint {
  Desktop = 'breakpoint-desktop',
  Tablet = 'breakpoint-tablet',
  Phone = 'breakpoint-phone',
}

/** Orientation types */
export enum EOrientation {
  Landscape = 'landscape',
  Portrait = 'portrait',
}

export interface IViewportData {
  /** Current viewport width */
  width: number;
  /** Current viewport height */
  height: number;
  /** Current viewport small height */
  sHeight: number;
  /** Current viewport width divided by 100 */
  vw: number;
  /** Current viewport height divided by 100 */
  vh: number;
  /** Current viewport small height divided by 100 (svh) */
  svh: number;
  /** Is viewport in landscape mode */
  isLandscape: boolean;
  /** Is viewport in portrait mode */
  isPortrait: boolean;
  /** Device pixel ratio */
  dpr: number;
  /** Lower device pixel ratio (1 for desktop and maximum 2 for mobile devices) */
  lowerDpr: number;
  /** Viewport kind */
  breakpoint: 'phone' | 'tablet' | 'desktop';
}

export type TViewportCallbacks = Callbacks<IViewportCallbackTypes>;

export type TViewportCallbacksOn = TViewportCallbacks['on'];
