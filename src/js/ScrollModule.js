const dom = require('dom-create-element');
const selectEl = require('select-el');
const lerp = require('lerp');

import Module from './Module';
import merge from './merge';
import timeoutCallback from './timeoutCallback';
import normalizeWheel from './normalizeWheel';

/**
 * @classdesc A class for cretating custom smooth scrolling.
 * While setting up the class, you can choose what elements will imitate scrolling.
 * There can be several elements, that will imitate scrolling with or without delays (with different easings), 
 * or there can be one element, an outer element, that will be translated while scrolling.
 * The scroll itself works on the basis of {@linkcode requestAnimationFrame} and {@linkcode css-transforms}. <br>
 * Available targets:
 *  <ul>
 *      <li>update - when scroll values are updated, it is launched on each frame. Each callback receives {@linkcode Vevet.ScrollModule.Event} as an argument.</li>
 *      <li>size - when scroll sizes are updated. This happens either with each frame if {@linkcode resizeOnUpdate} is enabled or on window resize.</li>
 *      <li>wheel - event on wheen. Each callback receives {@linkcode WheelEvent} as an argument.</li>
 *      <li>approximate - when scroll targets and values are approximated.</li>
 *  </ul>
 * <br><br> <b>import {ScrollModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.ScrollModule : update : Vevet.ScrollModule.Event}
 * @vevetModuleCallback { Vevet.ScrollModule : size :  }
 * @vevetModuleCallback { Vevet.ScrollModule : wheel : WheelEvent }
 * @vevetModuleCallback { Vevet.ScrollModule : approximate :  }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class ScrollModule extends Module {


    
    /**
     * @memberof Vevet.ScrollModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {object} [selectors]
     * @property {string|HTMLElement} [selectors.outer=.vevet-scroll] - *** The scroll outer element.
     * @property {string|HTMLElement|NodeList|Array<HTMLElement>} [selectors.elements=.vevet-scroll__el] - Elements inside the outer element to be scrolled.
     * 
     * @property {boolean} [run=true] - If true, the scrolling will work.
     * @property {false|Vevet.FrameModule|Vevet.Module} [frame=false] - If false, the animation will work on the basis of {@linkcode requestAnimationFrame}.
     * If not a frame or another module, an event under the target "frame" willbe added to it, and in this very event
     * the scrolling values will be calculated.
     * @property {boolean} [resizeOnUpdate=true] - Sometimes content and its height may change.
     * If so, you need to launch {@linkcode Vevet.ScrollModule#setSize}.
     * But if resizeOnUpdate is true, this action is not needed, because everything will be updated automatically.
     * @property {number} [resizeTimeout=0] - A timeout before sizes are updated when the window is resized.
     * @property {boolean} [scroll=true] - Defines if the scroll will respond to the wheel event.
     * @property {boolean} [autoStop=true] - Stop the animation frame when the scroll and target values are maximally approximated.
     * @property {boolean} [horizontal=false]
     * 
     * @property {number} [ease=0.1] - The higher number, the faster animation.
     * By the way, each scrolling element may have the attribute "data-vevet-scroll-ease" which will set
     * a custom ease value for this very element.
     * 
     * @property {boolean} [propagation=false] - If false, 'stopPropagation' will work.
     * @property {boolean} [willChange=false] - Add will-change to the scrolling elements.
     * @property { boolean } [round=false] - Round the scroll value to an integer.
     * @property { boolean } [useTransform=true] - If false, "top" & "left" will be changed.
     */
    /**
     * @alias Vevet.ScrollModule
     * 
     * @param {Vevet.ScrollModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}scroll`;
    }

    /**
     * @readonly
     * @type {Vevet.ScrollModule.Properties}
     */
    get defaultProp() {

        let prefix = this._prefix;
        
        return merge(super.defaultProp, {
            selectors: {
                outer: `.${prefix}`,
                elements: `.${prefix}__el`
            },
            run: true,
            frame: false,
            resizeOnUpdate: true,
            resizeTimeout: 0,
            scroll: true,
            autoStop: true,
            horizontal: false,
            ease: .1,
            propagation: false,
            willChange: false,
            round: false,
            useTransform: true
        });

    }

    /**
     * @member Vevet.ScrollModule#prop
     * @memberof Vevet.ScrollModule
     * @readonly
     * @type {Vevet.ScrollModule.Properties}
     */

    /**
     * @member Vevet.ScrollModule#_prop
     * @memberof Vevet.ScrollModule
     * @protected
     * @type {Vevet.ScrollModule.Properties}
     */

    /**
     * @function Vevet.ScrollModule#changeProp
     * @memberof Vevet.ScrollModule
     * @param {Vevet.ScrollModule.Properties} [prop]
     */



    /**
     * @description Scroll outer.
     * @readonly
     * @type {HTMLElement}
     */
    get outer() {
        return this._outer;
    }
    /**
     * @description Elements to be scrolled.
     * @readonly
     * @type {Array<HTMLElement>|NodeList}
     */
    get elements() {
        return this._el;
    }
    /**
     * @description Get container sizes: scrollWidth & scrollHeight.
     * @readonly
     * @type {Array<number>}
     */
    get sizes() {
        return [this._width, this._height];
    }
    /**
     * @description Get scroll width.
     * @readonly
     * @type {number}
     */
    get scrollWidth() {
        return this._width;
    }
    /**
     * @description Get scroll height.
     * @readonly
     * @type {number}
     */
    get scrollHeight() {
        return this._height;
    }
    /**
     * @description Get outer sizes: clientWidth & clientHeight.
     * @readonly
     * @type {Array<number>}
     */
    get outerSizes() {
        return [this._widthOuter, this._heightOuter];
    }
    /**
     * @description Get outer width.
     * @readonly
     * @type {number}
     */
    get width() {
        return this._widthOuter;
    }
    /**
     * @description Get outer height.
     * @readonly
     * @type {number}
     */
    get height() {
        return this._heightOuter;
    }
    


    /**
     * @description ScrollTop value.
     * @type {number}
     */
    get scrollTop() {
        return this._scrollTop;
    }
    set scrollTop(value) {
        this._targetTop = value;
        this._boundaries(true);
        this._instant = true;
        this.play();
    }

    /**
     * @description ScrollLeft value.
     * @type {number}
     */
    get scrollLeft() {
        return this._scrollLeft;
    }
    set scrollLeft(value) {
        this._targetLeft = value;
        this._boundaries(false);
        this._instant = true;
        this.play();
    }

    /**
     * @description Set scroll values. X & Y
     * @type {Array<number>}
     */
    set scrollValues(coord) {
        this._targetLeft = coord[0];
        this._targetTop = coord[1];
        this._boundaries(false);
        this._boundaries();
        this._instant = true;
        this.play();
    }

    /**
     * @description Get/Change left scroll value goal.
     * @type {number}
     */
    get targetLeft() {
        return this._targetLeft;
    }
    set targetLeft(value) {
        this._targetLeft = value;
        this.play();
    }

    /**
     * @description Get/Change top scroll value goal.
     * @type {number}
     */
    get targetTop() {
        return this._targetTop;
    }
    set targetTop(value) {
        this._targetTop = value;
        this.play();
    }



    // Extra Constructor
    _extra() {

        super._extra();

        let prefix = this._prefix;

        /**
         * @description Data attributes names.
         * @member {object}
         * @protected
         */
        this._data = {
            ease: `data-${prefix}-ease`
        };

        /**
         * @description Element properties.
         * @member {object}
         * @protected
         */
        this._properties = {
            current: `${prefix}-current`,
            ease: `${prefix}-ease`
        };

        // what scroll values must be
        /**
         * @description Scroll Top goal
         * @protected 
         * @type {number}
         */
        this._targetTop = 0;
        /**
         * @description Scroll Left goal
         * @protected 
         * @type {number}
         */
        this._targetLeft = 0;

        // scroll top & scroll left
        // these are actually current values of last elements
        /**
         * @description Scroll Top value
         * @protected 
         * @type {number}
         */
        this._scrollTop = 0;
        /**
         * @description Scroll Left value
         * @protected 
         * @type {number}
         */
        this._scrollLeft = 0;

        /**
         * @description If the change of the scroll values must happen without interpolation
         * @protected 
         * @type {boolean}
         */
        this._instant = false;

        /**
         * @description Direction, 1 for down, -1 for up
         * @protected 
         * @type {number}
         */
        this._direction = 1;

        /**
         * @description Container width
         * @protected 
         * @type {number}
         */
        this._width = 1;
        /**
         * @description Container height
         * @protected 
         * @type {number}
         */
        this._height = 1;
        /**
         * @description Container exists by default
         */
        this._containerExists = false;

        /**
         * @description Outer width
         * @protected 
         * @type {number}
         */
        this._widthOuter = 1;
        /**
         * @description Outer height
         * @protected 
         * @type {number}
         */
        this._heightOuter = 1;
        
        /**
         * @description Animation frame
         * @protected 
         * @type {false|number}
         */
        this._frame = false;

        // get elements
        this._elGet();
        // create additional scrolling elements
        this._elCreate();

    }

    // Initialize & Run animation frame
    _init() {
        super._init();
        this._run();
    }

    // When properties are changed
    _changeProp(prop) {

        super._changeProp(prop);

        // update elements
        this._elGet(true);
        this.setSize();
        this._run();

    }



    /**
     * @description Get elements. Scroll elements are searched not only inside the outer.
     * @protected
     */
    _elGet() {

        // copy values
        let prop = this._prop,
            selectors = prop.selectors;
        /**
         * @description Outer element.
         * @protected
         * @member {HTMLElement}
         */
        this._outer = selectEl.one(selectors.outer);
        this._outer.classList.add(this._prefix);

        /**
         * @description Scroll elements.
         * @protected
         * @member {Array<HTMLElement>|NodeList}
         */
        this._el = selectEl.all(selectors.elements);
        let el = this._el;
        
        /**
         * @description Amount of elements.
         * @protected
         * @member {number}
         */
        this._length = el.length;

        // apply will change
        let willChangeValue = '';
        if (prop.willChange) {
            if (prop.useTransform) {
                willChangeValue = 'transform';
            }
            else {
                willChangeValue = 'top, left';
            }
        }
        for (let i = 0; i < el.length; i++) {
            el[i].style.willChange = willChangeValue;
        }

    }

    /**
     * @description Set element properties.
     * @protected
     */
    _elProp() {

        for (let i = 0; i < this._length; i++) {

            let el = this._el[i],
                prop = this._properties,
                current = prop.current,
                ease = this._data.ease;

            // get current scroll values
            el[current] = [this._scrollLeft, this.scrollTop];

            // get ease
            let attr = el.getAttribute(ease);
            if (attr) {
                ease = parseFloat(attr);
            } 
            else {
                ease = this._prop.ease;
            }

            // set ease
            el[prop.ease] = ease;

        }

    }
    
    /**
     * @description Create additional elements. They are needed for scrolling.
     * @protected
     */
    _elCreate() {

        const containerSelector = `${this._prefix}__container`;
        const containerElement = selectEl.one(containerSelector);
        if (containerElement) {
            this._container = containerElement;
            this._containerExists = true;
        }
        else {

            /**
             * @description Scroll Container.
             * @protected
             * @member {HTMLElement}
             */
            this._container = dom({
                selector: 'div',
                styles: `${this._prefix}__container`
            });

            // move elements
            while (this._outer.firstChild) {
                this._container.appendChild(this._outer.firstChild);
            }

            // append additional elements
            this._outer.appendChild(this._container);

        }

    }



    // Set Events
    _setEvents() {

        // sizes
        this.setSize();
        this.addEvent('viewport', {
            target: '',
            name: this.name,
            do: () => {
                timeoutCallback(() => {
                    this.setSize(true);
                }, this._prop.resizeTimeout);
            }
        });
        
        // wheel
        this.addEventListener({
            el: this._outer,
            target: 'wheel',
            do: this._wheel.bind(this),
            passive: true
        });
        
        // on scroll
        this.addEventListener({
            el: this._outer,
            target: "scroll",
            do: this._onScroll.bind(this),
            passive: true
        });

    }



    /**
     * @description Update size values.
     * @param {boolean} native - Defines if the method was called on window resize.
     */
    setSize(native = false) {

        if (!this._prop.run) {
            return;
        }

        // elements
        let container = this._container,
            outer = this._outer;

        // get sizes
        this._width = container.clientWidth;
        this._height = container.clientHeight;
        this._widthOuter = outer.clientWidth;
        this._heightOuter = outer.clientHeight;

        // bound height and widths
        if (this._width < this._widthOuter) {
            this._width = this._widthOuter;
        }
        if (this._height < this._heightOuter) {
            this._height = this._heightOuter;
        }

        // force change
        // it means that after resizing scrolling will be instantaneous for a while
        if (native) {
            this._instant = true;
        }

        // sometimes after resizing it may happen that targets are less or more
        // eslint-disable-next-line no-irregular-whitespace
        // than maximum values ​​of scrolling
        // that's why we check it out here and fix it
        if (native) {
            this._boundaries(false);
            this._boundaries(true);
        }

        // change element properties
        this._elProp();

        // launch callbacks
        this.lbt("size");

    }



    /**
     * @description Event on wheel.
     * @param {WheelEvent} evt - Event.
     * @protected
     */
    _wheel(evt) {

        let prop = this._prop;

        if (prop.run & prop.scroll) {

            // stop propagation if enabled
            if (!prop.propagation) {
                // evt.preventDefault();
                evt.stopPropagation();
            }

            // get normalized delta
            let delta = normalizeWheel(evt);

            // set new scroll targets
            let x = delta.pixelX,
                y = delta.pixelY;
            if (prop.horizontal) {
                x = delta.pixelY;
                y = delta.pixelX;
            }
            this.targetLeft += x;
            this.targetTop += y;
            
            // shrink target values
            this._boundaries(false);
            this._boundaries(true);

            // set direction
            let directionPixel = 'pixelY';
            if (prop.horizontal) {
                directionPixel = 'pixelX';
            }
            if (delta[directionPixel] < 0) {
                this._direction = -1;
            }
            else {
                this._direction = 1;
            }

            // play scroll
            this.play();

            // launch events
            this.lbt("wheel", evt);

        }

    }

    /**
     * @description Event on scroll. Reset native scroll values.
     * @protected
     */
    _onScroll() {

        let prop = this._prop;

        if (prop.run) {
            this._outer.scrollTop = 0;
            this._outer.scrollLeft = 0;
        }

    }



    /**
     * @description Prevent cases when targets are less or more than the maximum values of scrolling
     * @protected
     * @param {boolean} [vertical=true]
     */
    _boundaries(vertical = true) {

        let targetTop = this._targetTop,
            targetLeft = this._targetLeft;
        
        // check cases
        if (vertical) {
            let max = this._height - this._heightOuter;
            if (targetTop < 0) {
                this.targetTop = 0;
            }
            if (targetTop > max) {
                this.targetTop = max;
            }
        }
        else {
            let max = this._width - this._widthOuter;
            if (targetLeft < 0) {
                this.targetLeft = 0;
            }
            if (targetLeft > max) {
                this.targetLeft = max;
            }
        }

    }

    /**
     * @description The same as {@linkcode Vevet.ScrollModule._boundaries} but for both axis.
     * @protected
     */
    _boundariesBoth() {
        this._boundaries(false);
        this._boundaries();
    }



    /**
     * @description Run animationFrame.
     * @protected
     */
    _run() {

        if (this._prop.run) {
            this.play();
        }
        else {
            this.stop();
        }

    }

    /**
     * @description Run animation frame if scroll is enabled.
     */
    play() {

        let frame = this._frame;

        if (!frame & this._prop.run) {
            if (this._prop.frame) {
                this._frame = this._prop.frame.on("frame", this.animate.bind(this));
            }
            else {            
                this._frame = window.requestAnimationFrame(this.animate.bind(this));
            }
        }

    }

    /**
     * @description Stop animation frame. Though it will restart on the wheel event.
     * To stop scroll forever use {@linkcode Vevet.ScrollModule.changeProp}.
     */
    stop() {

        let frame = this._frame;

        if (frame) {
            if (this._prop.frame) {
                this._prop.frame.remove(this._frame);
            }
            else {
                window.cancelAnimationFrame(frame);
            }
            this._frame = false;
        }

    }


    /**
     * @memberof Vevet.ScrollModule
     * @typedef {object} Event
     * 
     * @property {number} left
     * @property {number} top
     */

    /**
     * @description Animation. Here scroll values are calculated.
     */
    animate() {

        // auto-resizing
        this._autoResize();

        // instant scroll after resizing
        let instant = false;
        if (this._instant) {
            instant = true;
            this._instant = false;
        }

        // calculate scroll values: scrollLeft & scrollTop
        this._calcScrollValues(instant);

        // change elements' values
        this._calcElValues(instant);

        // render
        this._render();

        // event
        this.lbt("update", {
            left: this._scrollLeft,
            top: this._scrollTop
        });

        // animation frame
        if (!this._prop.frame) {
            this._frame = window.requestAnimationFrame(this.animate.bind(this));
        }

        // stop frame if values are interpolated
        const yDiff = Math.abs(this._targetTop - this._scrollTop);
        const xDiff = Math.abs(this._targetLeft - this._scrollLeft);
        if (yDiff < .01 & xDiff < .01) {
            if (this._prop.autoStop) {
                this.stop();
            }
            this.lbt("approximate");
        }

    }

    /**
     * @description Auto-resizing while animating.
     */
    _autoResize() {

        // get prop
        let prop = this._prop,
            container = this._container;
        
        // auto resize
        if (prop.resizeOnUpdate) {
            let height = container.clientHeight,
                width = container.clientWidth;
            if ((height != this._height) || (width != this._width)) {
                this.setSize();
            }
        }

    }

    /**
     * @description Calculate elements' values.
     * @param {boolean} instant - If animation is to be implemented instantly.
     */
    _calcElValues(instant) {

        // get prop
        let properties = this._properties;

        for (let i = 0; i < this._length; i++) {

            // get element
            let el = this._el[i];

            // get ease
            let ease = this._getEase(el, instant);

            // target and current values
            let current = el[properties.current];

            // change values
            if (ease === this._prop.ease) {
                current[0] = this._scrollLeft;
                current[1] = this._scrollTop;
            }
            else {
                current[0] = this._r(lerp(current[0], this._targetLeft, ease));
                current[1] = this._r(lerp(current[1], this._targetTop, ease));
                // round the values
                if (this._prop.round) {
                    current[0] = Math.round(current[0]);
                    current[1] = Math.round(current[1]);
                }
            }

        }

    }

    /**
     * @description Calculate scroll values: scrollLeft & scrollTop.
     * @param {boolean} instant - If animation is to be implemented instantly.
     */
    _calcScrollValues(instant) {

        // get ease
        let ease = this._getEase(null, instant);

        // change values
        this._scrollLeft = this._r(lerp(this._scrollLeft, this._targetLeft, ease));
        this._scrollTop = this._r(lerp(this._scrollTop, this._targetTop, ease));

        // round the values
        if (this._prop.round) {
            this._scrollLeft = Math.round(this._scrollLeft);
            this._scrollTop = Math.round(this._scrollTop);
        }

    }

    _r(t, e) {

        return e = void 0 !== e ? Math.pow(10, e) : 1e3,
        Math.round(t * e) / e

    }

    /**
     * @description Get elements ease.
     * @protected
     * @param {HTMLElement} el 
     * @param {boolean} instant - Instant scroll after resizing.
     */
    _getEase(el, instant) {

        if (instant) {
            return 1;
        }
        else {
            if (el == null) {
                return this._prop.ease;
            }
            else {
                return el[this._properties.ease];
            }
        }

    }

    /**
     * @description Render elements, transforms.
     * @protected
     */
    _render() {
        
        // through all elements
        for (let i = 0; i < this._length; i++) {
            let el = this._el[i],
                current = el[this._properties.current];
            // coords
            const x = -current[0];
            const y = -current[1];
            // set styles
            if (this._prop.useTransform) {
                el.style.transform = `
                    matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0, ${x}, ${y}, 0,1)
                `;
            }
            else {
                el.style.left = x + 'px';
                el.style.top = y + 'px';
            }
        }

    }



    /**
     * @description Destroy the scroll.
     */
    destroy() {

        super.destroy();

        // stop frame
        this._prop.run = false;
        this._run();

        // vars
        const outer = this._outer;

        // remove container if created by the script
        if (!this._containerExists) {

            // vars
            let container = this._container,
                children = container.children;

            // move children from the container to the root
            for (let i = 0; i < children.length; i++) {
                outer.appendChild(children[i]);
            }
            // remove container
            outer.removeChild(container);

        }

        // classes
        outer.classList.remove(this._prefix);

        // styles
        for (let i = 0; i < this._el.length; i++) {
            let el = this._el[i];
            el.style.transform = '';
            el.style.willChange = '';
        }
        
    }



}