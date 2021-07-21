/* eslint-disable max-classes-per-file */
// import { detect } from 'detect-browser';
// import { Page } from '../components/page/Page';
// import { PageLoad } from './PageLoad';

import { EasingType } from 'easing-progress';
import { Viewport } from './events/Viewport';
import { PageLoad } from './events/PageLoad';



// const browser = detect();

interface Page {

}

const browser = '';

export namespace NApplication {

    /**
     * Properties
     */
    export type Prop = {
        /**
         * Page name
         * @default 'home'
         */
        pagename: string;
        /**
         * Tablet identification max width
         * @default 1199
         */
        tablet: number;
        /**
         * Mobile identification max width
         * @default 899
         */
        mobile: number;
        /**
         * Vevet prefix
         * @default 'v-'
         */
        prefix: string;
        /**
         * Maximum timeout of waiting for a response from an ajax request
         * @default 5000
         */
        maxAjaxTimeout: number;
        /**
         * Timeout of viewport callbacks
         * @default 0
         */
        viewportResizeTimeout: number;
        /**
         * Easing function that is used in animation as the default value
         * @default [.25, .1, .25, 1]
         */
        easing: EasingType;
    }

}



/**
 * Vevet Application
 */
export class Application <
    PageInstance extends Page = Page
> {
    /**
     * Application properties.
     */
    protected _prop: NApplication.Prop;

    /**
     * Application properties.
     */
    get prop () {
        return this._prop;
    }

    /**
     * Default properties.
     */
    get defaultProp (): NApplication.Prop {
        return {
            pagename: 'home',
            tablet: 1199,
            mobile: 899,
            prefix: 'v-',
            maxAjaxTimeout: 5000,
            easing: [0.25, 0.1, 0.25, 1],
            viewportResizeTimeout: 0,
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
     *     page: 'home'
     * });
     */
    constructor (
        data: Partial<NApplication.Prop> = {},
    ) {
        this._prop = {
            ...this.defaultProp,
            ...data,
        };
        this._prefix = this.prop.prefix;

        // initialize the application
        // Define that you're using Vevet
        this._sayHi();

        // set current page name
        this._pagename = this.prop.pagename;

        // add the application to the window
        window.vevetApp = this;

        // create default helpers
        this._pageLoad = new PageLoad();
        this._viewport = new Viewport();
    }



    /**
     * Get document element.
     */
    get doc () {
        return document;
    }

    /**
     * Get HTML element
     */
    get html () {
        return document.documentElement;
    }

    /**
     * Get body element.
     */
    get body () {
        return document.body;
    }



    /**
     * Name of the current page.
     */
    protected _pagename = '';

    /**
     * Get name of the page.
     */
    get pagename () {
        return this._pagename;
    }

    /**
     * Check if the current page has the same name.
     */
    isPageName (val: string): boolean {
        return this._pagename === val;
    }

    /**
     * Set name of the page
     */
    protected _setPageName (name: string) {
        // remove old classes
        this.html.classList.remove(`${this.prefix}page_${this.pagename}`);

        // set classes & push to pages
        this.html.classList.add(`${this.prefix}page_${name}`);

        // replace pages array
        this._pagename = name;
    }



    /**
     * Pages (modules).
     */
    protected _pages: PageInstance[] = [];

    /**
     * Get an array of existing pages.
     * A new element is added to the array when {@linkcode Vevet.Page.create} is called.
     */
    get pages () {
        return this._pages;
    }

    /**
     * Current Page (module).
     */
    protected _page: false | PageInstance = false;

    /**
     * Get the current page module.
     */
    get page () {
        return this._page;
    }

    /**
     * Set the current page module.
     */
    set page (val: false | PageInstance) {
        this._page = val;
    }



    /**
     * Page Load Callbacks
     */
    protected _pageLoad: PageLoad;

    /**
     * Get Page Load Callbacks
     */
    get pageLoad () {
        return this._pageLoad;
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
     * Get agent info
     */
    get agent () {
        return browser;
    }



    /**
     * Defines that you're using Vevet.
     */
    protected _sayHi () {
        const msg = 'Vevet';

        const style = [
            'padding: 1rem 1.5rem;',
            'background: #5F2580;',
            'font: 1rem/1 Arial;',
            'color: #ffffff;',
        ].join('');

        // eslint-disable-next-line no-console
        console.log('%c%s', style, msg);
    }
}

declare global {
    interface Window {
        vevetApp: Application<Page>;
    }
}
