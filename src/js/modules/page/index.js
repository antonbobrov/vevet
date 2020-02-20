import Module from '../../Module';
import utils from '../../core/utils';

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
 * <br><br> <b>import {Page} from 'vevet';</b>
 * 
 * @class
 * @abstract
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class Page extends Module {


    
    /**
     * @memberof Vevet.Page
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string} [name=home] - *** Each page must have a name. Later, when using {@linkcode Vevet.PageAjax} it will be very helpful. Names of each page mut be unique.
     */
    /**
     * @alias Vevet.Page
     * 
     * @param {Vevet.Page.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.Page.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            name: 'home'
        });
    }

    /**
     * @member Vevet.Page#prop
     * @memberof Vevet.Page
     * @readonly
     * @type {Vevet.Page.Properties}
     */

    /**
     * @member Vevet.Page#_prop
     * @memberof Vevet.Page
     * @protected
     * @type {Vevet.Page.Properties}
     */

    /**
     * @function Vevet.Page#changeProp
     * @memberof Vevet.Page
     * @param {Vevet.Page.Properties} [prop]
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

        // add page to the stack
        this._v.vevetPages.push(this);

    }

    _initVars() {

        this._created = false;
        this._shown = false;
        this._hidden = false;
        this._destroyed = false;

        this._throughAjax = false;
        
    }



    /**
     * @description Create the page.
     * 
     * @param {boolean} [ajax=false] - Defines if the page was created through an ajax request. It may be helpful when using the class together with {@linkcode Vevet.PageAjax}.
     * 
     * @returns {boolean|Vevet.Page} Returns false if the page is not created.
     */
    create(ajax = false) {

        if (!this._createCheck()) {
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
    _createCheck() {

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

        if (!this._showCheck()) {
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
    _showCheck() {

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

        if (!this._hideCheck()) {
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
    _hideCheck() {

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

        if (!this._destroyCheck()) {
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
    _destroyCheck() {

        if (!this._created) {
            return false;
        }
        if (!this._hidden) {
            return false;
        }

        return true;

    }
    


}