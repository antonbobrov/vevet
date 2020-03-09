import Module from './Module';
import merge from './merge';
import timeoutCallback from './timeoutCallback';
const selectEl = require('select-el');

/**
 * @classdesc A base class for creating pop-up menus. 
 * It is used by {@linkcode Vevet.MenuModule} & {@linkcode Vevet.MenuTimelineModule}. <br>
 * Available targets:
 *  <ul>
 *      <li>show - when the menu is being opened.</li>
 *      <li>hide - when the menu is being hidden.</li> 
 *  </ul>
 * <br><br> <b>import {MenuBaseModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.MenuBaseModule : show :  }
 * @vevetModuleCallback { Vevet.MenuBaseModule : hide :  }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class MenuBaseModule extends Module {


    
    /**
     * @memberof Vevet.MenuBaseModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {boolean} [events=true] - Defines if events are active: click on the menu button.
     * 
     * @property {object} [selectors] - ***
     * @property {string|HTMLElement} [selectors.outer=.vevet-menu] -  The outer of the menu.
     * @property {string|HTMLElement} [selectors.button=.vevet-menu-button] - The button that opens the menu.
     * 
     * @property {object} [delays]
     * @property {number} [delays.show=0] - Delay before the menu starts opening.
     * @property {number} [delays.hide=0] - Delay before the menu starts closing.
     */
    /**
     * @alias Vevet.MenuBaseModule
     * 
     * @param {Vevet.MenuBaseModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}menu`;
    }

    /**
     * @readonly
     * @type {Vevet.MenuBaseModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
            events: true,
            selectors: {
                outer: `.${this._prefix}`,
                button: `.${this._prefix}-button`
            },
            delays: {
                show: 0,
                hide: 0
            }
        });

    }

    /**
     * @member Vevet.MenuBaseModule#prop
     * @memberof Vevet.MenuBaseModule
     * @readonly
     * @type {Vevet.MenuBaseModule.Properties}
     */

    /**
     * @member Vevet.MenuBaseModule#_prop
     * @memberof Vevet.MenuBaseModule
     * @protected
     * @type {Vevet.MenuBaseModule.Properties}
     */

    /**
     * @function Vevet.MenuBaseModule#changeProp
     * @memberof Vevet.MenuBaseModule
     * @param {Vevet.MenuBaseModule.Properties} [prop]
     */



    /**
     * @description If menu is shown.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get shown() {
        return this._shown;
    }



    // Extra Constructor
    _extra() {

        super._extra();

        /**
         * @description If menu is shown
         * @member {boolean}
         * @protected
         */
        this._shown = false;

        // get elements
        this._getElements();

    }

    /**
     * @description Get elements.
     * @protected
     */
    _getElements() {

        let selectors = this._prop.selectors;
        
        /**
         * @description Menu outer element.
         * @protected
         * @member {HTMLElement}
         */
        this._outer = selectEl.one(selectors.outer);
        /**
         * @description Menu button element.
         * @protected
         * @member {HTMLElement}
         */
        this._button = selectEl.one(selectors.button);

    }



    // Set listeners on elements.
    _setEvents() {

        super._setEvents();

        // button click
        if (this._button) {
            this.listener(this._button, 'click', this._buttonClick.bind(this));
        }

    }

    /**
     * @description Click on button.
     * @protected
     * @param {object} e
     */
    _buttonClick(e) {

        if (this._prop.events) {
            e.preventDefault();
            this.toggle();
        }

    }



    /**
     * @description Show the menu.
     * @returns {boolean} Returns true if the menu can be opened.
     */
    show() {

        if (this._shown) {
            return false;
        }

        return this.toggle();
        
    }

    /**
     * @description Hide the menu.
     * @returns {boolean} Returns true if the menu can be closed.
     */
    hide() {

        if (!this._shown) {
            return false;
        }

        return this.toggle();
        
    }

    /**
     * @description Show/Hide the menu.
     * @returns {boolean} Returns true if the menu can be opened or closed.
     */
    toggle() {

        let delays = this._prop.delays;

        // hide menu
        if (this._shown) {
            timeoutCallback(this._hide.bind(this), delays.hide);
        }
        // show menu
        else {
            timeoutCallback(this._show.bind(this), delays.show);
        }

        return true;
        
    }



    /**
     * @description Show the menu.
     * @protected
     */
    _show() {

        this.lbt("show");

        // change vars
        this._shown = true;

    }



    /**
     * @description Hide the menu.
     * @protected
     */
    _hide() {

        this.lbt("hide");

        // change vars
        this._shown = false;

    }



}