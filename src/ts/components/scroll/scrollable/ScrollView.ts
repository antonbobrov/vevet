import { selectAll, SelectorAll } from 'vevet-dom';
import { ScrollEventsBase, NScrollEventsBase } from './ScrollEventsBase';
import { IRemovable } from '../../../utils/types/general';
import { RequiredModuleProp } from '../../../utils/types/utility';
import onScroll from '../../../utils/listeners/onScroll';
import { intersectionObserverSupported } from '../../../utils/listeners';
import boundVal from '../../../utils/math/boundVal';
import timeoutCallback from '../../../utils/common/timeoutCallback';



export namespace NScrollView {

    /**
     * Static properties
     */
    export interface StaticProp extends NScrollEventsBase.StaticProp {
        /**
         * Elements to seek
         * @default '.v-scroll-view__el'
         */
        elements?: SelectorAll;
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
            container: window,
            elements: `.${this.prefix}__el`,
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
     * Intersection observer
     */
    protected _intersectionObserver?: IntersectionObserver;

    /**
     * If first start
     */
    protected _firstStart: boolean;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        this._scrollEvent = undefined;
        this._intersectionObserver = undefined;
        this._firstStart = true;

        // get view elements
        this.updateElements();

        // initialize the class
        if (init) {
            this.init();
        }
    }

    public init () {
        super.init();
        this.seekBounding();
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
        this._removeViewEvents();
        this.updateElements();
        this._setViewEvents();
    }

    /**
     * Resize the scene
     */
    public resize () {
        this._removeViewEvents();
        this._setViewEvents();
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
            // create intersection observer
            this._intersectionObserver = new IntersectionObserver(
                this._handleIntersectionObserver.bind(this),
                {
                    root: this.intersectionRoot,
                    threshold: 0,
                    rootMargin: `0px ${xMargin}px ${yMargin}px 0px`,
                },
            );
            // add elements
            if (this.elements) {
                this.elements.forEach((el) => {
                    this._intersectionObserver?.observe(el);
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
        // destroy intersection observer
        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
            this._intersectionObserver = undefined;
        }
    }



    protected _elements!: NScrollView.El[];
    /**
     * Element to seek
     */
    get elements () {
        return this._elements;
    }

    /**
     * Update elements
     */
    public updateElements () {
        // check if elements exist
        if (typeof this.elements === 'undefined') {
            this._elements = [];
        }
        // unobserve old elements
        this.elements.forEach((el) => {
            if (this._intersectionObserver) {
                this._intersectionObserver.unobserve(el);
            }
        });
        // update elements
        this._elements = Array.from(
            selectAll(this.prop.elements as any, this.domParent || undefined),
        ).filter(
            (el) => !el.classList.contains(this.prop.classToToggle),
        );
        // add them to the observer
        this._elements.forEach((el) => {
            if (this._intersectionObserver) {
                this._intersectionObserver.observe(el);
            }
        });
    }



    /**
     * Event on IntersectionObserver
     */
    protected _handleIntersectionObserver (
        data: IntersectionObserverEntry[],
    ) {
        const parentBounding = this._firstStart ? this.scrollContainerBounding : false;
        for (let index = 0; index < data.length; index += 1) {
            const entry = data[index];
            let delay = 0;
            if (this._firstStart && !!parentBounding && entry.isIntersecting) {
                delay = this._elementInViewportData(entry.target, parentBounding).delay;
            }
            this._handleInOut(
                entry.target,
                entry.isIntersecting,
                delay,
            );
        }
        this._processUnusedElements();
        // change states
        if (this._firstStart) {
            this._firstStart = false;
            this.resize();
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
            this._handleInOut(el, elData.isIntersecting, delay);
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
        let isIntersecting = false;
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
        }

        // calculate delay only if it is enabled & calculations
        // are done for the first time
        let delay = 0;
        if (!!useDelay && this._firstStart) {
            const progress = boundVal(
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
        timeoutCallback(() => {
            el.classList.toggle(this.prop.classToToggle, inViewport);
        }, delay);

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
            if (this._intersectionObserver) {
                this._intersectionObserver.unobserve(el);
            }
        });
        this._elements = this._elements.filter((el) => !el.scrollViewIn);
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();
        this._removeViewEvents();
    }
}
