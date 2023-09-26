import { NComponent } from '@/base/Component/types';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NCtx2D {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The parent element of the canvas that will be used to calculate current canvas size.
     * If `false`, it will be `Window`.
     * @default false
     */
    container?: false | Element;
    /**
     * Defines if you need to append the canvas element to the parent element
     * @default true
     */
    isAppend?: boolean;
    /**
     * Resize on init
     * @default true
     */
    hasInitialResize?: boolean;
    /**
     * Update sizes on resize
     * @default false
     */
    hasResize?: boolean;
    /**
     * Viewport target
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;
    /**
     * Timeout of resize event
     * @default 0
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * The width of the canvas without dpr.
     * If `auto`, the width will be the same as of the container.
     * @default 'auto'
     */
    width?: 'auto' | number;
    /**
     * The height of the canvas (dpr = 1).
     * If `auto`, the height will be the same as of the container.
     * @default 'auto'
     */
    height?: 'auto' | number;
    /**
     * Device pixel ratio.
     * If `auto`, the value will be calculated automatically.
     * @default 'auto'
     */
    dpr?: 'auto' | number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    resize: undefined;
  }

  export interface IRenderProps {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    dpr: number;
    clientWidth: number;
    clientHeight: number;
    canvas: HTMLCanvasElement;
  }

  export type TRender = (props: IRenderProps) => void;
}
