import { createElement } from 'vevet-dom';
import { Module, NModule } from '../../base/Module';
import { mergeWithoutArrays } from '../../utils/common';

/**
 * Makes working with canvas easier.
 * It creates an HTML5 Canvas element and its 2d context and can
 * implement automatic resize.
 */
export class Ctx2D <
    StaticProp extends NCtx2D.StaticProp = NCtx2D.StaticProp,
    ChangeableProp extends NCtx2D.ChangeableProp = NCtx2D.ChangeableProp,
    CallbacksTypes extends NCtx2D.CallbacksTypes = NCtx2D.CallbacksTypes,
> extends Module <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {



    get defaultProp () {
        const prop: Required<
            Omit<
                NCtx2D.StaticProp & NCtx2D.ChangeableProp,
                keyof (NModule.StaticProp & NModule.ChangeableProp)
            >
        > = {
            container: false,
            append: true,
            width: false,
            height: false,
            dpr: false,
        };
        return mergeWithoutArrays(super.defaultProp, prop);
    }



    /**
     * The parent container of the canvas
     */
    get container () {
        return this.prop.container;
    }

    /**
     * The Canvas element itself
     */
    protected _canvas: HTMLCanvasElement;
    get canvas () {
        return this._canvas;
    }

    /**
     * 2D Context
     */
    protected _ctx: CanvasRenderingContext2D;
    get ctx () {
        return this._ctx;
    }

    /**
     * The width of the canvas
     */
    protected _width: number;
    get width () {
        return this._width;
    }

    /**
     * The height of the canvas
     */
    protected _height: number;
    get height () {
        return this._height;
    }

    /**
     * Device pixel ratio
     */
    protected _dpr: number;
    get dpr () {
        return this._dpr;
    }



    // Extra constructor
    protected _constructor () {

        this._create();

    }



    /**
     * Create the canvas
     */
    protected _create () {

        this._canvas = createElement('canvas', {
            parent: this.prop.append && !!this.prop.container ? this.prop.container : undefined,
        });
        this._ctx = this._canvas.getContext('2d');

        this.resize();

    }

    protected _onPropMutate () {

        super._onPropMutate();
        this.resize();

    }



    /**
     * Resize the canvas
     */
    public resize () {

        const { prop } = this;
        const app = this._app;
        const { viewport } = app;

        // calculate dpr
        if (typeof prop.dpr === 'number') {
            this._dpr = prop.dpr;
        }
        else {
            this._dpr = viewport.dprMobile;
        }
        const dpr = this._dpr;

        // calculate new width & height
        let newWidth = 0;
        let newHeight = 0;
        if (!!prop.width && !!prop.height) {
            newWidth = prop.width;
            newHeight = prop.height;
        }
        else if (this.container) {
            newWidth = this.container.clientWidth;
            newHeight = this.container.clientHeight;
        }
        else {
            newWidth = viewport.width;
            newHeight = viewport.height;
        }
        newWidth *= dpr;
        newHeight *= dpr;

        // update sizes
        this._width = newWidth;
        this._height = newHeight;

        // apply sizes
        this._canvas.width = newWidth;
        this._canvas.height = newHeight;

        this.callbacks.tbt('resize', false);

    }



    /**
     * Destroy the module
     */
    protected _destroy () {

        super._destroy();

        this._canvas.remove();

    }



}



export namespace NCtx2D {

    /**
     * Static properties
     */
    export interface StaticProp extends NModule.StaticProp {
        /**
         * The parent element of the canvas. If false, it will be Window.
         * @default false
         */
        container?: false | Element;
        /**
         * Defines if you need to append the canvas element to the parent.
         * @default true
         */
        append?: boolean;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NModule.ChangeableProp {
        /**
         * The width of the canvas (dpr = 1).
         * If false, the width will be the same as of the parent.
         * @default false
         */
        width?: false | number;
        /**
         * The height of the canvas (dpr = 1).
         * If false, the height will be the same as of the parent.
         * @default false
         */
        height?: false | number;
        /**
         * Device pixel ratio.
         * If false, the value will be calculated automatically.
         * @default false
         */
        dpr?: false | number;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NModule.CallbacksTypes {
        'resize': false;
    }

}
