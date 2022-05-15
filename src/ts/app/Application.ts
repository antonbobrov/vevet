import isMobileJs from 'ismobilejs';
import { EasingType } from 'easing-progress';
import { detect } from 'detect-browser';
import PCancelable from 'p-cancelable';
import { Viewport } from './events/Viewport';
import { PageLoad } from './events/PageLoad';
import { Page } from '../components/page/Page';
import version from '../version';



export namespace NApplication {

    /**
     * Properties
     */
    export type Prop = {
        sayHi: boolean;
        /**
         * Tablet identification max width
         * @default 1199
         */
        tablet: number;
        /**
         * Phone identification max width
         * @default 899
         */
        phone: number;
        /**
         * Vevet prefix
         * @default 'v-'
         */
        prefix: string;
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
        /**
         * Check if the browser supports WebP
         * @default false
         */
        webpSupport: boolean;
    }

}



/**
 * Vevet Application
 */
export class Application <
    PageInstance extends Page = Page
> {
    get version () {
        return version;
    }

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
            sayHi: true,
            tablet: 1199,
            phone: 899,
            prefix: 'v-',
            easing: [0.25, 0.1, 0.25, 1],
            viewportResizeTimeout: 0,
            webpSupport: false,
        };
    }

    /**
     * Vevet prefix.
     */
    protected _prefix: string;
    get prefix () {
        return this._prefix;
    }

    /**
     * If is phone
     */
    protected _isPhone: boolean;
    get isPhone () {
        return this._isPhone;
    }

    /**
     * If tablet
     */
    protected _isTablet: boolean;
    get isTablet () {
        return this._isTablet;
    }

    /**
     * If mobile device
     */
    protected _isMobile: boolean;
    get isMobile () {
        return this._isMobile;
    }

    /**
     * If desktop device
     */
    protected _isDesktop: boolean;
    get isDesktop () {
        return this._isDesktop;
    }



    /**
     * OS name
     */
    protected _osName: string;
    get osName () {
        return this._osName;
    }

    /**
     * OS name
     */
    protected _browserName: string;
    get browserName () {
        return this._browserName;
    }



    /**
     * WebP Support
     */
    protected _supportsWebp?: boolean;
    get supportsWebp () {
        return this._supportsWebp;
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
        // check if the application already exists
        if (window.vevetApp) {
            throw new Error('Vevet Application already exists!');
        }

        // set defaults
        this._prop = {
            ...this.defaultProp,
            ...data,
        };
        this._prefix = this.prop.prefix;

        // initialize the application
        // Define that you're using Vevet
        this._sayHi();

        // add the application to the window
        window.vevetApp = this;

        // get type of device
        const ifmobile = isMobileJs();
        this._isPhone = ifmobile.phone;
        this.html.classList.toggle(`${this.prefix}phone`, this._isPhone);
        this._isTablet = ifmobile.tablet;
        this.html.classList.toggle(`${this.prefix}tablet`, this._isTablet);
        this._isMobile = ifmobile.phone || ifmobile.tablet;
        this.html.classList.toggle(`${this.prefix}mobile`, this._isMobile);
        this._isDesktop = !this._isMobile;
        this.html.classList.toggle(`${this.prefix}desktop`, this._isDesktop);

        // get browser info
        const browserData = detect();
        // get OS name
        if (browserData?.os) {
            const osName = browserData.os.split(' ')[0].toLowerCase();
            this.html.classList.add(`${this.prefix}os-${osName}`);
            this._osName = osName;
        } else {
            this._osName = '';
        }
        // get browser name
        if (browserData?.name) {
            const browserName = browserData.name.toLowerCase();
            this.html.classList.add(`${this.prefix}browser-${browserName}`);
            this._browserName = browserName;
        } else {
            this._browserName = '';
        }
        // browserData

        // create default helpers
        this._pageLoad = new PageLoad();
        this._viewport = new Viewport();

        // check webp support
        if (this.prop.webpSupport) {
            const testWebP = new Image();
            testWebP.onload = () => {
                this._supportsWebp = testWebP.width === 1;
            };
            testWebP.onerror = () => {
                this._supportsWebp = false;
            };
            testWebP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
        } else {
            this._supportsWebp = false;
        }
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
     * Pages (instances)
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
     * Current Page (instance).
     */
    protected _page: false | PageInstance = false;
    /**
     * Get the current page instance.
     */
    get page () {
        return this._page;
    }
    /**
     * Set the current page instance.
     */
    set page (val: false | PageInstance) {
        this._page = val;
    }

    /**
     * Action on page created
     */
    public onPageCreated () {
        return new PCancelable((
            resolve: (page: PageInstance) => void,
        ) => {
            if (this._page) {
                this._page.onCreate().then(() => {
                    resolve(this.page as PageInstance);
                });
                return;
            }
            setTimeout(() => {
                this.onPageCreated().then(() => {
                    resolve(this.page as PageInstance);
                });
            }, 30);
        });
    }

    /**
     * Action on page shown
     */
    public onPageShown () {
        return new PCancelable((
            resolve: (page: PageInstance) => void,
        ) => {
            this.onPageCreated().then(() => {
                if (this._page) {
                    this._page.onShow().then(() => {
                        resolve(this.page as PageInstance);
                    });
                }
            });
        });
    }



    /**
     * Page Load Callbacks
     */
    protected _pageLoad: PageLoad;
    get pageLoad () {
        return this._pageLoad;
    }

    /**
     * Action on page laoded
     */
    public onPageLoaded () {
        return new PCancelable((
            resolve: (...arg: any) => void,
        ) => {
            this._pageLoad.onLoaded(() => {
                resolve();
            });
        });
    }

    /**
     * Viewport Callbacks
     */
    protected _viewport: Viewport;
    get viewport () {
        return this._viewport;
    }



    /**
     * Defines that you're using Vevet.
     */
    protected _sayHi () {
        if (!this.prop.sayHi) {
            return;
        }

        const msg = `Vevet ${this.version}`;

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
