import { createElement, selectOne } from 'vevet-dom';
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
        container?: Window | SmoothScroll | Element | string;
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
        /**
         * @default 0
         */
        resizeTimeout?: number;
        /**
         * If the scroll bar is draggable
         * @default true
         */
        isDraggable?: boolean;
        /**
         * What scroll behavior should be used when dragging the ScrollBar thumb.
         * Only for SmoothScroll
         * @default 'smooth'
         */
        draggableScrollBehavior?: 'smooth' | 'auto';
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
            resizeTimeout: 0,
            isDraggable: true,
            draggableScrollBehavior: 'smooth',
        };
    }

    get prefix () {
        return `${this._app.prefix}scrollbar`;
    }

    /**
     * Scroll container
     */
    get container () {
        return this._container;
    }
    protected _container: Element | Window | SmoothScroll;

    /**
     * Get scrollable element
     */
    get scrollableElement () {
        const { container } = this;
        if (container instanceof Window) {
            return this._app.body;
        }
        if (container instanceof Element) {
            return container;
        }
        return container.outer;
    }

    /**
     * The element into wchich scroll bars will be appended
     */
    get domParent () {
        const { domParent } = this.prop;
        const { container } = this;
        if (!domParent) {
            if (this._scrollWrapper) {
                return this._scrollWrapper;
            }
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

    /**
     * The scroll wrapper.
     * Used for wrapper scroll
     */
    protected _scrollWrapper?: HTMLElement;

    // scrollbars
    protected _xBar: Bar;
    protected _yBar: Bar;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);
        const {
            autoHide, autoSize, minSize,
            optimizeCalculations, isDraggable, draggableScrollBehavior,
        } = this.prop;

        // get container
        if (typeof this.prop.container === 'string') {
            const el = selectOne(this.prop.container);
            if (el) {
                this._container = el;
            } else {
                throw new Error('No scroll container');
            }
        } else {
            this._container = this.prop.container;
        }

        // create scrollBarsParent if needed
        if (this.container instanceof Element) {
            const { parentElement } = this.container;
            if (parentElement) {
                this._scrollWrapper = createElement('div');
                this._scrollWrapper.style.position = 'relative';
                this._scrollWrapper.style.display = 'inline-block';
                parentElement.insertBefore(this._scrollWrapper, this.container);
                this._scrollWrapper.appendChild(this.container);
                this._scrollWrapper.classList.add(`${this.prefix}-wrapper`);
            }
        }

        // create bars
        const barMainProp = {
            container: this.container,
            domParent: this.domParent,
            autoHide,
            autoSize,
            minSize,
            optimizeCalculations,
            prefix: this.prefix,
            isDraggable,
            draggableScrollBehavior,
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
        this.scrollableElement.classList.add(`${this.prefix}-parent`);

        // initialize the class
        if (init) {
            this.init();
        }
    }

    // Set Module Events
    protected _setEvents () {
        super._setEvents();
        const { container } = this;

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
            }, {
                timeout: this.prop.resizeTimeout,
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

        // destroy bars
        this._xBar.destroy();
        this._yBar.destroy();

        // remove scrollbars parent
        if (!!this._scrollWrapper && this.container instanceof Element) {
            const { parentElement } = this._scrollWrapper;
            if (parentElement) {
                parentElement.insertBefore(this.container, this._scrollWrapper);
            }
            this._scrollWrapper.remove();
        }

        // reset styles
        this.scrollableElement.classList.remove(`${this.prefix}-parent`);
    }
}
