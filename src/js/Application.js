import EventLoad from './EventLoad';
import EventViewport from './EventViewport';
import EventURL from './EventURL';
import EventAJAX from './EventAJAX';
import getBrowserName from './getBrowserName';
import getOsName from './getOsName';
import { getOSName } from './index';

/**
 * @classdesc Vevet Application
 * <br><br> <b>import {Application} from 'vevet';</b>
 * @class
 * @memberof Vevet
 */
export default class Application {



    /**
     * @typedef {object} Vevet.Application.Properties
     * @property {Array<string>} [page=['home']] - An array of page codes.
     * @property {number} [tablet=1199] - Maximum window width for tablets.
     * @property {number} [mobile=899] - Maximum window width for mobiles.
     * @property {string} [prefix=vevet-] - Prefix for modules.
     * @property {string} [prefixData=data-vevet-] - Prefix for data attributes in modules.
     * @property {string} [prefixProp=vevet-] - Prefix for properties in modules.
     * @property {number} [ajaxTimeMax=5000] - Maximum timeout waiting for a response from an ajax request.
     * @property {string|Array<number>|Function} [easing=[.25, .1, .25, 1]] - Easing function that is used in animation as a default value. See {@linkcode Vevet.easing}.
     */
    /**
     * @alias Vevet.Application
     * 
     * @param {Vevet.Application.Properties} [data]
     * 
     * @example
     * let app = new Vevet.Application({
     *     page: ['home', 'nofooter']
     * });
     */
    constructor(data = {}) {

        /**
         * @type {Vevet.Application.Properties}
         */
        this.prop = Object.assign(this.defaultProp, data);

        /**
         * @description Application prefix.
         * @type {string}
         * @private
         */
        this._prefix = this.prop.prefix;

        // initialize application
        this._init();

    }

    /**
     * @description Get default properties.
     * @readonly
     * @type {Vevet.Application.Properties}
     */
    get defaultProp() {
        return {
            page: ['home'],
            tablet: 1199,
            mobile: 899,
            prefix: `vevet-`,
            prefixData: `data-vevet-`,
            prefixProp: `vevet-`,
            ajaxTimeMax: 5000,
            easing: [.25, .1, .25, 1]
        };
    }

    /**
     * @description Document
     * @default document
     * @readonly
     * @type {Document}
     */
    get doc() {
        return this._doc;
    }

    /**
     * @description HTML element
     * @default document.documentElement
     * @readonly
     * @type {HTMLElement}
     */
    get html() {
        return this._html;
    }

    /**
     * @description Body
     * @default document.body
     * @readonly
     * @type {HTMLElement}
     */
    get body() {
        return this._body;
    }

    /**
     * @description Vevet prefix. See {@linkcode Vevet.Application#prop};
     * @readonly
     * @type {string}
     */
    get prefix() {
        return this._prefix;
    }

    /**
     * @description Easing function that is used in animation as a default value. See {@linkcode Vevet.easing} & {@linkcode Vevet.Application#prop}.
     * @readonly
     * @default [.25, .1, .25, 1]
     * @type {string|Array<number>|Function}
     */
    get easing() {
        return this.prop.easing;
    }



    /**
     * @description Initialize the class
     * @private
     */
    _init() {

        // Define that we're using Vevet
        this._hi();

        /**
         * @type {object}
         * @private
         */
        this._doc = document;
        /**
         * @type {HTMLElement}
         * @private
         */
        this._html = document.documentElement;
        /**
         * @type {HTMLElement}
         * @private
         */
        this._body = document.body;
        /**
         * @type {Array<string>}
         * @private
         */
        this._page = [];
        this.page = this.prop.page;
        /**
         * @type {string}
         * @private
         */
        this._browser = getBrowserName();
        /**
         * @type {string}
         * @private
         */
        this._os = getOsName();

        /**
         * @member {Vevet.EventLoad}
         */
        this.load = new EventLoad({
            v: this
        });

        /**
         * @member {Vevet.EventViewport}
         */
        this.viewport = new EventViewport({
            v: this
        });

        /**
         * @member {Vevet.EventURL}
         */
        this.url = new EventURL({
            v: this
        });

        /**
         * @member {Vevet.EventAJAX}
         */
        this.ajax = new EventAJAX({
            v: this
        });
        
        /**
         * @description An array of existing pages.
         * A new element is added to the array when {@linkcode Vevet.Page#create} is called.
         * @type {Array<Vevet.Page>}
         */
        this.vevetPages = [];
        /**
         * @description The active page. See {@linkcode Vevet.Page}.
         * Its value is false when no page is active and {@linkcode Vevet.Page}
         * if a page is created through {@linkcode Vevet.Page#create}
         * @type {Vevet.Page|boolean}
         */
        this.vevetPage = false;

        // add to the window object
        window.vevetApplication = this;

    }

    

    /**
     * @description Defines that you're using Vevet.
     * @private
     */
    _hi() {

        let msg = 'Vevet';
        
        var style = [
            'padding: 1rem 1.5rem;',
            'background: #5F2580;',
            `font: 1rem/1 Arial;`,
            'color: #ffffff;',
        ].join('');
        
        console.log('%c%s', style, msg);

    }



    /**
     * @description Get/Set page names.
     * 
     * @param {Array<string>} [val=['home']] - An array with page names.
     * @type {Array<string>}
     */
    set page(val = ['home']) {
    
        // remove old classes
        for (let i = 0; i < this._page.length; i++) {
            this._html.classList.remove(`${this._prefix}page_${this._page[i]}`);
        }
    
        // set classes & push to pages
        for (let i = 0; i < val.length; i++) {
            this._html.classList.add(`${this._prefix}page_${val[i]}`);
        }
    
        // replace pages array
    
        this._page = val;
    
    }

    get page() {
        return this._page;
    }

    /**
     * @description Check if page is set.
     * 
     * @param {string} [val=''] - A string containing a pagename.
     * 
     * @returns {boolean} Returns true if page is set.
     */
    pageCheck(val = '') {
        return this._page.includes(val);
    }



    /**
     * @description Get browser name and set it as a class to the HTML element. See {@linkcode Vevet.getBrowserName}
     * @readonly
     * @type {string}
     */
    get browser() {

        this._html.classList.remove(`${this._prefix}browser_${this._browser}`);
        this._browser = getBrowserName();
        this._html.classList.add(`${this._prefix}browser_${this._browser}`);
    
        return this._browser;
    
    }



    /**
     * @description Get the operating system name and set it as a class to the HTML element. See {@linkcode Vevet.getOSName}
     * @readonly
     * @type {string}
     */
    get os() {

        this._html.classList.remove(`${this._prefix}os_${this._os}`);
        this._os = getOSName();
        this._html.classList.add(`${this._prefix}os_${this._os}`);
    
        return this._os;
    
    }


    
}