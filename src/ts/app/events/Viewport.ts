import { Callbacks, NCallbacks } from '../../base/Callbacks';
import { timeoutCallback } from '../../utils/common';



export namespace NViewport {

    /**
     * Callbacks argument. Changes in viewport
     */
    export interface Changes {
        widthChanged: boolean;
        heightChanged: boolean;
        orientationChanged: boolean;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NCallbacks.CallbacksTypes {
        /**
         * When the width is changed regardless of the height
         */
        'w': Changes;
        /**
         * When the height is changed regardless of the width
         */
        'h': Changes;
        /**
         * When both the width and height are changed
         */
        'wh': Changes;
        /**
         * When both the width and height are changed
         */
        'hw': Changes
        /**
         * When only the width is changed
         */
        'w_': Changes;
        /**
         * When only the height is changed
         */
        'h_': Changes;
        /**
         * Any change
         */
        '': Changes;
    }

}

/**
 * Viewport size types
 */
enum SizeTypes {
    Desktop = 'desktop',
    Tablet = 'tablet',
    Phone = 'phone'
}

/**
 * Orientation types
 */
enum OrientationTypes {
    Landscape = 'landscape',
    Portrait = 'portrait'
}



/**
 * Callbacks on window resize.
 * Here the names of the OS, Browser, and Device are also available. <br>
 */
export class Viewport extends Callbacks<
    NViewport.CallbacksTypes
> {
    /**
     * Current Viewport width
     */
    protected _width: number;
    get width () {
        return this._width;
    }

    /**
     * Current Viewport height
     */
    protected _height: number;
    get height () {
        return this._height;
    }

    /**
     * Get VW value
     */
    get vw () {
        return this.width / 100;
    }
    /**
     * Get VH value
     */
    get vh () {
        return this.height / 100;
    }

    /**
     * Previous Viewport size
     */
    protected _prevSize: {
        w: number;
        h: number;
    };

    /**
     * Get previous Viewport size
     */
    get prevSize () {
        return this._prevSize;
    }

    /**
     * If width greater than height.
     */
    get isLandscape () {
        return this.width > this.height;
    }

    /**
     * If width less than height.
     */
    get isPortrait () {
        return this.width < this.height;
    }

    /**
     * If desktop size
     */
    protected _isDesktop: boolean;
    get isDesktop () {
        return this._isDesktop;
    }

    /**
     * If tablet size
     */
    protected _isTablet: boolean;
    get isTablet () {
        return this._isTablet;
    }

    /**
     * If phone size
     */
    protected _isPhone: boolean;
    get isPhone () {
        return this._isPhone;
    }

    /**
     * Device pixel ratio
     */
    get dpr () {
        if (typeof window.devicePixelRatio !== 'undefined') {
            return window.devicePixelRatio;
        }
        return 1;
    }

    /**
     * Device pixel ratio. For non-mobile devices it is always 1.
     */
    get lowerDesktopDPR () {
        if (this._app.isDesktop) {
            return 1;
        }
        return this.dpr;
    }

    protected _resizeTimeout?: ReturnType<typeof timeoutCallback>;



    constructor () {
        super(false);
        this._width = 0;
        this._height = 0;
        this._prevSize = { w: 0, h: 0 };
        this._isDesktop = false;
        this._isTablet = false;
        this._isPhone = false;
        this._init();
    }

    // Extra constructor
    protected _constructor () {
        super._constructor();
        this._setValues();
    }

    // Set events on resize
    protected _setEvents () {
        window.addEventListener('resize', () => {
            if (this._resizeTimeout) {
                this._resizeTimeout.clear();
            }
            this._resizeTimeout = timeoutCallback(() => {
                this._onResize();
            }, this._app.prop.viewportResizeTimeout);
        });
    }



    /**
     * Set viewport values
     */
    protected _setValues () {
        const app = this._app;
        const { html } = app;
        const appProp = app.prop;

        // set sizes
        this._width = html.clientWidth;
        this._height = html.clientHeight;
        this._prevSize = {
            w: this._width,
            h: this._height,
        };

        // size values
        const { width } = this;
        this._isDesktop = width >= appProp.tablet;
        this._isTablet = width <= appProp.tablet && width > appProp.phone;
        this._isPhone = width <= appProp.phone;

        // update other values
        this._updateClasses();
        this._updateCSSVars();
    }



    /**
     * Change classes of the document element.
     */
    protected _updateClasses () {
        // set viewport type
        const viewportSizeTypes: SizeTypes[] = [
            SizeTypes.Desktop,
            SizeTypes.Tablet,
            SizeTypes.Phone,
        ];
        if (this.isDesktop) {
            this._updateBreakpointClasses(
                SizeTypes.Desktop,
                viewportSizeTypes,
            );
        } else if (this.isTablet) {
            this._updateBreakpointClasses(
                SizeTypes.Tablet,
                viewportSizeTypes,
            );
        } else {
            this._updateBreakpointClasses(
                SizeTypes.Phone,
                viewportSizeTypes,
            );
        }

        // set orientation type
        const orientationTypes: OrientationTypes[] = [
            OrientationTypes.Landscape,
            OrientationTypes.Portrait,
        ];
        if (this.isLandscape) {
            this._updateBreakpointClasses(
                OrientationTypes.Landscape,
                orientationTypes,
            );
        } else if (this.isPortrait) {
            this._updateBreakpointClasses(
                OrientationTypes.Portrait,
                orientationTypes,
            );
        } else {
            this._updateBreakpointClasses('', orientationTypes);
        }
    }

    /**
     *  Change breakpoint classes of the document element.
     */
    protected _updateBreakpointClasses (
        activeType: string,
        types: string[],
    ) {
        const { html } = this._app;
        const { prefix } = this._app;

        types.forEach((type) => {
            if (type === activeType) {
                html.classList.add(`${prefix}viewport-${type}`);
            } else {
                html.classList.remove(`${prefix}viewport-${type}`);
            }
        });
    }


    /**
     * Update CSS vars
     */
    protected _updateCSSVars () {
        const { html } = this._app;
        html.style.setProperty('--vw', `${this.vw}px`);
        html.style.setProperty('--vh', `${this.vh}px`);
    }



    /**
     * Launch callbacks on resize.
     */
    protected _onResize (
        /**
         * force all callbacks
         */
        force = false,
    ) {
        // copy previous values
        const prevWidth = this._prevSize.w;
        const prevHeight = this._prevSize.h;

        // set viewport values
        this._setValues();

        // copy size
        const { width, height } = this;

        // get changes in viewport
        const changes: NViewport.Changes = {
            widthChanged: width !== prevWidth,
            heightChanged: height !== prevHeight,
            orientationChanged: (width > height) !== (prevWidth > prevHeight),
        };

        // only when width is changed
        if (force || (width !== prevWidth && height === prevHeight)) {
            this.tbt('w_', changes);
        }
        // only when height is changed
        if (force || (height !== prevHeight && width === prevWidth)) {
            this.tbt('h_', changes);
        }
        // when height & width are changed
        if (force || (width !== prevWidth && height !== prevHeight)) {
            this.tbt('wh', changes);
            this.tbt('hw', changes);
        }
        // when width is changed
        if (force || width !== prevWidth) {
            this.tbt('w', changes);
        }
        // when height changed
        if (force || height !== prevHeight) {
            this.tbt('h', changes);
        }

        // on any change
        this.tbt('', changes);
    }

    /**
     * Force launching all callbacks
     */
    public forceResize () {
        this._onResize(true);
    }
}

