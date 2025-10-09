import { TRequiredProps } from '../../internal/requiredProps';
import { ICanvasMediaCallbacksMap, ICanvasMediaMutableProps, ICanvasMediaStaticProps } from './types';
import { Canvas, ICanvasRenderArg } from '../Canvas';
export * from './types';
/**
 * The `CanvasMedia` class allows pre-rendering of media (such as images or video) onto a canvas.
 * This can be useful for reducing payloads by preparing the media for further use in a more optimized form.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/CanvasMedia)
 *
 * @group Components
 */
export declare class CanvasMedia<CallbacksMap extends ICanvasMediaCallbacksMap = ICanvasMediaCallbacksMap, StaticProps extends ICanvasMediaStaticProps = ICanvasMediaStaticProps, MutableProps extends ICanvasMediaMutableProps = ICanvasMediaMutableProps> extends Canvas<CallbacksMap, StaticProps, MutableProps> {
    /** Get default static properties */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Get default mutable properties */
    _getMutable(): TRequiredProps<MutableProps>;
    constructor(props?: StaticProps & MutableProps);
    /** Checks if the media element has the `requestVideoFrameCallback` method */
    protected get hasRequestVideoFrameCallback(): boolean;
    /** Add media events */
    protected _setMediaEvents(): void;
    /** Resize the canvas */
    resize(): void;
    /** Auto rendering for videos */
    protected _requestVideoFrame(): void;
    /** Pre-renders the media resource onto the canvas. */
    render(): void;
    /**
     * Prerenders the media onto the canvas using the specified positioning rule.
     */
    protected _prerender({ width, height, ctx }: ICanvasRenderArg): void;
}
//# sourceMappingURL=index.d.ts.map