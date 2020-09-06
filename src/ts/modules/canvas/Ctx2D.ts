import { Module, IModule } from "../../base/Module";
import { ICallbacks } from "../../base/Callbacks";

/**
 * Creates a canvas 2d rendering context inside an HTML Element.
 */
export class Ctx2D<
    CallbackTypes extends ICtx2D.CallbackTypes,
    StatProp extends ICtx2D.StatProp,
    ResProp extends ICtx2D.ResProp
> extends Module<
    CallbackTypes,
    StatProp,
    ResProp
> {

    get dp () {
        const settings = {
            ref: false,
            width: false,
            height: false,
            dpr: false,
        } as (StatProp & ResProp);
        return settings;
    }



    /**
     * Canvas Element
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
     * Canvas width
     */
    protected _width: number;
    get width () {
        return this._width;
    }

    /**
     * Canvas height
     */
    protected _height: number;
    get height () {
        return this._height;
    }

    /**
     * Pixel ratio
     */
    protected _dpr: number;
    get dpr () {
        return this._dpr;
    }



    protected _constructor () {

        this._create();

    }

    protected _onPropChange () {
        super._onPropChange();
        this.updateSize();
    }



    /**
     * Create canvas
     */
    protected _create () {

        this._canvas = document.createElement("canvas");
        this._ctx = this._canvas.getContext("2d");

    }

    /**
     * Update canvas sizes
     */
    public updateSize () {

        this._applySize();

        // launch callbacks
        this.callbacks.tbt("update");

    }

    /**
     * Calculate and apply canvas sizes
     */
    protected _applySize () {

        const { viewport } = this._app;
        const { prop, canvas } = this;

        // calculate dpr
        const dpr = prop.dpr || viewport.dprMobile;
        this._dpr = dpr;

        // calculate width
        let newWidth = 0;
        // if it is set in properties
        if (prop.width) {
            newWidth = prop.width;
        }
        // or if the reference element is known
        else if (prop.ref) {
            newWidth = prop.ref.clientWidth * dpr;
        }
        // or if nothing is known
        else {
            newWidth = viewport.size[0] * dpr;
        }

        // calculate height
        let newHeight = 0;
        // if it is set in properties
        if (prop.height) {
            newHeight = prop.height;
        }
        // or if the reference element is known
        else if (prop.ref) {
            newHeight = prop.ref.clientHeight * dpr;
        }
        // or if nothing is known
        else {
            newHeight = viewport.size[1] * dpr;
        }

        // save the new sizes
        this._width = newWidth;
        this._height = newHeight;

        // and resize the canvas
        canvas.width = newWidth;
        canvas.height = newHeight;

    }

}



/**
 * @namespace
 */
export namespace ICtx2D {

    export interface StatProp extends IModule.StatProp {
        /**
         * Reference element to calculate canvas sizes.
         * @default false
         */
        ref?: Element | false;
    }

    export interface ResProp {
        /**
         * Custom width. If false, it will be calculated automatically.
         * @default false
         */
        width?: number | false;
        /**
         * Custom height. If false, it will be calculated automatically.
         * @default false
         */
        height?: number | false;
        /**
         * Custom device pixel ratio. If false, it will be calculated automatically.
         * @default false
         */
        dpr?: number | false;
    }

    export type CallbackTypes = IModule.CallbackTypes | {
        target: "update";
        do: () => void;
    } & ICallbacks.CallbackBaseSettings;

}
