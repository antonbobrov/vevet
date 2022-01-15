import { createElement } from 'vevet-dom';
import { Component, NComponent } from '../../base/Component';
import { NViewport } from '../../app/events/Viewport';
import { RequiredModuleProp } from '../../utils/types/utility';



export namespace NCtx2D {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
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
        /**
         * Update sizes on resize
         * @default false
         */
        updateOnResize?: boolean | keyof NViewport.CallbacksTypes;
        /**
         * @default 0
         */
        resizeTimeout?: number;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp {
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
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'resize': false;
    }

}



/**
 * Makes working with canvas easier.
 * It creates an HTML5 Canvas element and its 2d context and can
 * implement automatic resize.
 */
export class Ctx2D <
    StaticProp extends NCtx2D.StaticProp = NCtx2D.StaticProp,
    ChangeableProp extends NCtx2D.ChangeableProp = NCtx2D.ChangeableProp,
    CallbacksTypes extends NCtx2D.CallbacksTypes = NCtx2D.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
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
     * Canvas width without DPR
     */
    get nonDPRWidth () {
        return this.width / this.dpr;
    }

    /**
     * The height of the canvas
     */
    protected _height: number;
    get height () {
        return this._height;
    }
    /**
     * Canvas height without DPR
     */
    get nonDPRHeight () {
        return this.height / this.dpr;
    }

    /**
     * Device pixel ratio
     */
    protected _dpr: number;
    get dpr () {
        return this._dpr;
    }



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // set default values
        this._width = 0;
        this._height = 0;
        this._dpr = 1;

        // create canvas
        const { append, container } = this.prop;
        const parent = (append && container) ? container as Element : undefined;
        this._canvas = createElement('canvas', {
            parent,
        });
        this._ctx = this._canvas.getContext('2d')!;
        // and resize it for the first time
        this.resize();

        // initialize the class
        if (init) {
            this.init();
        }
    }

    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            container: false,
            append: true,
            updateOnResize: false,
            resizeTimeout: 0,
            width: false,
            height: false,
            dpr: false,
        };
    }

    // Set Module Events
    protected _setEvents () {
        super._setEvents();
        if (this.prop.updateOnResize !== false) {
            const viewportTarget: keyof NViewport.CallbacksTypes = typeof this.prop.updateOnResize === 'boolean' ? '' : this.prop.updateOnResize;
            this.addViewportCallback(viewportTarget, () => {
                this.resize();
            }, {
                timeout: this.prop.resizeTimeout,
            });
            this.resize();
        }
    }

    protected _onPropMutate () {
        super._onPropMutate();
        this.resize();
    }



    /**
     * Resize the canvas
     */
    public resize () {
        // vars
        const { prop, canvas } = this;
        if (!canvas) {
            return;
        }
        const app = this._app;
        const { viewport } = app;

        // calculate dpr
        if (typeof prop.dpr === 'number') {
            this._dpr = prop.dpr;
        } else {
            this._dpr = viewport.dpr;
        }
        const dpr = this._dpr;

        // calculate new width & height
        let newWidth = 0;
        let newHeight = 0;
        if (typeof prop.width === 'number' && typeof prop.height === 'number') {
            newWidth = prop.width;
            newHeight = prop.height;
        } else if (this.container) {
            newWidth = this.container.clientWidth;
            newHeight = this.container.clientHeight;
        } else {
            newWidth = viewport.width;
            newHeight = viewport.height;
        }
        newWidth *= dpr;
        newHeight *= dpr;

        // update sizes
        this._width = newWidth;
        this._height = newHeight;

        // apply sizes
        canvas.width = newWidth;
        canvas.height = newHeight;

        this.callbacks.tbt('resize', false);
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();

        if (this.canvas) {
            this.canvas.remove();
        }
    }
}
