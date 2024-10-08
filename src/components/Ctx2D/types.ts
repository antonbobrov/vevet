import { NComponent } from '@/base/Component/types';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NCtx2D {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The parent element of the canvas, used to calculate the canvas size.
     * If set to `false`, the canvas size will be based on the `Window` object.
     * @default false
     */
    container?: false | Element;

    /**
     * Determines whether the canvas element should be appended to the parent element.
     * @default true
     */
    shouldAppend?: boolean;

    /**
     * Resizes the canvas during initialization.
     * @default true
     */
    hasInitialResize?: boolean;

    /**
     * Enables updating the canvas size when the window is resized.
     * @default false
     */
    hasResize?: boolean;

    /**
     * The target for the viewport resize event.
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;

    /**
     * The debounce time (in milliseconds) for the resize event.
     * @default 0
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * The width of the canvas (without considering device pixel ratio).
     * If set to `auto`, the width will match the container's width.
     * @default 'auto'
     */
    width?: 'auto' | number;

    /**
     * The height of the canvas (without considering device pixel ratio).
     * If set to `auto`, the height will match the container's height.
     * @default 'auto'
     */
    height?: 'auto' | number;

    /**
     * The device pixel ratio (DPR) to be used for the canvas.
     * If set to `auto`, the DPR will be automatically calculated.
     * @default 'auto'
     */
    dpr?: 'auto' | number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Triggered when the canvas is resized.
     */
    resize: undefined;
  }

  export interface IRenderProps {
    /**
     * The 2D rendering context of the canvas.
     */
    ctx: CanvasRenderingContext2D;

    /**
     * The width of the canvas, including the device pixel ratio.
     */
    width: number;

    /**
     * The height of the canvas, including the device pixel ratio.
     */
    height: number;

    /**
     * The device pixel ratio for rendering on the canvas.
     */
    dpr: number;

    /**
     * The client width of the canvas (before DPR is applied).
     */
    clientWidth: number;

    /**
     * The client height of the canvas (before DPR is applied).
     */
    clientHeight: number;

    /**
     * The HTMLCanvasElement associated with the canvas.
     */
    canvas: HTMLCanvasElement;
  }

  /**
   * A function that performs rendering on the canvas using the provided rendering properties.
   */
  export type TRender = (props: IRenderProps) => void;
}
