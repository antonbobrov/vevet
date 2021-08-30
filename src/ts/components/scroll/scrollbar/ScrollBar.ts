import { Component, NComponent } from '../../../base/Component';
import { RequiredModuleProp } from '../../../utils/types/utility';
import { SmoothScroll } from '../smooth-scroll/SmoothScroll';
import Bar from './Bar';



export namespace NScrollBar {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * The scrollable element
         * @default window
         */
        container?: Window | SmoothScroll | Element;
        /**
         * The element that will contain the scrollbar.
         * If false, the property 'container' will be taken into consideration.
         * @default false
         */
        domParent?: false | Element;
        /**
         * If the scrollbar must be interactive
         * @default true
         */
        draggable?: boolean;
        /**
         * Automatically define the size of the scrollbar thumb
         * @default true
         */
        autoSize?: boolean;
        /**
         * Automatically hide scrollbars
         * @default true
         */
        autoHide?: boolean;
        /**
         * Minimum size of the scrollbar thumb
         * @default 50
         */
        minSize?: number;
        /**
         * Optimize sizes calculation.
         * If true, the sizes are calculated only when calling the "resize" method.
         * Subsequently, if content changes, the scrollbar may be of false sizes.
         * @default false
         */
        optimizeCalculations?: boolean;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes { }

}



/**
 * Create custom scroll bar
 */
export class ScrollBar <
    StaticProp extends NScrollBar.StaticProp = NScrollBar.StaticProp,
    ChangeableProp extends NScrollBar.ChangeableProp = NScrollBar.ChangeableProp,
    CallbacksTypes extends NScrollBar.CallbacksTypes = NScrollBar.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    get prefix () {
        return `${this._app.prefix}scrollbar`;
    }

    get domParent () {
        const { container, domParent } = this.prop;
        if (!domParent) {
            if (container instanceof Window) {
                return this._app.body;
            }
            if (container instanceof Element) {
                return container;
            }
            return container.outer;
        }
        return domParent;
    }

    protected _xBar: Bar;
    protected _yBar: Bar;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);
        const { domParent } = this;
        const {
            autoHide, autoSize, minSize, optimizeCalculations,
        } = this.prop;

        // create bars
        const barMainProp = {
            container: this.prop.container as any,
            domParent,
            autoHide,
            autoSize,
            minSize,
            optimizeCalculations,
            prefix: this.prefix,
        };
        this._xBar = new Bar({
            dir: 'x',
            ...barMainProp,
        });
        this._yBar = new Bar({
            dir: 'y',
            ...barMainProp,
        });

        // add styles
        domParent.classList.add(`${this.prefix}-parent`);

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
            container: window,
            domParent: false,
            draggable: true,
            autoSize: true,
            autoHide: true,
            minSize: 50,
            optimizeCalculations: false,
        };
    }

    // Set Module Events
    protected _setEvents () {
        super._setEvents();
        const { container } = this.prop;

        // set resize event
        if (container instanceof SmoothScroll) {
            container.addCallback('resize', () => {
                this.resize();
            }, {
                name: this.name,
            });
        } else {
            this.addViewportCallback('', () => {
                this.resize();
            });
        }
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
        this._xBar.resize();
        this._yBar.resize();
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();

        // remove styles
        this.domParent.classList.remove(`${this.prefix}-parent`);
    }
}
