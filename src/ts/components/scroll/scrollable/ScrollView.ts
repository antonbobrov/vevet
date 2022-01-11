import { ScrollEventsBase, NScrollEventsBase } from './ScrollEventsBase';
import { IRemovable } from '../../../utils/types/general';
import { RequiredModuleProp } from '../../../utils/types/utility';
import onScroll from '../../../utils/listeners/onScroll';
import { intersectionObserverSupported } from '../../../utils/listeners';
import clamp from '../../../utils/math/clamp';
import timeoutCallback from '../../../utils/common/timeoutCallback';



export namespace NScrollView {

    /**
     * Static properties
     */
    export interface StaticProp extends NScrollEventsBase.StaticProp {
        /**
         * If enabled, scrolling events will be created.
         * You can use "false" to create just an instance of the ScrollView
         * and later enable animations.
         * @default true
         */
        enabled?: boolean;
        /**
         * View elements.
         * @default []
         */
        elements?: Element[];
        /**
         * The moment at which the element is considered to be in the viewport.
         * The value is calculated from top to bottom or from left to right.
         * @default 0.95
         */
        threshold?: number;
        /**
         * Define what states to trace.
         * @default 'in'
         */
        states?: 'in' | 'inout';
        /**
         * A class to be toggled on state change
         * @default 'viewed'
         */
        classToToggle?: string;
        /**
         * If need to use delays on firstStart
         * @default false
         */
        useDelay?: false | {
            max: number;
            dir: 'x' | 'y';
        };
        /**
         * Use IntersectionObserver is supported
         * @default true
         */
        useIntersectionObserver?: boolean;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NScrollEventsBase.ChangeableProp { }

    /**
     * View element
     */
    export interface El extends Element {
        scrollViewIn?: boolean;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NScrollEventsBase.CallbacksTypes {
        'in': El;
        'out': El;
    }

}



/**
 * Elements into viewport
 */
export class ScrollView <
    StaticProp extends NScrollView.StaticProp = NScrollView.StaticProp,
    ChangeableProp extends NScrollView.ChangeableProp = NScrollView.ChangeableProp,
    CallbacksTypes extends NScrollView.CallbacksTypes = NScrollView.CallbacksTypes,
> extends ScrollEventsBase <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    get prefix () {
        return `${this._app.prefix}scroll-view`;
    }

    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            enabled: true,
            container: window,
            elements: [],
            threshold: 0.9,
            states: 'in',
            classToToggle: 'viewed',
            useDelay: false,
            useIntersectionObserver: true,
        };
    }



    /**
     * Scroll event
     */
    protected _scrollEvent?: IRemovable;
    /**
     * Intersection observer - type IN
     */
    protected _intersectionObserverIn?: IntersectionObserver;
    /**
     * Intersection observer - type OUT
     */
    protected _intersectionObserverOut?: IntersectionObserver;

    /**
     * If first start
     */
    protected _firstStart: boolean;

    protected _elements: NScrollView.El[];
    /**
     * Elements to seek
     */
    get elements () {
        return this._elements;
    }



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        this._scrollEvent = undefined;
        this._intersectionObserverIn = undefined;
        this._intersectionObserverOut = undefined;
        this._firstStart = true;
        this._elements = [...this.prop.elements];

        // initialize the class
        if (init) {
            this.init();
        }
    }

    public init () {
        super.init();
    }

    // Set Module Events
    protected _setEvents () {
        super._setEvents();
        this.resize();
        this.addViewportCallback('', () => {
            this.resize();
        });
    }

    protected _onPropMutate () {
        super._onPropMutate();
        this.resize();
    }

    /**
     * Resize the scene
     */
    public resize () {
        this._removeViewEvents();
        if (this.prop.enabled) {
            this._setViewEvents();
            this.seekBounding();
        }
    }

    /**
     * Set View events: scroll or intersection
     */
    protected _setViewEvents () {
        // set intersection observer
        if (intersectionObserverSupported() && this.prop.useIntersectionObserver) {
            // get intersecton margins
            const { scrollContainerBounding } = this;
            const xMargin = this._firstStart
                ? 0 : scrollContainerBounding.width * (1 - this.prop.threshold) * -1;
            const yMargin = this._firstStart
                ? 0 : scrollContainerBounding.height * (1 - this.prop.threshold) * -1;
            // create intersection observers
            this._intersectionObserverIn = new IntersectionObserver(
                this._handleIntersectionObserverIn.bind(this),
                {
                    root: this.intersectionRoot,
                    threshold: 0,
                    rootMargin: `0px ${xMargin}px ${yMargin}px 0px`,
                },
            );
            this.elements.forEach((el) => {
                this._intersectionObserverIn?.observe(el);
            });
            if (this.prop.states === 'inout') {
                this._intersectionObserverOut = new IntersectionObserver(
                    this._handleIntersectionObserverOut.bind(this),
                    {
                        root: this.intersectionRoot,
                        threshold: 0,
                        rootMargin: '0px 0px 0px 0px',
                    },
                );
                this.elements.forEach((el) => {
                    this._intersectionObserverOut?.observe(el);
                });
            }
        } else {
            // set scroll bounding events
            this._scrollEvent = onScroll({
                container: this.prop.container,
                callback: this._handleScroll.bind(this),
            });
        }
    }

    /**
     * Remove View events: scroll or intersection
     */
    protected _removeViewEvents () {
        // remove scroll events
        if (this._scrollEvent) {
            this._scrollEvent.remove();
            this._scrollEvent = undefined;
        }
        // destroy intersection observers
        this._intersectionObserverIn?.disconnect();
        this._intersectionObserverIn = undefined;
        this._intersectionObserverOut?.disconnect();
        this._intersectionObserverOut = undefined;
    }

    /**
     * Event on IntersectionObserver
     */
    protected _handleIntersectionObserverIn (
        data: IntersectionObserverEntry[],
    ) {
        const parentBounding = this._firstStart ? this.scrollContainerBounding : false;
        for (let index = 0; index < data.length; index += 1) {
            const entry = data[index];
            let delay = 0;
            if (this._firstStart && !!parentBounding && entry.isIntersecting) {
                delay = this._elementInViewportData(entry.target, parentBounding).delay;
            }
            if (entry.isIntersecting) {
                this._handleInOut(
                    entry.target,
                    entry.isIntersecting,
                    delay,
                );
            }
        }
        this._processUnusedElements();
        // change states
        if (this._firstStart) {
            this._firstStart = false;
            this.resize();
        }
    }

    /**
     * Event on IntersectionObserver
     */
    protected _handleIntersectionObserverOut (
        data: IntersectionObserverEntry[],
    ) {
        for (let index = 0; index < data.length; index += 1) {
            const entry = data[index];
            if (!entry.isIntersecting) {
                this._handleInOut(
                    entry.target,
                    entry.isIntersecting,
                    0,
                );
            }
        }
    }

    /**
     * Event on Scroll
     */
    protected _handleScroll () {
        this.seekBounding();
    }

    /**
     * Seek the elements by their bounding.
     * Only if IntersectionObserver is not used.
     */
    public seekBounding () {
        // check if calculations are done through getBoundingClientRect
        if (intersectionObserverSupported() && this.prop.useIntersectionObserver) {
            return;
        }

        // vars
        const { scrollContainerBounding } = this;

        // go through all elements and get their boudning
        for (let index = 0; index < this.elements.length; index += 1) {
            const el = this.elements[index];
            const elData = this._elementInViewportData(el, scrollContainerBounding);
            const delay = elData.isIntersecting ? elData.delay : 0;
            if (typeof elData.isIntersecting === 'boolean') {
                this._handleInOut(el, elData.isIntersecting, delay);
            }
        }
        this._processUnusedElements();

        // change states
        if (this._firstStart) {
            this._firstStart = false;
        }
    }

    /**
     * Check element's bounding to define if it is in viewport
     */
    protected _elementInViewportData (
        el: Element,
        parentBounding: NScrollEventsBase.BoundingRect,
    ) {
        const { threshold: propThreshold, states, useDelay } = this.prop;
        const threshold = this._firstStart ? 1 : propThreshold;
        const bounding = el.getBoundingClientRect();

        // check if the element is intersecting
        let isIntersecting: undefined | boolean;
        if (
            bounding.top < parentBounding.top + parentBounding.height * threshold
            && bounding.left < parentBounding.left + parentBounding.width * threshold
        ) {
            if (states === 'in') {
                isIntersecting = true;
            } else if (
                bounding.right < parentBounding.left * threshold
                    || bounding.bottom < parentBounding.top * threshold
            ) {
                isIntersecting = false;
            } else {
                isIntersecting = true;
            }
        } else if (
            bounding.top > parentBounding.top + parentBounding.height
            || bounding.left > parentBounding.left + parentBounding.width
        ) {
            isIntersecting = false;
        }

        // calculate delay only if it is enabled & calculations
        // are done for the first time
        let delay = 0;
        if (!!useDelay && this._firstStart) {
            const progress = clamp(
                useDelay.dir === 'x'
                    ? (bounding.left - parentBounding.left) / parentBounding.width
                    : (bounding.top - parentBounding.top) / parentBounding.height,
                [0, 1],
            );
            delay = progress * useDelay.max;
        }

        return {
            isIntersecting,
            delay,
        };
    }

    /**
     * Event that is triggered when an element appears or disappears
     */
    protected _handleInOut (
        el: NScrollView.El,
        inViewport: boolean,
        delay = 0,
    ) {
        const { states } = this.prop;
        // check if need to continue
        if (
            (el.scrollViewIn && inViewport)
            || (!el.scrollViewIn && !inViewport)
        ) {
            return;
        }
        // update props
        el.scrollViewIn = inViewport;

        // toggle classes
        if (this.prop.classToToggle) {
            timeoutCallback(() => {
                el.classList.toggle(this.prop.classToToggle, inViewport);
            }, delay);
        }

        // process callbacks
        if (inViewport && (states === 'in' || states === 'inout')) {
            timeoutCallback(() => {
                this.callbacks.tbt('in', el);
            }, delay);
        } else if (!inViewport && states === 'inout') {
            timeoutCallback(() => {
                this.callbacks.tbt('out', el);
            }, delay);
        }
    }

    /**
     * Remove elements that are mo more in need
     */
    protected _processUnusedElements () {
        if (this.prop.states !== 'in') {
            return;
        }
        // remove unused elements
        const elementsToRemove = this._elements.filter((el) => el.scrollViewIn);
        elementsToRemove.forEach((el) => {
            this._intersectionObserverIn?.unobserve(el);
            this._intersectionObserverOut?.unobserve(el);
        });
        this._elements = this._elements.filter((el) => !el.scrollViewIn);
    }


    /**
     * Add a view element
     */
    public addElement (
        element: Element,
    ): IRemovable {
        const viewEl = element as NScrollView.El;
        viewEl.scrollViewIn = undefined;
        this._elements.push(element);
        this._intersectionObserverIn?.observe(element);
        this._intersectionObserverOut?.observe(element);
        if (this.prop.enabled) {
            this.seekBounding();
        }
        return {
            remove: () => {
                this.removeElement(element);
            },
        };
    }

    /**
     * Remove a view element
     */
    public removeElement (
        element: Element,
    ) {
        const viewEl = element as NScrollView.El;
        viewEl.scrollViewIn = undefined;
        this._elements = this._elements.filter((el) => el !== element);
        this._intersectionObserverIn?.unobserve(element);
        this._intersectionObserverOut?.unobserve(element);
    }

    /**
     * Remove all view elements
     */
    public removeElements () {
        this._elements.forEach((el) => {
            this.removeElement(el);
        });
        this._elements = [];
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();
        this._removeViewEvents();
    }
}
