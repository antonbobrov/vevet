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
     * Static Properties (they cannot be changed on viewport resize)
     */
    StatProp extends Record<string, any>,
    /**
     * Mutable Properties
     */
    ResProp extends Record<string, any>
> {

    /**
     * Vevet Application.
     */
    protected _app: Application;

    /**
     * A callback that is launched when properties are changed
     * through {@linkcode ResponsiveProp#changeProp}
     */
    protected _onChange: () => void;

    /**
     * A callback that is launched when properties are changed on window resize
     */
    protected _onResponsive: () => void;

    /**
     * Name of the responsive properties.
     */
    protected _name: string;

    /**
     * The properties that were set while initialization.
     * These properties do not change throughout time.
     */
    protected _initProp: (StatProp & ResProp & NResponsiveProp.Prop<ResProp>);

    /**
     * @description Reference properties.
     * These properties may change only through {@linkcode ResponsiveProp#changeProp}.
     */
    protected _refProp: (StatProp & ResProp & NResponsiveProp.Prop<ResProp>);

    /**
     * Current properties.
     * These properties may change both on resize and {@linkcode ResponsiveProp#changeProp}.
     */
    protected _prop: (StatProp & ResProp & NResponsiveProp.Prop<ResProp>);

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
     * const data = {
     *      myProp: true,
     *      responsive: [
     *          {
     *              breakpoint: 'm',
     *              settings: {
     *                  myProp: false
     *              }
     *          }
     *      ]
     * };
     * const prop = new ResponsiveProp(data);
     */
    constructor (
        data: (
            StatProp & ResProp & NResponsiveProp.Prop<ResProp>
        ) = {} as (
            StatProp & ResProp & NResponsiveProp.Prop<ResProp>
        ),
        onChange: () => void = () => {},
        onResponsive: () => void = () => {},
        name = '',
    ) {

        this._app = window.vevetApp;
        this._onChange = onChange;
        this._onResponsive = onResponsive;
        this._name = `${this.constructor.name} ${name}`;

        this._initProp = data;
        this._initProp = data;
        this._refProp = mergeWithoutArrays({}, data);
        this._prop = mergeWithoutArrays({}, data);

        // initialize responsive properties
        // and set events
        this._init();

    }



    /**
     * Initialize responsive properties.
     */
    protected _init () {

        // check if responsive properties exist
        if (typeof this._initProp.responsive !== 'undefined') {
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
     * @param { boolean } [resize=false] - If the method was called on window resize.
     */
    protected _responseProp (resize = false) {

        const responsiveProp = this._initProp.responsive;

        // check if responsive properties exist
        if (responsiveProp) {

            // get sizes
            const { viewport } = this._app;
            const { width } = viewport;
            let newProp: (StatProp & ResProp) = {} as (StatProp & ResProp);

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
            if (resize) {
                this._onResponsive();
            }

        }

    }



    /**
     * This method allows you to change properties manually.
     */
    public changeProp (prop: ResProp) {

        this._prop = mergeWithoutArrays(this._prop, prop);
        this._refProp = mergeWithoutArrays(this._refProp, prop);

        // change prop callback
        this._onChange();

    }



    /**
     * Destroy the responsive properties.
     */
    public destroy () {

        this._viewportCallback.remove();

    }

}



/**
 * @namespace
 */
export namespace NResponsiveProp {

    export interface Prop<S> {
        responsive?: Responsive<S>[];
    }

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
        settings: S;
    }

}
