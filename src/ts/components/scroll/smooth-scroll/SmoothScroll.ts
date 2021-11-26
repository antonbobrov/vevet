import {
    selectAll, selectOne, isElement, createElement,
} from 'vevet-dom';
import normalizeWheel from 'normalize-wheel';
import { Component, NComponent } from '../../../base/Component';
import { RequiredModuleProp } from '../../../utils/types/utility';
import { AnimationFrame } from '../../animation-frame/AnimationFrame';
import { ScrollableElement } from '../types';
import boundVal from '../../../utils/math/boundVal';
import { NCallbacks } from '../../../base/Callbacks';
import { lerp } from '../../../utils/math';



export namespace NSmoothScroll {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * Scroll elements
         */
        selectors?: {
            /**
             * Scrollable wrapper.
             * You may pass either a CSS selector to find the element or the element itself.
             * @default '#v-smooth-scroll'
             */
            outer?: string | HTMLElement;
            /**
             * Scrollable elements inside the wrapper.
             * You may pass either a CSS selector to find the elements or the elements themselves.
             * @default '#v-smooth-scroll'
             */
            elements?: false | string | NodeListOf<HTMLElement> | HTMLElement | HTMLElement[];
        };
        /**
         * Animation frame.
         * Pass an AnimationFrame instance if you want to control the scrolling outside this class.
         * @default false
         */
        animationFrame?: false | AnimationFrame;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp {
        /**
         * If scrolling is enabled
         * @default true
         */
        enabled?: boolean;
        /**
         * Recalculate sizes on each scroll update
         * @default true
         */
        recalculateSizes?: boolean;
        /**
         * Use wheel event
         * @default true
         */
        useWheel?: boolean;
        /**
         * If scrolling is horizontal
         * @default false
         */
        isHorizontal?: boolean;
        /**
         * Automatically stop scrolling after the target and current values are approximated.
         * @default true
         */
        autoStop?: boolean;
        /**
         * Stop propagation when scrolling the block
         * @default true
         */
        stopPropagation?: boolean;
        /**
         * If need to add will-change to scrollable elements
         * @default true
         */
        useWillChange?: boolean;
        /**
         * Animation options
         */
        render?: {
            /**
             * Linear interpolation ease
             * @default 0.1
             */
            lerp?: number;
            /**
             * Sometimes scrolling may be choppy because of large decimal values in transforms.
             * In such cases you may want to use this property.
             * It works on the basis of "toFixed()" method. Only integers
             * @default 2
             */
            lerpToFixed?: false | number;
            /**
             * @default 0.1
             */
            approximation?: 0.1;
            /**
             * On different screens with different FPS, scrolling may be faster or slower.
             * This property is to normalize scrolling speed across different FPS.
             * @default false
             */
            normalizeLerp?: boolean;
        }
        /**
         * Overscroll options
         */
        overscroll?: false | {
            /**
             * Maximum overscroll
             * @default 250
             */
            max?: number;
            /**
             * Maximum overscroll
             * @default .5
             */
            friction?: number;
        }
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'scroll': false;
        'resize': false;
        'approximate': false;
        'wheel': WheelEvent;
    }

}

export interface ScrollInnerElement extends HTMLElement {
    smoothScrollTop: number;
    smoothScrollLeft: number;
    smoothScrollLerpEase: number;
}



/**
 * Create smooth scrolling.
 */
export class SmoothScroll <
    StaticProp extends NSmoothScroll.StaticProp = NSmoothScroll.StaticProp,
    ChangeableProp extends NSmoothScroll.ChangeableProp = NSmoothScroll.ChangeableProp,
    CallbacksTypes extends NSmoothScroll.CallbacksTypes = NSmoothScroll.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> implements ScrollableElement {
    get prefix () {
        return `${this._app.prefix}smooth-scroll`;
    }

    /**
     * Scroll parent
     */
    protected _outer: HTMLElement;
    get outer () {
        return this._outer;
    }

    /**
     * Scroll container. If the element does not exist indide the outer,
     * it will be created automatically
     */
    protected _container: HTMLElement;
    get container () {
        return this._container;
    }
    /**
     * If the container element existed before the class initialization
     */
    protected _containerExists: boolean;

    /**
     * Scrollable elements
     */
    protected _elements: ScrollInnerElement[];
    get elements () {
        return this._elements;
    }
    protected _elementsLength: number;

    /**
     * Scroll target value
     */
    protected _targetLeft: number;
    get targetLeft () {
        return this._targetLeft;
    }
    set targetLeft (
        val: number,
    ) {
        this.targetLeftBound = val;
        this._enable();
    }
    /**
     * Set value without animation request
     */
    protected set targetLeftBound (
        val: number,
    ) {
        const min = !!this.prop.overscroll && this.prop.isHorizontal
            ? -this.prop.overscroll.max : 0;
        const max = this.maxScrollableWidth
            + (!!this.prop.overscroll && this.prop.isHorizontal ? this.prop.overscroll.max : 0);
        this._targetLeft = boundVal(
            val,
            [min, max],
        );
    }
    protected get targetLeftBound () {
        return this._targetLeft;
    }

    /**
     * Scroll target value
     */
    protected _targetTop: number;
    get targetTop () {
        return this._targetTop;
    }
    set targetTop (
        val: number,
    ) {
        this.targetTopBound = val;
        this._enable();
    }
    /**
     * Set value without animation request
     */
    protected set targetTopBound (
        val: number,
    ) {
        const min = !!this.prop.overscroll && !this.prop.isHorizontal
            ? -this.prop.overscroll.max : 0;
        const max = this.maxScrollableHeight
            + (!!this.prop.overscroll && !this.prop.isHorizontal ? this.prop.overscroll.max : 0);
        this._targetTop = boundVal(
            val,
            [min, max],
        );
    }
    protected get targetTopBound () {
        return this._targetTop;
    }

    /**
     * Scroll left
     */
    protected _scrollLeft: number;
    get scrollLeft () {
        return this._scrollLeft;
    }
    set scrollLeft (
        val: number,
    ) {
        this.targetLeftBound = val;
        this._scrollLeft = this._targetLeft;
        this._enable();
    }
    /**
     * Scroll top
     */
    protected _scrollTop: number;
    get scrollTop () {
        return this._scrollTop;
    }
    set scrollTop (
        val: number,
    ) {
        this.targetTopBound = val;
        this._scrollTop = this._targetTop;
        this._enable();
    }

    /**
     * Scroll width
     */
    protected _scrollWidth: number;
    get scrollWidth () {
        return this._scrollWidth;
    }
    /**
     * Scroll height
     */
    protected _scrollHeight: number;
    get scrollHeight () {
        return this._scrollHeight;
    }

    /**
     * Parent width
     */
    protected _clientWidth: number;
    get clientWidth () {
        return this._clientWidth;
    }
    /**
     * Parent height
     */
    protected _clientHeight: number;
    get clientHeight () {
        return this._clientHeight;
    }

    /**
     * Maximum scrollable area of the X axis
     */
    get maxScrollableWidth () {
        return this.scrollWidth - this.clientWidth;
    }
    /**
     * Maximum scrollable area of the Y axis
     */
    get maxScrollableHeight () {
        return this.scrollHeight - this.clientHeight;
    }

    /**
     * If the approximation between the target and current scroll values must be instantaneous
     */
    protected _instant: boolean;

    /**
     * Inner AnimationFrame.
     * The AnimationFrame is not create if an outer AnimationFrame is passed in properties.
     */
    protected _animationFrame?: AnimationFrame;
    /**
     * AnimationFrame callback is used for outer AnimationFrame only.
     */
    protected _outerAnimationFrameEvent?: NCallbacks.AddedCallback;
    /**
     * Current FPS. Used to normalize LERP ease
     */
    protected _currentFPS: number;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);
        const { selectors } = this.prop;

        // set default variables
        this._targetLeft = 0;
        this._targetTop = 0;
        this._scrollLeft = 0;
        this._scrollTop = 0;
        this._scrollWidth = 0;
        this._scrollHeight = 0;
        this._clientWidth = 0;
        this._clientHeight = 0;
        this._instant = false;
        this._animationFrame = undefined;
        this._outerAnimationFrameEvent = undefined;
        this._currentFPS = 60;

        // get outer elements
        this._outer = selectOne(selectors.outer) as HTMLElement;
        if (!(this._outer instanceof HTMLElement)) {
            throw new Error(`${selectors.outer} is not a HTMLElement`);
        }
        this._outer.classList.add(this.prefix);

        // get or create container
        const existingContainer = selectOne(`.${this.prefix}__container`, this.outer) as HTMLElement;
        if (isElement(existingContainer)) {
            this._container = existingContainer;
            this._containerExists = true;
        } else {
            this._container = createElement('div', {
                class: `${this.prefix}__container`,
                parent: this.outer,
                children: Array.from(this.outer.children),
            });
            this._containerExists = false;
        }

        // get scrollable elements
        if (selectors.elements) {
            this._elements = Array.from(
                selectAll(selectors.elements, this._outer) as NodeListOf<ScrollInnerElement>,
            );
        } else {
            this._elements = [this._container as ScrollInnerElement];
        }
        this._elementsLength = this._elements.length;
        // add will-change
        if (this.prop.useWillChange) {
            this._elements.forEach((el) => {
                el.style.willChange = 'transform';
            });
        }

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
            selectors: {
                outer: `#${this.prefix}`,
                elements: false,
            },
            enabled: true,
            animationFrame: false,
            recalculateSizes: true,
            useWheel: true,
            autoStop: true,
            isHorizontal: false,
            stopPropagation: true,
            useWillChange: true,
            render: {
                lerp: 0.1,
                lerpToFixed: 2,
                approximation: 0.1,
                normalizeLerp: false,
            },
            overscroll: {
                friction: 0.5,
                max: 250,
            },
        };
    }

    // Extra constructor
    protected _constructor () {
        super._constructor();
        this._toggle();
    }

    // Set Events
    protected _setEvents () {
        // update sizes
        this.resize();
        this.addViewportCallback('', () => {
            this.resize(true);
        });

        // wheel
        this.addEventListeners(this.outer, 'wheel', (e) => {
            this._handleWheel(e);
        });

        // on scroll
        this.addEventListeners(this.outer, 'scroll', () => {
            this.outer.scrollTop = 0;
            this.outer.scrollLeft = 0;
        });
    }

    protected _onPropMutate () {
        super._onPropMutate();
        this.resize();
        this._toggle();
    }



    /**
     * Recalculate scroll sizes
     */
    public resize (
        /**
         * If the method was called natively on window resize
         */
        native = false,
    ) {
        // get elements
        const { container, outer } = this;

        // get sizes
        this._clientWidth = outer.clientWidth;
        this._clientHeight = outer.clientHeight;
        this._scrollWidth = boundVal(container.clientWidth, [this.clientWidth, Infinity]);
        this._scrollHeight = boundVal(container.clientHeight, [this.clientHeight, Infinity]);

        // force instant change
        // it means that after resizing, scrolling will be instantaneous for a while
        if (native) {
            this._instant = true;
        }

        // sometimes after resizing it may happen that targets are less or more
        // than maximum values of scrolling
        // that's why fix it here
        if (native) {
            this.targetLeft = parseInt(this.targetLeft.toFixed(0), 10);
            this.targetTop = parseInt(this.targetTop.toFixed(0), 10);
        }

        // set scroll classes
        const hasScroll = this.maxScrollableHeight > 0 || this.maxScrollableWidth > 0;
        outer.classList.toggle('has-scroll', hasScroll);
        outer.classList.toggle('no-scroll', !hasScroll);

        // render elements
        this._updateElementsProp();
        // this.render();

        // launch callbacks
        this.callbacks.tbt('resize', false);
    }

    /**
     * Recalculate scroll sizes
     */
    protected _recalculateSizes () {
        const { container } = this;
        const height = container.clientHeight;
        const width = container.clientWidth;
        if ((height !== this.scrollHeight) || (width !== this.scrollWidth)) {
            this.resize();
        }
    }

    /**
     * Update elements' properties
     */
    protected _updateElementsProp () {
        for (let index = 0; index < this._elementsLength; index += 1) {
            const el = this._elements[index];
            // update scroll values
            el.smoothScrollLeft = this.scrollLeft;
            el.smoothScrollTop = this.scrollTop;
            // update easing
            const easingAttr = el.getAttribute(`${this.prefix}-ease`);
            if (easingAttr) {
                try {
                    el.smoothScrollLerpEase = parseFloat(easingAttr);
                } catch (e) {
                    //
                }
            }
        }
    }



    /**
     * Event on wheel
     */
    protected _handleWheel (
        evt: WheelEvent,
    ) {
        const { prop } = this;
        if (!prop.enabled || !prop.useWheel) {
            return;
        }

        // stop propagation if needed
        if (
            prop.stopPropagation
            || (
                !prop.stopPropagation
                && ((
                    this.scrollLeft > 0
                    && this.scrollLeft < this.maxScrollableWidth
                )
                || (
                    this.scrollTop > 0
                    && this.scrollTop < this.maxScrollableHeight
                ))
            )
        ) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            evt.preventDefault();
        }

        // get normalized delta
        const delta = normalizeWheel(evt);

        // set new scroll targets
        this.targetLeftBound += prop.isHorizontal ? delta.pixelY : delta.pixelX;
        this.targetTopBound += prop.isHorizontal ? delta.pixelX : delta.pixelY;

        // play scroll
        this._enable();

        // launch events
        this.callbacks.tbt('wheel', evt);
    }



    /**
     * Toggle animation: Enable / Disable scrolling
     */
    protected _toggle () {
        if (this.prop.enabled) {
            this._enable();
        } else {
            this._disable();
        }
    }

    /**
     * Enable scrolling
     */
    protected _enable () {
        if (!this.prop.enabled) {
            return;
        }
        // set animation callback for the outer AnimationFrame
        if (!!this.prop.animationFrame && !this._outerAnimationFrameEvent) {
            this._outerAnimationFrameEvent = this.prop.animationFrame.addCallback('frame', (data) => {
                this._currentFPS = data.realFPS;
                this.render();
            });
        } else {
            // otherwise, check if inner AnimationFrame is created
            if (!this._animationFrame) {
                this._animationFrame = new AnimationFrame();
                this._animationFrame.addCallback('frame', (data) => {
                    this._currentFPS = data.realFPS;
                    this.render();
                });
            }
            this._animationFrame.play();
        }
    }

    /**
     * Disable scrolling
     */
    protected _disable () {
        if (!!this._outerAnimationFrameEvent && !!this.prop.animationFrame) {
            this._outerAnimationFrameEvent.remove();
        }
        if (this._animationFrame) {
            this._animationFrame.pause();
        }
    }



    /**
     * Render elements
     */
    public render () {
        // vars
        const { prop } = this;

        // recalculate sizes
        if (prop.recalculateSizes) {
            this._recalculateSizes();
        }

        // calculate scroll values
        this._calcScroll();
        // change elements' values
        this._calcElements();
        // render
        this._renderElements();

        // disable instant scrolling
        if (this._instant) {
            this._instant = false;
        }

        // launch events
        this.callbacks.tbt('scroll', false);

        // stop animation frame if values are approximated
        const yDiff = Math.abs(this.targetTop - this.scrollTop);
        const xDiff = Math.abs(this.targetLeft - this.scrollLeft);
        if (xDiff === 0 && yDiff === 0 && prop.autoStop) {
            this._disable();
            this.callbacks.tbt('approximate', false);
        }
    }

    /**
     * Calculate scroll value
     */
    protected _calcScroll () {
        const { overscroll } = this.prop;
        // use overscroll
        if (overscroll) {
            // left
            if (this.targetLeft < 0) {
                this.targetLeftBound = this._lerp(this.targetLeftBound, 0, overscroll.friction);
            } else if (this.targetLeft > this.maxScrollableWidth) {
                this.targetLeftBound = this._lerp(
                    this.targetLeftBound, this.maxScrollableWidth, overscroll.friction,
                );
            }
            // top
            if (this.targetTop < 0) {
                this.targetTopBound = this._lerp(this.targetTopBound, 0, overscroll.friction);
            } else if (this.targetTop > this.maxScrollableHeight) {
                this.targetTopBound = this._lerp(
                    this.targetTopBound, this.maxScrollableHeight, overscroll.friction,
                );
            }
        }
        // update values
        this._scrollLeft = this._lerp(this.scrollLeft, this.targetLeft);
        this._scrollTop = this._lerp(this.scrollTop, this.targetTop);
    }

    /**
     * Calculate elements' values.
     */
    protected _calcElements () {
        const globalEase = this._getLerpEase();
        for (let index = 0; index < this._elementsLength; index += 1) {
            const el = this._elements[index];
            // get element ease
            const elEase = this._getLerpEase(el);
            // change values
            if (elEase === globalEase) {
                el.smoothScrollLeft = this._scrollLeft;
                el.smoothScrollTop = this._scrollTop;
            } else {
                el.smoothScrollLeft = this._lerp(el.smoothScrollLeft, this._targetLeft, elEase);
                el.smoothScrollTop = this._lerp(el.smoothScrollTop, this._targetTop, elEase);
            }
        }
    }

    /**
     * Interpolate values
     */
    protected _lerp (
        current: number,
        target: number,
        ease = this._getLerpEase(),
    ) {
        const { lerpToFixed, approximation } = this.prop.render;
        const currentEase = this._instant ? 1 : ease;
        const val = lerp(current, target, currentEase, approximation);
        // round the values
        if (typeof lerpToFixed === 'number') {
            const fixed = Math.round(Math.abs(lerpToFixed));
            return parseFloat(val.toFixed(fixed));
        }
        return val;
    }

    /**
     * Get element ease
     */
    protected _getLerpEase (
        el: ScrollInnerElement | false = false,
    ) {
        const { lerp: lerpEase, normalizeLerp } = this.prop.render;
        const fpsMultiplier = normalizeLerp ? 60 / this._currentFPS : 1;
        if (el) {
            return el.smoothScrollLerpEase || lerpEase * fpsMultiplier;
        }
        return lerpEase * fpsMultiplier;
    }

    /**
     * Render elements
     */
    protected _renderElements () {
        for (let index = 0; index < this._elementsLength; index += 1) {
            const el = this._elements[index];
            // coords
            const x = -el.smoothScrollLeft;
            const y = -el.smoothScrollTop;
            // set styles
            el.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0, ${x}, ${y}, 0,1)`;
        }
    }



    // LIKE NATIVE SCROLL


    /**
     * Scroll to
     */
    public scrollTo () {
        // eslint-disable-next-line prefer-rest-params
        const arg = arguments;

        // if object
        if (arg.length === 1 && typeof arg[0] === 'object') {
            const options = arg[0] as ScrollToOptions;
            const { top, left, behavior } = options;

            if (typeof left !== 'undefined') {
                if (behavior === 'smooth') {
                    this.targetLeftBound = left;
                } else {
                    this.scrollLeft = left;
                }
            }
            if (typeof top !== 'undefined') {
                if (behavior === 'smooth') {
                    this.targetTopBound = top;
                } else {
                    this.scrollTop = top;
                }
            }
            if (behavior === 'smooth') {
                this._enable();
            }
        }

        // if numbers
        if (typeof arg[0] === 'number' || typeof arg[1] === 'number') {
            if (typeof arg[0] === 'number') {
                // eslint-disable-next-line prefer-destructuring
                this.scrollLeft = arg[0];
            }
            if (typeof arg[1] === 'number') {
                // eslint-disable-next-line prefer-destructuring
                this.scrollTop = arg[1];
            }
        }
    }



    /**
     * Destroy the scroll
     */
    protected _destroy () {
        super._destroy();

        // disable animation
        this._disable();
        if (this._animationFrame) {
            this._animationFrame.destroy();
        }

        // destroy container
        if (!this._containerExists) {
            while (this._container.firstChild) {
                this._outer.appendChild(this._container.firstChild);
            }
            this._container.remove();
        }

        // remove classes
        this._outer.classList.remove(this.prefix);

        // reset styles
        this._elements.forEach((el) => {
            el.style.transform = '';
            el.style.willChange = '';
        });
    }
}
