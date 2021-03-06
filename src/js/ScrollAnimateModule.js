import Module from './Module';
import merge from './merge';
const selectEl = require('select-el');

/**
 * @classdesc This class is a base for {@linkcode Vevet.ScrollAnchorModule} & {@linkcode Vevet.ScrollViewModule}.
 * <br><br> <b>import {ScrollAnimateModule} from 'vevet';</b>
 * 
 * @class
 * @abstract
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class ScrollAnimateModule extends Module {


    
    /**
     * @memberof Vevet.ScrollAnimateModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {object} [selectors]
     * @property {string|HTMLElement|Window|Vevet.ScrollModule} [selectors.outer=.vevet-scrollAnimate] - The scroll outer element.
     * @property {string|HTMLElement|NodeList|Array<HTMLElement>} [selectors.elements=.vevet-scrollAnimate__el] - Elements inside the outer.
     * @property {boolean} [selectors.inside=true] - True for searching elements only inside the outer element.
     * 
     * @property {boolean} [on=true] - If events are enabled.
     * @property {boolean} [resize=true] - Update on resize.
     * @property {number} [resizeTimeout=0] - Timeout before sizes are updated when the window is resized.
     * @property {boolean} [event=true] - If you need to use native events.
     * {@linkcode Vevet.ScrollAnimateModule#seek} will be launched automatically when scrolling is true.
     * @property {boolean} [seekInit=true] - Call {@linkcode Vevet.ScrollAnimateModule#seek} after the class is initialized.
     * @property {boolean} [horizontal=false] - Direction of scrolling.
     */
    /**
     * @alias Vevet.ScrollAnimateModule
     * 
     * @param {Vevet.ScrollAnimateModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}scrollAnimate`;
    }

    /**
     * @readonly
     * @type {Vevet.ScrollAnimateModule.Properties}
     */
    get defaultProp() {

        let prefix = this._prefix;
        
        return merge(super.defaultProp, {
            selectors: {
                outer: `.${prefix}`,
                elements: `.${prefix}__el`,
                inside: true
            },
            on: true,
            resize: true,
            resizeTimeout: 0,
            event: true,
            seekInit: true,
            horizontal: false
        });

    }

    /**
     * @member Vevet.ScrollAnimateModule#prop
     * @memberof Vevet.ScrollAnimateModule
     * @readonly
     * @type {Vevet.ScrollAnimateModule.Properties}
     */

    /**
     * @member Vevet.ScrollAnimateModule#_prop
     * @memberof Vevet.ScrollAnimateModule
     * @protected
     * @type {Vevet.ScrollAnimateModule.Properties}
     */

    /**
     * @function Vevet.ScrollAnimateModule#changeProp
     * @memberof Vevet.ScrollAnimateModule
     * @param {Vevet.ScrollAnimateModule.Properties} [prop]
     */



    /**
     * @description Scroll outer.
     * @readonly
     * @type {HTMLElement|Window}
     */
    get outer() {
        return this._outer;
    }
    /**
     * @description Elements.
     * @readonly
     * @type {Array<HTMLElement>|NodeList}
     */
    get elements() {
        return this._el;
    }



    // Extra Constructor
    _extra() {

        super._extra();

        /**
         * @description Vevet ScrollModule callback
         * @member {false|string}
         * @protected
         */
        this._scrollModuleCallback = false;
        /**
         * @description Vevet ScrollModule or Scroll Outer
         * @member {HTMLElement|Window|Vevet.ScrollModule}
         * @protected
         */
        this._vevetScroll = false;
        /**
         * @member {number}
         * @protected
         */
        this._size = 0;
        /**
         * @member {number}
         * @protected
         */
        this._scrollValue = 0;
        /**
         * @member {DOMRect}
         * @protected
         */
        this._bounding = false;

        // get elements
        this._elGet();

    }

    // Seek on Init
    _init() {

        super._init();

        // seek
        if (this._prop.seekInit) {
            this.seek();
        }

    }

    // When Properties are changed
    _changeProp() {

        super._changeProp();

        this._removeScrollListeners();

        // get elements & set events on them
        this._elGet();

        // update size values
        this.setSize();

    }

    /**
     * @description Remove scroll listeners
     * @protected
     */
    _removeScrollListeners() {

        // remove event listeners before
        this.removeEventListeners();
        if (this._scrollModuleCallback) {
            this._vevetScroll.remove(this._scrollModuleCallback);
        }

    }



    /**
     * @description Get elements & set events on them.
     * @protected
     */
    _elGet() {

        let isModule = false,
            prop = this._prop,
            selectors = prop.selectors,
            selectorOuter = selectors.outer;

        /**
         * @member Vevet.ScrollAnimateModule#_outer
         * @memberof Vevet.ScrollAnimateModule
         * @protected
         * @type {HTMLElement|Window|Vevet.ScrollModule}
         */
        /**
         * @member Vevet.ScrollAnimateModule#_el
         * @memberof Vevet.ScrollAnimateModule
         * @protected
         * @type {Array<HTMLElement>|NodeList}
         */

        // if a Module is used
        if (selectorOuter instanceof Module) {
            this._vevetScroll = selectorOuter;
            this._outer = selectorOuter.outer;
            isModule = true;
        }
        else {
            let el = selectEl.one(selectorOuter);
            this._vevetScroll = el;
            this._outer = el;
        }

        // get elements
        let selectorElements = selectors.elements;
        if (selectors.inside) {
            this._el = this._outer.querySelectorAll(selectorElements);
        }
        else {
            this._el = selectEl.all(selectorElements);
        }

        // set scrolling events
        this._scrollModuleCallback = false;
        if (prop.event) {
            // module event
            if (isModule) {
                this._scrollModuleCallback = this._vevetScroll.add({
                    target: 'update',
                    do: this.seek.bind(this, null)
                });
            }
            // native event
            else {
                this.listener(this._outer, 'scroll', this.seek.bind(this, null));
            }
        }

    }



    // Set events
    _setEvents() {

        super._setEvents();

        let prop = this._prop;

        // sizes
        this.setSize();
        this.addEvent('viewport', {
            target: '',
            name: this.name,
            do: () => {
                setTimeout(() => {
                    this.setSize();
                    if (prop.resize & prop.on) {
                        this.seek();
                    }
                }, prop.resizeTimeout);
            }
        });

    }

    /**
     * @description Update size values.
     */
    setSize() {

        let prop = this._prop;

        // get outer
        let outer = this._outer;

        // set size for window
        if (outer instanceof Window) {
            // size
            let size = this._v.viewport.size;
            this._size = prop.horizontal ? size[0] : size[1];
            // bounding
            this._bounding = {
                top: 0,
                left: 0,
                bottom: size[1],
                right: size[0]
            };
        }
        // for elements
        else {
            // size
            this._size = prop.horizontal ? outer.clientWidth : outer.clientHeight;
            // bounding
            this._bounding = outer.getBoundingClientRect();
        }

        // set scroll value
        this._setScrollValue(null);

    }

    /**
     * @description Set scrolling values
     * @param {number} val
     * @protected
     */
    _setScrollValue(val = null) {

        let horizontal = this._prop.horizontal;

        // set scroll value if window
        if (this._outer instanceof Window) {
            this._scrollValue = horizontal ? window.pageXOffset : window.pageYOffset;
        }
        // if other element
        else {
            if (val != null) {
                this._scrollValue = val;
            }
            else {
                this._scrollValue = horizontal ? this._vevetScroll.scrollLeft : this._vevetScroll.scrollTop;
            }
        }

    }



    /**
     * @description Seek elements.
     * @param {number} [val] - Scroll value.
     * @returns {boolean} Returns true if available.
     */
    seek(val = null){

        if (!this._prop.on) {
            return false;
        }

        this._setScrollValue(val);
        
        return true;

    }



    /**
     * @description Destroy the class.
     */
    destroy() {

        super.destroy();

        // remove vevet scroll event
        if (this._scrollModuleCallback) {
            this._vevetScroll.remove(this._scrollModuleCallback);
        }
        
    }



}