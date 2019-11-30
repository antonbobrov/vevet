import ScrollAnimate from './index';
import utils from '../../core/utils';

/**
 * @classdesc Get notified when a DOM element enters the viewport. <br>
 * Available targets:
 *  <ul>
 *      <li>in - when an element appears in the viewport. Each callback receives {@linkcode Vevet.View.Event} as an argument.</li>
 *  </ul>
 * <br><br> <b>import {View} from 'vevet';</b>
 * 
 * @class
 * @abstract
 * @memberof Vevet
 * @augments Vevet.ScrollAnimate
 */
export default class View extends ScrollAnimate {


    
    /**
     * @memberof Vevet.View
     * @typedef {object} Properties
     * @augments Vevet.ScrollAnimate.Properties
     * 
     * @property {number} [edge=0.9] - The moment when an element is in viewport. 
     * 0.9 = 90% of viewport height/width from top/left.
     * @property {boolean} [seekLoad=true] - *** Call {@linkcode Vevet.View#seek} after the page is loaded.
     * @property {string} [classToAdd=vevet-view__el_viewed] - Class to be added to the dom element when it appears in the viewport.
     * @property {number} [stackDelay=100] - A delay before callbacks are launched.
     * It is applied only for those elements that have an attribute "data-vevet-view-stack"
     * and only on the first launch of {@linkcode Vevet.View#seek}. 
     * The value of the attribute must be order of elements from 0 to Infinity.
     * 
     * @property {object} [autostack]
     * @property {boolean} [autostack.on=false] - Set true to enable auto-calculation 
     * of delay of the elements on the first launch of {@linkcode Vevet.View#seek}.
     * Autostack will be ignored for the elements that have the attribute "data-vevet-view-stack".
     * @property {number} [autostack.delay=750] - The maximal delay for the element nearest to the edge of
     * the scroll outer.
     */
    /**
     * @alias Vevet.View
     * 
     * @param {Vevet.View.Properties} data
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}view`;
    }

    get defaultProp() {
        
        return utils.merge(super.defaultProp, {
            edge: .9,
            seekLoad: true,
            classToAdd: `${this._prefix}__el_viewed`,
            stackDelay: 100,
            autostack: {
                on: false,
                delay: 750
            }
        });

    }


    
    /**
     * @memberof Vevet.View
     * @typedef {object} Event
     * 
     * @property {HTMLElement} el - The element that appeared in the viewport.
     */



    // Extra Constructor
    _extra() {

        let prefix = this._prefix;

        // values
        this._edge = 0;
        this._firstLoad = true;

        /**
         * @description Data attributes names.
         * @member {object}
         * @private
         */
        this._data = {
            proceeded: `data-${prefix}-proceeded`,
            in: `data-${prefix}-in`,
            stack: `data-${prefix}-stack`
        };

        super._extra();

        /**
         * @description Properties.
         * @member {object}
         * @private
         */
        this._properties = {
            callback: `${prefix}-callback`
        };

    }



    /**
     * @description Get elements.
     * @protected
     */
    _elGet() {

        super._elGet();

        let data = this._data;

        // proceeded
        for (let i = 0; i < this._el.length; i++) {
            let el = this._el[i];
            let attribute = el[data.proceeded];
            if (typeof attribute == 'undefined') {
                el[data.in] = false;
                el[data.proceeded] = true;
            }
        }

    }

    /**
     * @description Update elements.
     */
    updateEl() {

        // remove event listeners before
        this._removeScrollListeners();

        // get new elements
        this._elGet();

    }



    /**
     * @description Set events.
     * @protected
     */
    _setEvents() {

        super._setEvents();

        let prop = this._prop;

        // on load
        if (prop.seekLoad) {
            this._addEvent('load', {
                name: this.name,
                do: () => {
                    if (prop.seekLoad) {
                        this.seek();
                    }
                }
            });
        }

        // add class
        this.on("in", data => {
            data.el.classList.add(prop.classToAdd);
        });

    }

    /**
     * @description Update size values.
     */
    setSize() {

        super.setSize();

        this._edge = this._prop.edge * this._size;

    }



    // Seek elements
    seek(val = null){
        
        if (!super.seek(val)) {
            return false;
        }

        let boundingOuter = this._bounding,
            prop = this._prop,
            horizontal = prop.horizontal,
            data = this._data;

        // get edge
        let edge = this._edge;
        if (this._firstLoad) {
            edge = this._size;
        }

		for (let i = 0; i < this._el.length; i++) {

            let el = this._el[i];

            // continue if the element already entered the viewport
            if (el[data.in]) {
                continue;
            }

            // get sizes
            let bounding = el.getBoundingClientRect();
            let b = {
                top: bounding.top - boundingOuter.top,
                bottom: bounding.bottom - boundingOuter.bottom,
                left: bounding.left - boundingOuter.left,
                right: bounding.right - boundingOuter.right
            };
            let elEdges = horizontal ? [b.left, b.right] : [b.top, b.bottom],
                elSize = horizontal ? el.clientWidth : el.clientHeight;

            // check if in viewport
			if (elEdges[0] < edge) {
				if (elEdges[0] > elSize * -1){

                    // if stack
                    let delay = 0;
                    if (this._firstLoad) {
                        delay = this._getDelay(el, elEdges);
                    }

                    // form an object for event
                    let obj = {
                        el: el
                    };

                    // element on view
                    utils.timeoutCallback(() => {
                        this.lbt("in", obj);
                        this._seekCallback(el);
                    }, delay);

                    // change vars
                    el[data.in] = true;
                    
                }
            }
            
        }

        // first load
        if (this._firstLoad) {
            this._firstLoad = false;
        }

        return true;

    }

    _getDelay(el, elEdges) {

        let prop = this._prop,
            autostack = prop.autostack,
            delay = 0;

        let stack = el.getAttribute(this._data.stack);
        if (stack) {
            delay = parseInt(stack) * prop.stackDelay;
        }
        else {
            if (autostack.on) {
                delay = elEdges[0] / this._size * autostack.delay;
            }
        }

        return delay;

    }

    _seekCallback(el) {

        let callbackProp = this._properties.callback;

        if (typeof el[callbackProp] != "undefined") {
            el[callbackProp]();
        }

    }



}