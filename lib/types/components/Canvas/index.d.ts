import { TRequiredProps } from '../../internal/requiredProps';
import { Module } from '../../base/Module';
import { ICanvasCallbacksMap, ICanvasMutableProps, ICanvasStaticProps, TCanvasRender } from './types';
export * from './types';
/**
 * A class for managing an HTML5 Canvas element and its 2D context.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Canvas)
 *
 * @group Components
 */
export declare class Canvas<CallbacksMap extends ICanvasCallbacksMap = ICanvasCallbacksMap, StaticProps extends ICanvasStaticProps = ICanvasStaticProps, MutableProps extends ICanvasMutableProps = ICanvasMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /** Get default static properties */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Get default mutable properties */
    _getMutable(): TRequiredProps<MutableProps>;
    /** The canvas element created for rendering */
    protected _canvas: HTMLCanvasElement;
    /** The canvas element instance. */
    get canvas(): HTMLCanvasElement;
    /** The 2D rendering context. */
    protected _ctx: CanvasRenderingContext2D;
    /** Returns the 2D rendering context */
    get ctx(): CanvasRenderingContext2D;
    /** The current width of the canvas, considering the device pixel ratio (DPR) */
    protected _width: number;
    /** Canvas width (DPR applied). */
    get width(): number;
    /** Width without DPR scaling. */
    get offsetWidth(): number;
    /** The current height of the canvas, considering the device pixel ratio (DPR) */
    protected _height: number;
    /** Canvas height (DPR applied). */
    get height(): number;
    /** Height without DPR scaling. */
    get offsetHeight(): number;
    /** The current device pixel ratio (DPR) */
    protected _dpr: number;
    /** Current device pixel ratio. */
    get dpr(): number;
    /** Checks if the canvas is ready to render. */
    get canRender(): boolean;
    /**
     * Constructor for the Ctx2D class.
     */
    constructor(props?: StaticProps & MutableProps);
    /** Handle property mutations */
    protected _handleProps(): void;
    /** Triggers a canvas resize based on container or viewport dimensions. */
    resize(): void;
    /**
     * Renders content on the canvas if it's ready.
     *
     * @param render - A function that performs the actual rendering on the canvas.
     */
    render(render: TCanvasRender): void;
}
//# sourceMappingURL=index.d.ts.map