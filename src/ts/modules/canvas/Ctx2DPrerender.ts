import { Ctx2D, ICtx2D } from "./Ctx2D";

/**
 * Prerender an image inside a canvas element.
 */
export class Ctx2DPrerender extends Ctx2D<
    ICtx2D.CallbackTypes,
    ICtx2DPrerender.StatProp,
    ICtx2D.ResProp
> {

    protected _applySize () {

        super._applySize();

        this.ctx.drawImage();

    }

}



/**
 * @namespace
 */
export namespace ICtx2DPrerender {

    export interface StatProp extends ICtx2D.StatProp {
        /**
         * The image to be prerendered
         */
        source: CanvasImageSource;
    }

}
