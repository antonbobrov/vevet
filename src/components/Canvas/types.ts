import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module/types';
import { IViewportCallbacksMap } from '@/core/exported';

export interface ICanvasStaticPropsResize {
  /**
   * Automatically adjusts canvas size on initialization.
   * @default true
   */
  init?: boolean;

  /**
   * Enables dynamic resizing based on viewport or container changes.
   * @default false
   */
  runtime?: boolean;

  /**
   * Defines which dimension(s) should trigger a resize.
   * @default 'any'
   */
  target?: keyof IViewportCallbacksMap;

  /**
   * Debounce time (ms) for resize handling.
   * @default 0
   */
  debounce?: number;
}

export interface ICanvasStaticPropsDeprecated {
  /**
   * @deprecated Use `resize.init`
   */
  resizeOnInit?: boolean;

  /**
   * @deprecated Use `resize.runtime`
   */
  resizeOnRuntime?: boolean;

  /**
   * @deprecated Use `resize.target`
   */
  viewportTarget?: keyof IViewportCallbacksMap;

  /**
   * @deprecated Use `resize.debounce`
   */
  resizeDebounce?: number;
}

/**
 * Static properties for canvas configuration.
 */
export interface ICanvasStaticProps
  extends IModuleStaticProps, ICanvasStaticPropsDeprecated {
  /**
   * Parent element used to determine canvas size. If `null`, it uses the viewport.
   * @default null
   */
  container?: HTMLElement | null;

  /**
   * If `true`, appends the canvas to the `container`. Ignored if `container` is `null`.
   * @default true
   */
  append?: boolean;

  /**
   * Resize behavior. Use `false` to disable auto-resize on init and runtime.
   * @default { init: true, runtime: false, target: 'any', debounce: 0 }
   */
  resize?: ICanvasStaticPropsResize | false;
}

/**
 * Mutable properties for canvas configuration.
 */
export interface ICanvasMutableProps extends IModuleMutableProps {
  /**
   * Canvas width. Use `'auto'` to match the container's width.
   * @default 'auto'
   */
  width?: 'auto' | number;

  /**
   * Canvas height. Use `'auto'` to match the container's height.
   * @default 'auto'
   */
  height?: 'auto' | number;

  /**
   * Device Pixel Ratio (DPR). Use `'auto'` for automatic detection.
   * @default 'auto'
   */
  dpr?: 'auto' | number;
}

/**
 * Event callbacks for canvas operations.
 */
export interface ICanvasCallbacksMap<
  TM = ICanvasMutableProps,
> extends IModuleCallbacksMap<TM> {
  /**
   * Fires when the canvas is resized.
   */
  resize: undefined;
}

/**
 * Arguments provided to the canvas render function.
 */
export interface ICanvasRenderArg {
  /**
   * 2D rendering context of the canvas.
   */
  ctx: CanvasRenderingContext2D;

  /**
   * Canvas width, adjusted for DPR.
   */
  width: number;

  /**
   * Canvas height, adjusted for DPR.
   */
  height: number;

  /**
   * Device pixel ratio used for rendering.
   */
  dpr: number;

  /**
   * Canvas offset width (before DPR adjustment).
   */
  offsetWidth: number;

  /**
   * Canvas offset height (before DPR adjustment).
   */
  offsetHeight: number;

  /**
   * HTMLCanvasElement associated with the canvas.
   */
  canvas: HTMLCanvasElement;
}

/**
 * Function type for canvas rendering.
 */
export type TCanvasRender = (props: ICanvasRenderArg) => void;
