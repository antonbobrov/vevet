import { BaseProp, PosRule, getPos } from 'get-image-pos';
import { mergeWithoutArrays } from '../../utils/common';
import { Ctx2D, NCtx2D } from './Ctx2D';

/**
 * Prerender an image onto canvas
 */
export class Ctx2DPrerender <
    StatProp extends NCtx2DPrerender.StatProp = NCtx2DPrerender.StatProp,
    ResProp extends NCtx2DPrerender.ResProp = NCtx2DPrerender.ResProp,
    CallbacksTypes extends NCtx2DPrerender.CallbacksTypes = NCtx2DPrerender.CallbacksTypes
> extends Ctx2D <
    StatProp,
    ResProp,
    CallbacksTypes
> {



    get dp () {
        return mergeWithoutArrays(super.dp, {
            resource: undefined,
            rule: 'cover',
        } as (StatProp & ResProp));
    }



    /**
     * Resize the canvas
     */
    public resize () {

        super.resize();
        this._prerender();

    }

    /**
     * Render the image
     */
    protected _prerender () {

        const {
            ctx, prop, width, height,
        } = this;

        const size = getPos({
            source: prop.resource,
            rule: prop.rule,
            scale: 1,
            width,
            height,
        });

        ctx.clearRect(0, 0, width, height);

        // draw the image
        ctx.drawImage(
            prop.resource,
            0, 0,
            size.sourceWidth, size.sourceHeight,
            size.x, size.y, size.width, size.height,
        );

    }



}



export namespace NCtx2DPrerender {

    /**
     * Static properties
     */
    export interface StatProp extends NCtx2D.StatProp {
        /**
         * The resource to be prerendered
         */
        resource: BaseProp['source'];
        /**
         * Size / position algorythms
         * @default 'cover'
         */
        rule?: PosRule;
    }

    /**
     * Static properties
     */
    export interface ResProp extends NCtx2D.ResProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NCtx2D.CallbacksTypes { }

}
