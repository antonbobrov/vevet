import Plugin from './Plugin';
import merge from './merge';

/**
 * @classdesc Pagination on scroll. This plugin traces the moment when pagunation links appear in the viewport
 * and loads new content. Notice, that the plugin also hides the pagination links. <br>
 * <br><br> <b>import {PaginationScrollPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 */
export default class PaginationScrollPlugin extends Plugin {


    
    /**
     * @memberof Vevet.PaginationScrollPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     */
    /**
     * @alias Vevet.PaginationScrollPlugin
     * @description Construct the class.
     * 
     * @param {Vevet.PaginationScrollPlugin.Properties} data - Object of data to construct the class.
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.PaginationScrollPlugin.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {});
    }

    /**
     * @member Vevet.PaginationScrollPlugin#prop
     * @memberof Vevet.PaginationScrollPlugin
     * @readonly
     * @type {Vevet.PaginationScrollPlugin.Properties}
     */

    /**
     * @member Vevet.PaginationScrollPlugin#_prop
     * @memberof Vevet.PaginationScrollPlugin
     * @protected
     * @type {Vevet.PaginationScrollPlugin.Properties}
     */

    /**
     * @function Vevet.PaginationScrollPlugin#changeProp
     * @memberof Vevet.PaginationScrollPlugin
     * @param {object} [prop]
     */

    /**
     * @member Vevet.PaginationScrollPlugin#_m
     * @memberof Vevet.PaginationScrollPlugin
     * @protected
     * @type {Vevet.PaginationModule}
     */


    
    // Extra for Constructor
    _extra() {

        super._extra();

        /**
         * @description Pagination UL element
         * @protected
         * @member {HTMLUListElement}
         */
        this._paginationUl = this._m.pagination;

        /**
         * @description If pagination is empty.
         * @protected
         * @member {boolean}
         */
        this._empty = false;
        this._emptyCheck();
        this._m.on("last", this._emptyCheck.bind(this));

        // set styles
        this._styles();

    }



    /**
     * @description Check if pagination is empty.
     * @protected
     */
    _emptyCheck() {

        if (this._m.active == this._m.max) {
            this._empty = true;
        }

    }



    /**
     * @description Apply styles.
     * @protected
     */
    _styles() {

        this._paginationUl.classList.remove("display-none_important");
        this._paginationUl.style.opacity = '0';
        this._paginationUl.style.overflow = 'hidden';
        this._paginationUl.style.width = '100%';
        this._paginationUl.style.height = '1px';


    }


    // Set events
    _setEvents() {

        super._setEvents();

        if (!this._empty) {
            var observer = new IntersectionObserver((entries) => {
                this._seek(entries);
            });
            observer.observe(this._paginationUl);
        }

    }



    /**
     * @description Seek the moment.
     * @param {Array<any>} entries - Entries.
     * @protected
     */
    _seek(entries) {
 
        // check if possible
        if (this._m._destroyed) {
            return;
        }
        if (this._empty) {
            return;
        }

        // do
        if (entries[0].intersectionRatio > 0) {
            this._m.load({
                num: true
            });
        }

    }



}