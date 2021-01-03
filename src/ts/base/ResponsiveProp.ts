import { Application } from '../app/Application';
import mergeWithoutArrays from '../utils/common/mergeWithoutArrays';
import { NCallbacks } from './Callbacks';

/**
 * A class for creating mutable properties that change on window resize. <br><br>
 *
 * There are two ways to change properties:
 * <ul>
 *     <li>
 *         To set a resize-listener on window (or use {@linkcode Viewport}).
 *         When the window is resized, change the properties with the help of
 *         {@linkcode Module#changeProp}</li>
 *     <li>
 *         The second way is to use the property 'responsive'.
 *         In the property, set an object with the settings you would like to change.
 *         Responsive properties can be also changed through {@linkcode Module#changeProp},
 *         but they must be initialized on start.
 *         In case the properties are not initialized on start,
 *         they cannot be changed further.</li>
 * </ul>
 */
export class ResponsiveProp<
    /**
     * All Properties
     */
    AllProp extends Record<string, any>,
    /**
     * Responsive Properties (may change on window resize, a part of the first object)
     */
    ResProp extends Record<string, any>,
    /**
     * Properties that may be changed through {@linkcode Module#changeProp}
     * (a part of the first object)
     */
    ChangeableProp extends Record<string, any>
> {

    /**
     * Vevet Application.
     */
    protected _app: Application;

    /**
     * The properties that were set while initialization.
     * These properties do not change throughout time.
     */
    protected _initProp: AllProp;

    /**
     * @description Reference properties.
     * These properties may change only through {@linkcode ResponsiveProp#changeProp}.
     */
    protected _refProp: AllProp;

    /**
     * Current properties.
     * These properties may change both on {@linkcode ResponsiveProp#changeProp} and resize.
     */
    protected _prop: AllProp;

    /**
     * A set of responsive rules
     */
    protected _resRules: NResponsiveProp.Responsive<ResProp>[];

    /**
     * Get current properties
     */
    get prop () {
        return this._prop;
    }

    /**
     * Viewport callback
     */
    protected _viewportCallback: NCallbacks.AddedCallback;



    /**
     * @example
     * const static = {
     *      myProp: true,
     * };
     * const responsive = [
     *      {
     *          breakpoint: 'm',
     *          settings: {
     *              myProp: false
     *          }
     *      }
     * ];
     * const prop = new ResponsiveProp(static, responsive);
     */
    constructor (
        initialProp: AllProp = {} as AllProp,
        responsiveRules: NResponsiveProp.Responsive<ResProp>[] = [],
        /**
         * A callback that is launched when properties are changed on window resize
         */
        protected _onResponsive: () => void = () => {},
        /**
         * A callback that is launched when properties are changed
         * through {@linkcode ResponsiveProp#changeProp}
         */
        protected _onChange: (prop: ChangeableProp) => void = () => {},
        /**
         * Name of the responsive properties.
         */
        protected _name = 'Responsive Prop',
    ) {

        this._app = window.vevetApp;

        this._initProp = initialProp;
        this._refProp = mergeWithoutArrays({}, initialProp);
        this._prop = mergeWithoutArrays({}, initialProp);
        this._resRules = responsiveRules;

        // initialize responsive properties
        // and set events
        this._init();

    }



    /**
     * Initialize responsive properties.
     */
    protected _init () {

        // check if responsive properties exist
        if (this._resRules.length > 0) {
            // change properties according to the responsive prop
            this._responseProp();
            // add event on resize
            this._viewportCallback = this._app.viewport.add('w', this._responseProp.bind(this, true), {
                name: this._name,
            });
        }

    }

    /**
     * Change properties according to the "responsive" settings
     * @param onResize - If the method was called on window resize.
     */
    protected _responseProp (
        onResize = false,
    ) {

        const responsiveProp = this._resRules;

        // get sizes
        const { viewport } = this._app;
        const { width } = viewport;
        let newProp: AllProp = {} as AllProp;

        // go through all breakpoints
        // and check if a proper breakpoint exists
        let breakpointExists = false;
        responsiveProp.forEach((prop) => {

            // copy settings
            const { settings, breakpoint } = prop;

            // if the breakpoint is a number
            if (typeof breakpoint === 'number') {
                if (width <= prop.breakpoint) {
                    newProp = mergeWithoutArrays(newProp, settings);
                    breakpointExists = true;
                }
            }
            // if breakpoint is a string // desktop, tablet, mobile, mobiledevice
            else if (typeof breakpoint === 'string') {
                const string = breakpoint.toLowerCase();
                if (string === 'd' && viewport.isDesktop) {
                    newProp = mergeWithoutArrays(newProp, settings);
                    breakpointExists = true;
                }
                if (string === 't' && viewport.isTablet) {
                    newProp = mergeWithoutArrays(newProp, settings);
                    breakpointExists = true;
                }
                if (string === 'm' && viewport.isMobile) {
                    newProp = mergeWithoutArrays(newProp, settings);
                    breakpointExists = true;
                }
                if (string === 'md' && viewport.isMobileDevice) {
                    newProp = mergeWithoutArrays(newProp, settings);
                    breakpointExists = true;
                }
            }

        });

        // if there's no breakpoint, restore the props
        if (!breakpointExists) {
            this._prop = mergeWithoutArrays(this._prop, this._refProp);
        }
        // otherwise, change the properties
        else {
            this._prop = mergeWithoutArrays(this._prop, newProp);
        }

        // responsive callback
        if (onResize) {
            this._onResponsive();
        }

    }



    /**
     * This method allows you to change the properties manually.
     */
    public changeProp (
        prop: ChangeableProp,
    ) {

        this._prop = mergeWithoutArrays(this._prop, prop);
        this._refProp = mergeWithoutArrays(this._refProp, prop);

        // change prop callback
        this._onChange(prop);

    }



    /**
     * Destroy the responsive properties.
     */
    public destroy () {

        if (this._viewportCallback) {
            this._viewportCallback.remove();
        }

    }

}



/**
 * @namespace
 */
export namespace NResponsiveProp {

    export interface Responsive<S> {
        /**
         * Breakpoint on which the properties will change.
         * Available breakpoints:
         * <ul>
         *      <li>any number - width breakpoint</li>
         *      <li>'d' - for desktop only</li>
         *      <li>'t' - for tablets only</li>
         *      <li>'m' - for mobiles only</li>
         *      <li>'md' - for mobile devices</li>
         * </ul>
         */
        breakpoint: number | 'd' | 't' | 'm' | 'md';
        settings?: S;
    }

}
