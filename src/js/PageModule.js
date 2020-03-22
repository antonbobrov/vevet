import Module from './Module';
import merge from './merge';

/**
 * @classdesc A class for creating a page. The goal of the class is to split code into four states: creating, showing, hiding and destroying the page.
 * When the page is destroyed, all event listeners added through {@linkcode Vevet.Module#_addEvent} and {@linkcode Vevet.Event#addEventListener} will be also removed.
 * When initializing the class, a new key (equal to the name property) with the value of the class will be added to {@linkcode Vevet.Application#pages}.
 * The page cannot be shown if it is not created, it cannot be hidden if it is not shown, etc. The order of methods must prevail: create -> show <-> hide -> destroy.<br>
 * Available targets:
 *  <ul>
 *      <li>create</li>
 *      <li>show</li>
 *      <li>hide</li>
 *      <li>destroy</li>
 *  </ul>
 * <br><br> <b>import {PageModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.PageModule : create :  }
 * @vevetModuleCallback { Vevet.PageModule : show :  }
 * @vevetModuleCallback { Vevet.PageModule : hide :  }
 * @vevetModuleCallback { Vevet.PageModule : destroy :  }
 * 
 * @class
 * @abstract
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class PageModule extends Module {


    
    /**
     * @memberof Vevet.PageModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string} [name=home] - *** Each page must have a name. Later, when using {@linkcode Vevet.PageAjaxModule} it will be very helpful. Names of each page mut be unique.
     */
    /**
     * @alias Vevet.PageModule
     * 
     * @param {Vevet.PageModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.PageModule.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            name: 'home'
        });
    }

    /**
     * @member Vevet.PageModule#prop
     * @memberof Vevet.PageModule
     * @readonly
     * @type {Vevet.PageModule.Properties}
     */

    /**
     * @member Vevet.PageModule#_prop
     * @memberof Vevet.PageModule
     * @protected
     * @type {Vevet.PageModule.Properties}
     */

    /**
     * @function Vevet.PageModule#changeProp
     * @memberof Vevet.PageModule
     * @param {Vevet.PageModule.Properties} [prop]
     */



    /**
     * @description If the page is created.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get created() {
        return this._created;
    }
    /**
     * @description If the page is shown.
     * @default false
     * @readonly
     * @type {number}
     */
    get shown() {
        return this._shown;
    }
    /**
     * @description If the page is hidden.
     * @default false
     * @readonly
     * @type {number}
     */
    get hidden() {
        return this._hidden;
    }
    /**
     * @description If the page is destroyed.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get destroyed() {
        return this._destroyed;
    }
    /**
     * @description Name of the page.
     * @readonly
     * @type {string}
     */
    get name() {
        return this._prop.name;
    }



    _extra() {

        super._extra();

        // variables
        this._initVars();

        // add the page to the stack
        this._v.vevetPages.push(this);

    }

    /**
     * @description Initialize variables.
     */
    _initVars() {

        /**
         * @description If the page is created.
         * @protected
         * @member {boolean}
         */
        this._created = false;
        /**
         * @description If the page is shown.
         * @protected
         * @member {boolean}
         */
        this._shown = false;
        /**
         * @description If the page is hidden.
         * @protected
         * @member {boolean}
         */
        this._hidden = false;
        /**
         * @description If the page is destroyed.
         * @protected
         * @member {boolean}
         */
        this._destroyed = false;

        /**
         * @description If the page is loaded through AJAX.
         * @protected
         * @member {boolean}
         */
        this._throughAjax = false;
        
    }



    /**
     * @description Create the page.
     * 
     * @param {boolean} [ajax=false] - Defines if the page was created through an ajax request. It may be helpful when using the class together with {@linkcode Vevet.PageAjaxModule}.
     * 
     * @returns {false|Vevet.PageModule} Returns false if the page is not created.
     */
    create(ajax = false) {

        if (!this.createCheck()) {
            return false;
        }

        // change vars
        this._created = true;
        this._shown = false;
        this._hidden = false;
        this._destroyed = false;

        this._throughAjax = ajax;

        // update page
        this._v.vevetPage = this;

        // launch event
        this.lbt('create');

        return this;

    }

    /**
     * @description Check if the page can be created.
     */
    createCheck() {

        if (this._created) {
            return false;
        }

        return true;

    }



    /**
     * @description Show the page.
     * 
     * @returns {boolean} Returns true if the page is shown successfully.
     */
    show() {

        if (!this.showCheck()) {
            return false;
        }

        // change vars
        this._created = true;
        this._shown = true;
        this._hidden = false;
        this._destroyed = false;

        // events
        this.lbt('show');

        return true;
        
    }

    /**
     * @description Check if the page can be shown.
     */
    showCheck() {

        if (!this._created) {
            return false;
        }
        if (this._shown) {
            return false;
        }

        return true;

    }



    /**
     * @description Hide the page.
     * 
     * @returns {boolean} Returns true if the page is hidden successfully.
     */
    hide() {

        if (!this.hideCheck()) {
            return false;
        }

        // change vars
        this._created = true;
        this._shown = false;
        this._hidden = true;
        this._destroyed = false;

        // events
        this.lbt('hide');

        return true;
        
    }

    /**
     * @description Check if the page can be hidden.
     */
    hideCheck() {

        if (!this._created) {
            return false;
        }
        if (!this._shown || this._hidden) {
            return false;
        }

        return true;

    }



    /**
     * @description Destroy the page.
     * 
     * @returns {boolean} Returns true if the page is destroyed successfully.
     */
    destroy() {

        if (!this.destroyCheck()) {
            return false;
        }
        super.destroy();

        // change vars
        this._initVars();

        // update page
        this._v.vevetPage = false;

        return true;
        
    }

    /**
     * @description Check if the page can be destroyed.
     */
    destroyCheck() {

        if (!this._created) {
            return false;
        }
        if (!this._hidden) {
            return false;
        }

        return true;

    }



    /**
     * @description Add a 'show' callback. If the callback was added after the page was shown, it will be triggered anyway.
     * @param {Function} callback
     * @param {Vevet.Event.EventObjSettings} [settings]
     * @returns {string} Returns a string with the callback's id.
     */
    onPageShown(callback, settings = {}) {
        return this.on("show", () => {
            callback();
        }, settings);
    }

    /**
     * @description Add a 'hide' callback. If the callback was added after the page was hidden, it will be triggered anyway.
     * @param {Function} callback
     * @param {Vevet.Event.EventObjSettings} [settings]
     * @returns {string} Returns a string with the callback's id.
     */
    onPageHidden(callback, settings = {}) {
        return this.on("hide", () => {
            callback();
        }, settings);
    }
    


}