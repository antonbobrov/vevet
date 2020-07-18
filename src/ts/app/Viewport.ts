import isMobileJs  from 'ismobilejs';
import { Callbacks } from '../base/Callbacks';

/**
 * Callbacks on window resize. 
 * Here the names of the OS, Browser, and Device are also available. <br>
 */
export class Viewport extends Callbacks<
    Callbacks.Prop<Viewport.Callbacks>, 
    Viewport.Callbacks
> {

    /**
     * Current Viewport size
     */
    protected _size: Viewport.Size;
    /**
     * Get current Viewport size
     */
    get size() {
        return this._size;
    }

    /**
     * Previous Viewport size
     */
    protected _prevSize: Viewport.Size;
    /**
     * Get previous Viewport size
     */
    get prevSize() {
        return this._prevSize;
    }

    /**
     * If width greater than height.
     */
    get isLandscape() {
        return this.size[0] > this.size[1];
    }
    /**
     * If width less than height.
     */
    get isPortrait() {
        return this.size[0] < this.size[1];
    }

    /**
     * If desktop size
     */
    protected _isDesktop: boolean;
    /**
     * If desktop size
     */
    get isDesktop() {
        return this._isDesktop;
    }
    /**
     * If tablet size
     */
    protected _isTablet: boolean;
    /**
     * If tablet size
     */
    get isTablet() {
        return this._isTablet;
    }
    /**
     * If mobile size
     */
    protected _isMobile: boolean;
    /**
     * If mobile size
     */
    get isMobile() {
        return this._isMobile;
    }

    /**
     * If mobile device.
     */
    protected _isMobileDevice: boolean;
    /**
     * If mobile device.
     */
    get isMobileDevice() {
        return this._isMobileDevice;
    }

    /**
     * Device pixel ratio
     */
    get dpr() {
        if(typeof window.devicePixelRatio != "undefined"){
            return window.devicePixelRatio;
        }
        return 1;
    }
    /**
     * Device pixel ratio. For non-mobile devices it is always 1.
     */
    get dprMobile() {
        if (this.isMobileDevice) {
            return this.dpr;
        }
        return 1;
    }


    
    // Extra constructor
    _constructor() {

        super._constructor();

        this._update();

    }

    // Set events on resize
    _setEvents() {

        window.addEventListener("resize", this._onResize.bind(this));

    }



    /**
     * Update viewport values
     */
    protected _update() {

        const app = this._app;
        const html = app.html;
        const appProp = app.prop;

        // set sizes
        this._size = [
            html.clientWidth,
            html.clientHeight
        ];
        this._prevSize = this._size.slice();

        // size values
        const width = this._size[0];
        this._isDesktop = width >= appProp.tablet;
        this._isTablet = width <= appProp.tablet && width > appProp.mobile;
        this._isMobile = width <= appProp.mobile;

        // mobile device
        const ifmobile = isMobileJs();
        this._isMobileDevice = (ifmobile.tablet || ifmobile.phone);
    
        // update other values
        this._updateClasses();

        this.addCallback({
            func: (data) => {
                data: ''
            }
        })

    }

    /**
     * Change classes of the document element.
     */
    _updateClasses() {

        const app = this._app;
        const appProp = app.prop;
        const html = app.html;
        const prefix = app.prefix;

        const width = this._size[0];

        // set viewport type
        const viewportSizeTypes: Viewport.SizeTypes[] = [
            Viewport.SizeTypes.Desktop, 
            Viewport.SizeTypes.Tablet, 
            Viewport.SizeTypes.Mobile
        ];
        if (this.isDesktop) {
            this._updateBreakpointClasses(Viewport.SizeTypes.Desktop, viewportSizeTypes);
        }
        else if (this.isTablet) {
            this._updateBreakpointClasses(Viewport.SizeTypes.Tablet, viewportSizeTypes);
        }
        else {
            this._updateBreakpointClasses(Viewport.SizeTypes.Mobile, viewportSizeTypes);
        }

        // set orientation type
        const orientationTypes: Viewport.OrientationTypes[] = [
            Viewport.OrientationTypes.Landscape,
            Viewport.OrientationTypes.Portrait
        ];
        if (this.isLandscape) {
            this._updateBreakpointClasses(Viewport.OrientationTypes.Landscape, orientationTypes);
        }
        else if (this.isPortrait) {
            this._updateBreakpointClasses(Viewport.OrientationTypes.Portrait, orientationTypes);
        }
        else {
            this._updateBreakpointClasses("", orientationTypes);
        }

        // mobile device
        const mobileDeviceClass = prefix + 'mobile-device';
        if (this.isMobileDevice) {
            html.classList.add(mobileDeviceClass);
        }
        else{
            html.classList.remove(mobileDeviceClass);
        }

    }

    /**
     *  Change breakpoint classes of the document element. 
     */
    _updateBreakpointClasses(activeType: string, types: string[]) {

        const html = this._app.html;
        const prefix = this._app.prefix;

        types.forEach(type => {
            if (type === activeType) {
                html.classList.add(prefix + type);
            }
            else {
                html.classList.remove(prefix + type);
            }
        });

    }



    /**
     * Launch callbacks on resize.
     */
    protected _onResize() {

        // copy previous values
        const sizePrev = this._prevSize.slice();

        // set viewport values
        this._update();

        // copy size
        const size = this._size;
        const width = size[0];
        const height = size[1];

        // only when width is changed
        if (width !== sizePrev[0] && height === sizePrev[1]) {
            this.tbt("w");
        }
        // only when height is changed
        if (height !== sizePrev[1] && width === sizePrev[0]) {
            this.tbt("h");
        }
        // when height & width are changed
        if (width !== sizePrev[0] && height !== sizePrev[1]) {
            this.tbt("wh");
            this.tbt("hw");
        }
        // when width is changed
        if (width !== sizePrev[0]) {
            this.tbt("w_");
        }
        // when height changed
        if (height !== sizePrev[1]) {
            this.tbt("h_");
        }

        // on any change
        this.tbt(undefined);

    }



}



export namespace Viewport {

    /**
     * Available callbacks
     */
    export type Callbacks = {
        /**
         * Only width changes
         */
        target: "w"
    } & CallbackFunc | {
        /**
         * Only height changes
         */
        target: "h"
    } & CallbackFunc | {
        /**
         * Both width and height change
         */
        target: "wh"
    } & CallbackFunc | {
        /**
         * Both width and height change
         */
        target: "hw"
    } & CallbackFunc | {
        /**
         * When width changes. Don't care about height
         */
        target: "w_"
    } & CallbackFunc | {
        /**
         * When height changes. Don't care width 
         */
        target: "h_"
    } & CallbackFunc | {
        /**
         * Any change
         */
        target?: undefined
    } & CallbackFunc;

    /**
     * Callback data with a function
     */
    type CallbackFunc = {
        func: (data: CallbackArg) => void
    } & Callbacks.CallbackBaseSettings;

    /**
     * Callbacks Argument
     */
    export interface CallbackArg {
        dpr: number;
        dprMobile: number;
        desktop: boolean;
        tablet: boolean;
        mobile: boolean;
        mobiledevice: boolean;
        landscape: boolean;
        portrait: boolean;
    }

    /**
     * Viewport size: width & height
     */
    export type Size = number[];
    /**
     * Viewport size types
     */
    export enum SizeTypes {
        Desktop = 'desktop', 
        Tablet = 'tablet', 
        Mobile = 'mobile'
    }
    /**
     * Orientation types
     */
    export enum OrientationTypes {
        Landscape = 'landscape', 
        Portrait = 'portrait'
    }

}