const dom = require('dom-create-element');

import Module from '../Module';
import utils from '../../core/utils';

/**
 * @classdesc A class for cretating custom smooth scrolling.
 * While setting up the class, you can choose what elements will imitate scrolling.
 * There can be several elements, that will imitate scrolling with or without delays (with different easings), 
 * or there can be one element, an outer element, that will be translated while scrolling.
 * The scroll itself works on the basis of {@linkcode requestAnimationFrame} and {@linkcode css-transforms}. <br>
 * Available targets:
 *  <ul>
 *      <li>update - when scroll values are updated, it is launched on each frame. Each callback receives {@linkcode Vevet.Scroll.Event} as an argument.</li>
 *  </ul>
 * <br><br> <b>import {Scroll} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class Scroll extends Module {


    
    /**
     * @memberof Vevet.Scroll
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {object} [selectors]
     * @property {string|HTMLElement} [selectors.outer=.vevet-scroll] - *** The scroll outer element.
     * @property {string|HTMLElement|NodeList|Array<HTMLElement>} [selectors.elements=.vevet-scroll__el] - Elements inside the outer element to be scrolled.
     * 
     * @property {boolean} [run=true] - If true, the scrolling will work.
     * @property {boolean} [resizeOnUpdate=true] - Sometimes content and its height may change.
     * If so, you need to launch {@linkcode Vevet.Scroll#setSize}.
     * But if resizeOnUpdate is true, this action is not needed, because everything will be updated automatically.
     * @property {number} [resizeTimeout=0] - A timeout before sizes are updated when the window is resized.
     * @property {boolean} [scroll=true] - Defines if the scroll will respond to the wheel event.
     * @property {boolean} [horizontal=false]
     * 
     * @property {number} [ease=0.1] - The higher number, the faster animation.
     * By the way, each scrolling element may have the attribute "data-vevet-scroll-ease" which will set
     * a custom ease value for this very element.
     * 
     * @property {boolean} [propagation=false] - If false, 'stopPropagation' will work.
     * @property {boolean} [willChange=false] - Add will-change to the scrolling elements.
     */
    /**
     * @alias Vevet.Scroll
     * 
     * @param {Vevet.Scroll.Properties} data
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}scroll`;
    }

    get defaultProp() {

        let prefix = this._prefix;
        
        return utils.merge(super.defaultProp, {
            selectors: {
                outer: `.${prefix}`,
                elements: `.${prefix}__el`
            },
            run: true,
            resizeOnUpdate: true,
            resizeTimeout: 0,
            scroll: true,
            horizontal: false,
            ease: .1,
            propagation: false,
            willChange: false
        });

    }



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
     * @description Get scroll sizes: scrollWidth & scrollHeight.
     * @readonly
     * @type {Array<number>}
     */
    get sizes() {
        return [this._width, this._height];
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
    }



    // Extra Constructor
    _extra() {

        super._extra();

        let prefix = this._prefix;

        /**
         * @description Data attributes names.
         * @member {object}
         * @private
         */
        this._data = {
            ease: `data-${prefix}-ease`
        };

        /**
         * @description Element properties.
         * @member {object}
         * @private
         */
        this._properties = {
            current: `${prefix}-current`,
            ease: `${prefix}-ease`
        };

        // what scroll values must be
        this._targetTop = 0;
        this._targetLeft = 0;

        // scroll top & scroll left
        // these are actually current values of last elements
        this._scrollTop = 0;
        this._scrollLeft = 0;

        // if the change of the scroll values must happen without interpolation
        this._instant = false;

        // direction, 1 for down, -1 for up
        this._direction = 1;
        
        // animation frame
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
     * @private
     */
    _elGet() {

        // copy values
        let prop = this._prop,
            selectors = prop.selectors;

        // get outer
        this._outer = utils.element(selectors.outer);
        this._outer.classList.add(this._prefix);

        // get elements
        this._el = utils.elements(selectors.elements);
        let el = this._el;
        // count of elements
        this._length = el.length;

        // will change
        if (prop.willChange) {
            for (let i = 0; i < el.length; i++) {
                el[i].style.willChange = 'transform';
            }
        }

    }

    /**
     * @description Set element properties.
     * @private
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
     * @private
     */
    _elCreate() {

        // create container
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

        // create scrollbar
        this._scrollbarsCreate();

    }



    // Set Events
    _setEvents() {

        // sizes
        this.setSize();
        this._addEvent('viewport', {
            target: '',
            name: this.name,
            do: () => {
                utils.timeoutCallback(() => {
                    this.setSize(true);
                }, this._prop.resizeTimeout);
            }
        });
        
        // wheel
        this.listener(this._outer, 'wheel', this._wheel.bind(this));

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

        // update sizes of scrollbars
        this._scrollbarsSizes();

        // change element properties
        this._elProp();

    }



    /**
     * @description Event on wheel.
     * @param {object} evt - Event.
     * @private
     */
    _wheel(evt) {

        let prop = this._prop;

        if (prop.run & prop.scroll) {

            // stop propagation if enabled
            if (!prop.propagation) {
                evt.preventDefault();
                evt.stopPropagation();
            }

            // get normalized delta
            let delta = utils.normalizeWheel(evt);

            // set new scroll targets
            let x = delta.pixelX,
                y = delta.pixelY;
            if (prop.horizontal) {
                x = delta.pixelY;
                y = delta.pixelX;
            }
            this._targetLeft += x;
            this._targetTop += y;
            
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

        }

    }



    /**
     * @description Prevent cases when targets are less or more than the maximum values of scrolling
     * @private
     * @param {boolean} [vertical=true]
     */
    _boundaries(vertical = true) {

        let targetTop = this._targetTop,
            targetLeft = this._targetLeft;
        
        // check cases
        if (vertical) {
            let max = this._height - this._heightOuter;
            if (targetTop < 0) {
                this._targetTop = 0;
            }
            if (targetTop > max) {
                this._targetTop = max;
            }
        }
        else {
            let max = this._width - this._widthOuter;
            if (targetLeft < 0) {
                this._targetLeft = 0;
            }
            if (targetLeft > max) {
                this._targetLeft = max;
            }
        }

    }

    /**
     * @description The same as {@linkcode Vevet.Scroll._boundaries} but for both axis.
     * @private
     */
    _boundariesBoth() {
        this._boundaries(false);
        this._boundaries();
    }



    /**
     * @description Create Scrollbars.
     * @private
     */
    _scrollbarsCreate() {

        this._scrollbars = {};
        this._scrollbarCreate('x');
        this._scrollbarCreate('y');
        
    }

    /**
     * @description Create a certain Scrollbar.
     * @private
     * @param {string} postfix - X|Y.
     */
    _scrollbarCreate(postfix) {

        // create object
        this._scrollbars[postfix] = {};
        let obj = this._scrollbars[postfix];
        let prefix = this._prefix;

        // create outer
        obj.outer = dom({
            selector: 'div',
            styles: `${prefix}__scrollbar ${prefix}__scrollbar_${postfix}`
        });
        this._outer.appendChild(obj.outer);

        // create bar
        obj.bar = dom({
            selector: 'div',
            styles: `${prefix}__bar`
        });
        obj.outer.appendChild(obj.bar);

        // variables
        obj.outerWidth = 0;
        obj.outerHeight = 0;
        obj.barWidth = 0;
        obj.barHeight = 0;

    }

    /**
     * @description Update sizes of all scrollbars.
     * @private
     */
    _scrollbarsSizes() {

        this._scrollbarSizes('x');
        this._scrollbarSizes('y');

        this._scrollbarsClasses();

    }

    /**
     * @description Update a scrollbar sizes.
     * @private
     * @param {string} postfix - X|Y.
     */
    _scrollbarSizes(postfix) {

        // get object
        let obj = this._scrollbars[postfix];

        // variables
        obj.outerWidth = obj.outer.clientWidth;
        obj.outerHeight = obj.outer.clientHeight;
        obj.barWidth = obj.bar.clientWidth;
        obj.barHeight = obj.bar.clientHeight;

    }

    /**
     * @description Show/Hide scrollbars.
     * @private
     */
    _scrollbarsClasses() {

        // get scrollbars
        let scrollbars = this._scrollbars,
            x = scrollbars.x,
            y = scrollbars.y;

        // hide if needed
        if (this._width <= this._widthOuter) {
            x.outer.style.visibility = 'hidden';
        }
        if (this._height <= this._heightOuter) {
            y.outer.style.visibility = 'hidden';
        }

    }

    /**
     * @description Render scrollbars.
     * @private
     * @param {string} postfix - X|Y.
     */
    _scrollbarRender(postfix) {

        // get object
        let obj = this._scrollbars[postfix];

        // transforms
        if (postfix == 'y') {
            let line = this._height - this._heightOuter,
                p = this._scrollTop / line,
                lineLength = obj.outerHeight - obj.barHeight;
            obj.bar.style.transform = `translateY(${lineLength * p}px)`;
        }
        else {
            let line = this._width - this._widthOuter,
                p = this._scrollLeft / line,
                lineLength = obj.outerWidth - obj.barWidth;
            obj.bar.style.transform = `translateX(${lineLength * p}px)`;
        }

    }



    /**
     * @description Run animationFrame.
     * @private
     */
    _run() {

        let frame = this._frame;

        if (this._prop.run) {
            if (!frame) {
                this._frame = window.requestAnimationFrame(this.animate.bind(this));
            }
        }
        else {
            if (frame) {
                window.cancelAnimationFrame(frame);
                this._frame = false;
            }
        }

    }



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
        // render scrollbars
        this._scrollbarRender('x');
        this._scrollbarRender('y');

        // event
        this.lbt("update", {
            left: this._scrollLeft,
            top: this._scrollTop
        });

        // animation frame
        this._frame = window.requestAnimationFrame(this.animate.bind(this));

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
                current[0] = this._r(utils.lerp(current[0], this._targetLeft, ease));
                current[1] = this._r(utils.lerp(current[1], this._targetTop, ease));
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
        this._scrollLeft = this._r(utils.lerp(this._scrollLeft, this._targetLeft, ease));
        this._scrollTop = this._r(utils.lerp(this._scrollTop, this._targetTop, ease));

    }

    _r(t, e) {

        return e = void 0 !== e ? Math.pow(10, e) : 1e3,
        Math.round(t * e) / e

    }

    /**
     * @description Get elements ease.
     * @private
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
     * @private
     */
    _render() {
        
        // through all elements
        for (let i = 0; i < this._length; i++) {
            let el = this._el[i],
                current = el[this._properties.current];
            // set styles
            el.style.transform = "translate(" + (-current[0]) + "px, " + (-current[1]) + "px)";
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
        let container = this._container,
            children = container.children,
            outer = this._outer;

        // children
        for (let i = 0; i < children.length; i++) {
            outer.appendChild(children[i]);
        }

        // remove elements
        outer.removeChild(container);

        // remove scrollbars
        this._scrollbars['x'].outer.remove();
        this._scrollbars['y'].outer.remove();

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