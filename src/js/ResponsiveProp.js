import getVevetProperties from './getVevetProperties';
import merge from './merge';

/**
 * @classdesc A class for creating properties that may change on window resizing.
 * <br><br> <b>import {ResponsiveProp} from 'vevet';</b>
 * @class
 * @abstract
 * @memberof Vevet
 */
export default class ResponsiveProp {
    


    /**
     * @memberof Vevet.ResponsiveProp
     * @typedef {object} Responsive
     * 
     * @description Sometimes it may be useful to change properties when the window is resized.
     * There are two ways to do it:
     * <ul>
     *      <li>To set an event on the window when it is resized (or use {@linkcode Vevet.ViewportEvent}).
     *          When the window is resized, change the properties with the help of {@linkcode Vevet.Module#changeProp}</li>
     *      <li>
     *          The second way is to use the property 'responsive'. In the property, set an object with the properties
     *          you would like to change. Responsive properties can be also changed through {@linkcode Vevet.Module#changeProp},
     *          but they must be initialized on start. In case the properties are not initialized on start,
     *          they cannot be changed further.</li>
     * </ul>
     * 
     * @property {number} breakpoint - F.e., 1199. It means that new settings will be applied when the window size is less or equal to 1199px.
     * Available breakpoints:
     * <ul>
     *      <li>any number - width breakpoint</li>
     *      <li>'d' - for desktop only</li>
     *      <li>'t' - for tablets only</li>
     *      <li>'m' - for mobiles only</li>
     *      <li>'md' - for mobile devices</li>
     * </ul>
     * @property {object} settings - An object with new properties.
     */


    
    /**
     * @typedef {object} Vevet.ResponsiveProp.Properties
     * @property {Array<Vevet.ResponsiveProp.Responsive>} [responsive] - Responsive Settings.
     * 
     * @property {Vevet.Application} [v] - Vevet Application.
     */
    /**
     * @alias Vevet.ResponsiveProp
     * 
     * @param {Vevet.ResponsiveProp.Properties} [data]
     * @param {Function} [onchange] - Callback that is called when properties are changed thru {@linkcode Vevet.ResponsiveProp#changeProp}.
     * @param {Function} [onresponsive] - Callback that is called when properties are changed on resize (responsive callback).
     * 
     * @example 
     * let data = {
     *      myProp: true,
     *      responsive: [
     *          {
     *              breakpoint: 'm',
     *              settings: {
     *                  myProp: false
     *              }
     *          }
     *      ]
     * };
     * let event = new Vevet.ResponsiveProp(data);
     * 
     */
    constructor(data = {}, onchange = () => {}, onresponsive = () => {}) {

        // get vevet application if not exists
        data = getVevetProperties(data);

        /**
         * @description Vevet Application.
         * @type {Vevet.Application}
         * @protected
         */
        this._v = data.v;

        /**
         * @description Callback that is called when properties are changed thru {@linkcode Vevet.ResponsiveProp#changeProp}.
         * @protected
         * @type {Function}
         */
        this._onchange = onchange;
        /**
         * @description Callback that is called when properties are changed on resize (responsive callback).
         * @protected
         * @type {Function}
         */
        this._onresponsive = onresponsive;

        /**
         * @description The properties that were set while initialization.
         * These properties do not change throughout time.
         * @type {object}
         * @protected
         */
        this._propInit = data;
        /**
         * @description Reference properties.
         * These properties may change only on {@linkcode Vevet.ResponsiveProp#changeProp}.
         * @type {object}
         * @protected
         */
        this._propRef = merge({}, data);
        /**
         * @description Current properties.
         * These properties may change both on resize and {@linkcode Vevet.ResponsiveProp#changeProp}.
         * @type {object}
         * @protected
         */
        this._prop = merge({}, data);
        
        /**
         * @description Viewport Event ID.
         * @type {string}
         * @protected
         */
        this._viewportID = false;

        // initialize responsive properties
        // set events
        this._initResponsive();

    }



    /**
     * @description Current Properties. See {@linkcode typedef Properties} to get more info.
     * @type {object}
     */
    get prop() {
        return this._prop;
    }



    /**
     * @description This method allows you to change properties that were already set while initializing.
     * @param {object} prop - New Properties.
     * @example
     * 
     * // changing properties
     * // let's imagine that while initializing you set the following properties:
     * prop = {
     *      name: 'Me',
     *      features: {
     *          cute: true,
     *          sleepy: false
     *      }
     * };
     * // we can change some properties in it: whether one or several properties
     * module.changeProp({
     *     name: 'You'
     * });
     * module.changeProp({
     *      name: 'You',
     *      features: {
     *          cute: false
     *      }
     * });
     */
    changeProp(prop) {
        this._prop = merge(this._prop, prop);
        this._propRef = merge(this._propRef, prop);
        // change prop callback
        this._onchange();
    }



    /**
     * @description Initialize responsive properties.
     * @protected
     */
    _initResponsive() {

        // check if responsive properties exist
        if (typeof this._propInit.responsive != "undefined") {
            // change properties according to the responsive prop
            this._propertiesResponse();
            // add event on resize
            this._viewportID = this._v.viewport.add({
                target: 'w_',
                name: 'Responsive properties',
                do: this._propertiesResponse.bind(this, true)
            });
        }

    }

    /**
     * @description Change properties according to the "responsive" prop.
     * @protected
     * @param {boolean} [resize] - If the method was called on resize.
     */
    _propertiesResponse(resize = false) {

        let responsive = this._propInit.responsive;
        
        // check if responsive properties exist
        if (responsive) {

            // get sizes
            let viewport = this._v.viewport,
                width = viewport.size[0],
                newProp = {};
            
            // go through all breakpoints
            // check if a breakpoint exists
            let breakpointExists = false;
            responsive.forEach((obj) => {

                // copy settings
                let settings = obj.settings,
                    breakpoint = obj.breakpoint;

                // if breakpoint is a number
                if (typeof breakpoint == 'number') {
                    if (width <= obj.breakpoint) {
                        newProp = merge(newProp, settings);
                        breakpointExists = true;
                    }
                }
                // if breakpoint is a string // desktop, tablet, mobile, mobiledevice
                else if (typeof breakpoint === 'string') {
                    breakpoint = breakpoint.toLowerCase();
                    if (breakpoint === 'd' & viewport.desktop) {
                        newProp = merge(newProp, settings);
                        breakpointExists = true;
                    }
                    if (breakpoint === 't' & viewport.tablet) {
                        newProp = merge(newProp, settings);
                        breakpointExists = true;
                    }
                    if (breakpoint === 'm' & viewport.mobile) {
                        newProp = merge(newProp, settings);
                        breakpointExists = true;
                    }
                    if (breakpoint === 'md' & viewport.mobiledevice) {
                        newProp = merge(newProp, settings);
                        breakpointExists = true;
                    }
                }

            });

            // if no breakpoint exists, restore the props
            if (!breakpointExists) {
                this._prop = merge(this._prop, this._propRef);
            }
            // otherwise, change the properties
            else {
                this._prop = merge(this._prop, newProp);
            }

            // responsive callback
            if (resize) {
                this._onresponsive();
            }

        }

    }

    /**
     * @description Destroy the responsive properties.
     */
    destroy() {

        if (this._viewportID) {
            this._v.viewport.remove(this._viewportID);
        }

    }



}