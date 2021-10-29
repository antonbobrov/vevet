import { getPos, BaseProp, PosRule } from 'get-image-pos';
import { RequiredModuleProp } from '../../utils/types/utility';
import { Ctx2D, NCtx2D } from './Ctx2D';



export namespace NCtx2DPrerender {

    /**
     * Static properties
     */
    export interface StaticProp extends NCtx2D.StaticProp {
        /**
         * Media element
         */
        media: BaseProp['source'] | false;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NCtx2D.ChangeableProp {
        /**
         * Media position rule
         */
        posRule?: PosRule;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NCtx2D.CallbacksTypes {
        'prerender': false
    }

}



/**
 * The class allows you to prerender media for further use with reduced payloads.
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
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            media: false,
            posRule: 'cover',
        };
    }

    /**
     * Resize the canvas
     */
    public resize () {
        super.resize();
        this._prerender();
    }

    protected _prerender () {
        // check if can render
        if (this.width === 0 || this.height === 0) {
            return;
        }
        // check if media exists
        const { media } = this.prop;
        if (!media) {
            return;
        }

        // get media sizes
        const size = getPos({
            source: media,
            rule: this.prop.posRule,
            scale: 1,
            width: this.width,
            height: this.height,
        });
        this._ctx.clearRect(0, 0, this.width, this.height);
        // render the media
        this._ctx.drawImage(
            media,
            0, 0,
            size.sourceWidth, size.sourceHeight,
            size.x, size.y, size.width, size.height,
        );
        // launch callbacks on prerender
        this.callbacks.tbt('prerender', false);
    }
}
