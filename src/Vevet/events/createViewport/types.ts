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
export enum ESizeTypes {
  Desktop = 'desktop',
  Tablet = 'tablet',
  Phone = 'phone',
}

/** Orientation types */
export enum EOrientationTypes {
  Landscape = 'landscape',
  Portrait = 'portrait',
}

export interface IViewport {
  /**
   * Viewport callbacks
   *
   * @example
   *
   * vevet.viewport.callbacks.add('width', () => console.log('width changed'));
   *
   * vevet.viewport.callbacks.add('height', () => console.log('height changed'));
   *
   * vevet.viewport.callbacks.add('both', () => console.log('both width and height changed'));
   *
   * vevet.viewport.callbacks.add('widthOnly', () => console.log('only width changed'));
   *
   * vevet.viewport.callbacks.add('heightOnly', () => console.log('only height changed'));
   *
   * vevet.viewport.callbacks.add('any', () => console.log('any change'));
   */
  callbacks: Callbacks<IViewportCallbackTypes>;
  /** Current viewport width */
  width: number;
  /** Current viewport height */
  height: number;
  /** Current viewport width divided by 100 */
  vw: number;
  /** Current viewport height divided by 100 */
  vh: number;
  /** Is viewport in landscape mode */
  isLandscape: boolean;
  /** Is viewport in portrait mode */
  isPortrait: boolean;
  /** Is viewport in desktop mode */
  isDesktop: boolean;
  /** Is viewport in tablet mode */
  isTablet: boolean;
  /** Is viewport in phone mode */
  isPhone: boolean;
  /** Device pixel ratio */
  dpr: number;
  /** Lower device pixel ratio (1 for desktop and maximum 2 for mobile devices) */
  lowerDpr: number;
}
