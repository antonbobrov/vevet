import Event from './Event';
const isMobile = require('is-mobile');

/**
 * @classdesc Callbacks on window resize. Here the names of the OS, Browser, and Device can be changed. <br>
 * Available targets:
 *  <ul>
 *      <li>w - when width changes and height preserves its value</li>
 *      <li>h - when height changes and width preserves its value</li>
 *      <li>wh - when both width and height change</li>
 *      <li>hw - when both width and height change</li>
 *      <li>w_ - you need to trace only changes of width, height doesn't matter</li>
 *      <li>h_ - you need to trace only changes of height, width doesn't matter</li>
 *      <li>(empty) - use it when you don't care what changes</li>
 *  </ul>
 * <br>All targets will receive {@linkcode Vevet.ViewportEvent.Callback} as an argument.
 * <br><br> <b>import {ViewportEvent} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.ViewportEvent : w : Vevet.ViewportEvent.Callback }
 * @vevetModuleCallback { Vevet.ViewportEvent : h : Vevet.ViewportEvent.Callback }
 * @vevetModuleCallback { Vevet.ViewportEvent : wh : Vevet.ViewportEvent.Callback }
 * @vevetModuleCallback { Vevet.ViewportEvent : hw : Vevet.ViewportEvent.Callback }
 * @vevetModuleCallback { Vevet.ViewportEvent : w_ : Vevet.ViewportEvent.Callback }
 * @vevetModuleCallback { Vevet.ViewportEvent : h_ : Vevet.ViewportEvent.Callback }
 * @vevetModuleCallback { Vevet.ViewportEvent :  : Vevet.ViewportEvent.Callback }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Event
 */
export default class ViewportEvent extends Event {


    
    _extra() {

        super._extra();

        /**
         * @private
         * @type {Array<number>}
         */
        this._size = [0, 0];
        /**
         * @private
         * @type {Array<number>}
         */
        this._sizePrev = [0, 0];
        /**
         * @private
         * @type {boolean}
         */
        this._desktop = false;
        /**
         * @private
         * @type {boolean}
         */
        this._tablet = false;
        /**
         * @private
         * @type {boolean}
         */
        this._mobile = false;
        /**
         * @description Breakpoint types
         * @private
         * @type {Array<string>}
         */
        this._types = ['desktop', 'tablet', 'mobile'];

    }



    /**
     * @description Get current sizes of the window (width, height).
     * @readonly
     * @type {Array<number>}
     */
    get size() {
        return this._size;
    }
    /**
     * @description If the width of the window is more than the desktop value in {@linkcode Vevet.Application#prop}.
     * @readonly
     * @type {boolean}
     */
    get desktop() {
        return this._desktop;
    }
    /**
     * @description If the width of the window is equal to or less than the tablet value in {@linkcode Vevet.Application#prop}.
     * @readonly
     * @type {boolean}
     */
    get tablet() {
        return this._tablet;
    }
    /**
     * @description If the width of the window is equal to or less than the mobile value in {@linkcode Vevet.Application#prop}.
     * @readonly
     * @type {boolean}
     */
    get mobile() {
        return this._mobile;
    }
    /**
     * @description Device pixel ratio.
     * @readonly
     * @type {number}
     */
    get dpr() {
        if(typeof window.devicePixelRatio != "undefined"){
            return window.devicePixelRatio;
        }
        return 1;
    }
    /**
     * @description Device pixel ratio. For non-mobile devices it is equal to 1.
     * @readonly
     * @type {number}
     */
    get dprDevice() {
        if (this.mobiledevice) {
            return this.dpr;
        }
        return 1;
    }
    /**
     * @description If mobile device.
     * @readonly
     * @type {boolean}
     */
    get mobiledevice() {
        return isMobile({tablet: true});
    }
    /**
     * @description If width greater than height.
     * @readonly
     * @type {boolean}
     */
    get landscape() {
        return this.size[0] > this.size[1];
    }
    /**
     * @description If width less than height.
     * @readonly
     * @type {boolean}
     */
    get portrait() {
        return this.size[0] < this.size[1];
    }



    // Set events on resize
    _setEvents() {

        window.addEventListener("resize", this._implement.bind(this));

        // set values
        this._set();

    }



    /**
     * @memberof Vevet.ViewportEvent
     * @typedef {object} Callback
     * 
     * @property {Array<number>} size Current sizes of the window (width, height).
     * @property {number} dpr Device pixel ratio.
     * @property {boolean} desktop If the size of the window for desktop. Taken from {@linkcode Vevet.Application#prop}.
     * @property {boolean} tablet If the size of the window for tablet. Taken from {@linkcode Vevet.Application#prop}.
     * @property {boolean} mobile If the size of the window for mobile. Taken from {@linkcode Vevet.Application#prop}.
     * @property {boolean} mobiledevice If mobile device.
     * @property {boolean} landscape If width more than height.
     */

    /**
     * @description Launch callbacks on resize.
     * 
     * @private
     */
    _implement() {

        // copy previous values
        let sizePrev = this._sizePrev.slice();

        // set viewport values
        this._set();

        // create object to transmit to callbacks
        let obj = {
            size: this.size,
            dpr: this.dpr,
            desktop: this.desktop,
            tablet: this.tablet,
            mobile: this.mobile,
            mobiledevice: this.mobiledevice,
            landscape: this.landscape
        };

        // size copy
        let size = this._size,
            width = size[0],
            height = size[1];

        // only when width is changed
        if (width !== sizePrev[0] & height === sizePrev[1]) {
            this.lbt('w', obj);
        }

        // only when height is changed
        if (height !== sizePrev[1] & width === sizePrev[0]) {
            this.lbt('h', obj);
        }

        // when height & width are changed
        if (width !== sizePrev[0] & height !== sizePrev[1]) {
            this.lbt('wh', obj);
            this.lbt('hw', obj);
        }

        // when width changed
        if (width !== sizePrev[0]) {
            this.lbt('w_', obj);
        }

        // when height changed
        if (height !== sizePrev[1]) {
            this.lbt('h_', obj);
        }

        // on any change
        this.lbt('', obj);

    }



    /**
     * @description Change values, classes, etc.
     * @private
     */
    _set() {

        let html = this._v.html;

        // set sizes
        this._size = [
            html.clientWidth,
            html.clientHeight
        ];
        this._sizePrev = this._size.slice();
    
        this._classes();
        this._breakpoints();

    }



    /**
     * @description Change classes of the document element.
     * @private
     */
    _classes() {

        // copy
        let width = this._size[0],
            prop = this._v.prop,
            html = this._v.html,
            prefix = this._v.prefix;

        // breakpoints
        let type = 'desktop',
            types = this._types;
        if (width <= prop.tablet) {
            if (width > prop.mobile) {
                type = 'tablet';
            }
            else {
                type = 'mobile';
            }
        }
        switch(type) {
            case 'desktop':
                this._classesBreakpoint("desktop", types);
                break;
            case 'tablet':
                this._classesBreakpoint("tablet", types);
                break;
            case 'mobile':
                this._classesBreakpoint("mobile", types);
                break;
            default:
                break;
        }

        // orientation
        let orientationTypes = [
            'landscape',
            'portrait'
        ];
        if (this.landscape) {
            this._classesBreakpoint("landscape", orientationTypes);
        }
        else if (this.portrait) {
            this._classesBreakpoint("portrait", orientationTypes);
        }
        else {
            this._classesBreakpoint("", orientationTypes);
        }

        // mobile device
        let mobileDeviceClass = prefix + 'mobile-device';
        if (this.mobiledevice) {
            html.classList.add(mobileDeviceClass);
        }
        else{
            html.classList.remove(mobileDeviceClass);
        }

    }

    _classesBreakpoint(type, types) {

        let html = this._v.html,
            prefix = this._v.prefix;

        types.forEach(e => {
            if (e === type) {
                html.classList.add(prefix + e);
            }
            else {
                html.classList.remove(prefix + e);
            }
        });

    }

    /**
     * @description Breakpoints for sizes.
     * @private
     */
    _breakpoints() {

        // copy
        let width = this._size[0],
            prop = this._v.prop,
            types = this._types;

        if (width > prop.tablet) {
            this._breakpointsSet("desktop", types);
        }
        else {
            if (width > prop.mobile){
                this._breakpointsSet("tablet", types);
            }
            else {
                this._breakpointsSet("mobile", types);
            }
        }

    }

    _breakpointsSet(type, types) {

        types.forEach(e => {
            if (e === type) {
                this['_' + type] = true;
            }
            else {
                this['_' + e] = false;
            }
        });

    }



}