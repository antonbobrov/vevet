import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module';
import { IViewportCallbacksMap } from '@/core/exported';

/**
 * Static properties for canvas configuration.
 */
export interface ICanvasStaticProps extends IModuleStaticProps {
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
   * Automatically adjusts canvas size on initialization.
   * @default true
   */
  resizeOnInit?: boolean;

  /**
   * Enables dynamic resizing based on viewport or container changes.
   * @default false
   */
  resizeOnRuntime?: boolean;

  /**
   * Defines which dimension(s) should trigger a resize.
   * @default 'any'
   */
  viewportTarget?: keyof IViewportCallbacksMap;

  /**
   * Debounce time (ms) for resize handling.
   * @default 0
   */
  resizeDebounce?: number;
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
export interface ICanvasCallbacksMap extends IModuleCallbacksMap {
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
