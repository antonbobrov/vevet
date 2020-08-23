import { Load } from "./Load";
import { Viewport } from "./Viewport";

/**
 * Vevet Application
 */
export class Application {

    /**
     * Application properties.
     */
    protected _prop: IApplication.Prop;
    /**
     * Application properties.
     */
    get prop () {
        return this._prop;
    }
    /**
     * Default properties.
     */
    get defaultProp (): IApplication.Prop {
        return {
            page: "home-page",
            tablet: 1199,
            mobile: 899,
            prefix: "v-",
            prefixData: "data-vevet-",
            prefixProp: "vevet-",
            maxAjaxTimeout: 5000,
            easing: [0.25, 0.1, 0.25, 1],
        };
    }

    /**
     * Application prefix.
     */
    protected _prefix: string;
    /**
     * Get Vevet prefix
     */
    get prefix () {
        return this._prefix;
    }

    /**
     * @example
     * const app = Application({
     *     page: 'home-page'
     * });
     */
    constructor (data: IApplication.Prop) {

        this._prop = Object.assign(this.defaultProp, data);
        this._prefix = this.prop.prefix;

        // initialize the application
        this._init();

    }



    /**
     * Document element.
     */
    protected _doc = document;
    /**
     * Get document element.
     */
    get doc () {
        return this._doc;
    }

    /**
     * HTML element.
     */
    protected _html = document.documentElement;
    /**
     * Get HTML element
     */
    get html () {
        return this._html;
    }

    /**
     * Body element.
     */
    protected _body = document.body;
    /**
     * Get body element.
     */
    get body () {
        return this._body;
    }



    /**
     * Name of the current page.
     */
    protected _page = "";
    /**
     * Set page name.
     */
    set page (name: string) {
        this._setPageName(name);
    }
    /**
     * Get name of the page.
     */
    get page () {
        return this._page;
    }
    /**
     * Check if the current page has the same name.
     */
    isPageName (val: string): boolean {
        return this._page === val;
    }



    /**
     * Pages (Modules).
     */
    protected _vevetPages: [] = [];
    /**
     * Get an array of existing pages.
     * A new element is added to the array when {@linkcode Vevet.Page#create} is called.
     */
    get vevetPages () {
        return this._vevetPages;
    }

    /**
     * Current Page Module.
     */
    protected _vevetPage: false | HTMLElement = false;
    /**
     * Get the current page module.
     */
    get vevetPage () {
        return this._vevetPage;
    }



    /**
     * Page Load Callbacks
     */
    protected _load: Load;
    /**
     * Get Page Load Callbacks
     */
    get load () {
        return this._load;
    }

    /**
     * Viewport Callbacks
     */
    protected _viewport: Viewport;
    /**
     * Get Viewport Callbacks
     */
    get viewport () {
        return this._viewport;
    }



    /**
     * @description Initialize the class
     * @private
     */
    protected _init () {

        // Define that you're using Vevet
        this._sayHi();

        // set current page name
        this.page = this.prop.page;

        // add the application to the window object
        window.vevetApplication = this;

        // /**
        //  * @type {string}
        //  * @private
        //  */
        // this._browser = getBrowserName();
        // /**
        //  * @type {string}
        //  * @private
        //  */
        // this._os = getOsName();

        // create default helpers
        this._load = new Load();
        this._viewport = new Viewport();

        // /**
        //  * @member {Vevet.URLEvent}
        //  */
        // this.url = new URLEvent({
        //     v: this
        // });

        // /**
        //  * @member {Vevet.AJAXEvent}
        //  */
        // this.ajax = new AJAXEvent({
        //     v: this
        // });

    }



    /**
     * Defines that you're using Vevet.
     */
    protected _sayHi () {

        const msg = "Vevet";

        const style = [
            "padding: 1rem 1.5rem;",
            "background: #5F2580;",
            "font: 1rem/1 Arial;",
            "color: #ffffff;",
        ].join("");

        // eslint-disable-next-line no-console
        console.log("%c%s", style, msg);

    }



    /**
     * Set name of the page
     */
    protected _setPageName (name: string) {

        // remove old classes
        this._html.classList.remove(`${this._prefix}page_${this._page}`);

        // set classes & push to pages
        this._html.classList.add(`${this._prefix}page_${name}`);

        // replace pages array
        this._page = name;

    }



    // /**
    //  * @description Get browser name and set it as a class to the HTML element.
    // See {@linkcode Vevet.getBrowserName}
    //  * @readonly
    //  * @type {string}
    //  */
    // get browser() {

    //     this._html.classList.remove(`${this._prefix}browser_${this._browser}`);
    //     this._browser = getBrowserName();
    //     this._html.classList.add(`${this._prefix}browser_${this._browser}`);

    //     return this._browser;

    // }

    // /**
    //  * @description Get the operating system name and set it as a class
    // to the HTML element. See {@linkcode Vevet.getOSName}
    //  * @readonly
    //  * @type {string}
    //  */
    // get os() {

    //     this._html.classList.remove(`${this._prefix}os_${this._os}`);
    //     this._os = getOsName();
    //     this._html.classList.add(`${this._prefix}os_${this._os}`);

    //     return this._os;

    // }

}



declare global {
    interface Window {
        vevetApplication: Application;
    }
}



/**
 * @namespace
 */
export namespace IApplication {

    /**
     * Properties
     */
    export type Prop = {
        /**
         * Page name
         * @default 'home-page'
         */
        page?: string;
        /**
         * Tablet identification max width
         * @default 1199
         */
        tablet?: number;
        /**
         * Mobile identification max width
         * @default 899
         */
        mobile?: number;
        /**
         * Vevet prefix
         * @default 'vevet-'
         */
        prefix?: string;
        /**
         * Prefix for data attributes in modules
         * @default 'data-vevet-'
         */
        prefixData?: string;
        /**
         * Prefix for properties in modules
         * @default 'vevet-''
         */
        prefixProp?: string;
        /**
         * Maximum timeout of waiting for a response from an ajax request
         * @default 5000
         */
        maxAjaxTimeout?: number;
        /**
         * Easing function that is used in animation as the default value
         * @default [.25, .1, .25, 1]
         */
        easing?: number[] | string | ((p: number) => number);
    }

}
