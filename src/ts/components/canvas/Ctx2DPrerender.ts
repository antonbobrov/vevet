import { BaseProp, PosRule, getPos } from 'get-image-pos';
import { mergeWithoutArrays } from '../../utils/common';
import { Ctx2D, NCtx2D } from './Ctx2D';

/**
 * Prerender an image onto canvas
 */
export class Ctx2DPrerender <
StaticProp extends NCtx2DPrerender.StaticProp = NCtx2DPrerender.StaticProp,
ChangeableProp extends NCtx2DPrerender.ChangeableProp = NCtx2DPrerender.ChangeableProp,
CallbacksTypes extends NCtx2DPrerender.CallbacksTypes = NCtx2DPrerender.CallbacksTypes,
> extends Ctx2D <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {



    get defaultProp () {
        const prop: Required<
            Omit<
                NCtx2DPrerender.StaticProp & NCtx2DPrerender.ChangeableProp,
                keyof (NCtx2D.StaticProp & NCtx2D.ChangeableProp)
            >
        > = {
            resource: undefined,
            rule: 'cover',
        };
        return mergeWithoutArrays(super.defaultProp, prop);
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
    export interface StaticProp extends NCtx2D.StaticProp {
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
     * Changeable properties
     */
    export interface ChangeableProp extends NCtx2D.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NCtx2D.CallbacksTypes { }

}
