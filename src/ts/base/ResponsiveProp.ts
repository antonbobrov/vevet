import { Application } from "../app/Application";
import mergeWithoutArrays from "../utils/mergeWithoutArrays";

/**
 * A class for creating properties that may change on window resize. <br><br>
 * 
 * Sometimes it may be useful to change properties when the window is resized. <br>
 * There are two ways to do it:
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
     * Changeable Properties
     */
    ResProp extends object,
    /**
     * Static & Changeable Properties 
     */
    PureProp extends object,
    /**
     * All Properties & Responsive Settings 
     */
    FullProp extends ResponsiveProp.Prop<ResProp>,
> {

    /**
     * Vevet Application.
     */
    protected _app: Application;
    /**
     * A callback that is launched when properties are changed 
     * through {@linkcode ResponsiveProp#changeProp}
     */
    protected _onChange: Function;
    /**
     * A callback that is launched when properties are changed on window resize
     */
    protected _onResponsive: Function;
    /**
     * Name of the responsive properties.
     */
    protected _name: string;

    /**
     * The properties that were set while initialization.
     * These properties do not change throughout time.
     */
    protected _initProp: FullProp;
    /**
     * @description Reference properties.
     * These properties may change only through {@linkcode ResponsiveProp#changeProp}.
     */
    protected _refProp: FullProp;

    /**
     * Current properties.
     * These properties may change both on resize and {@linkcode ResponsiveProp#changeProp}.
     */
    protected _prop: FullProp;
    /**
     * Get current properties
     */
    get prop() {
        return this._prop;
    }

    /**
     * Viewport callback id
     */
    protected _viewportID: string | false;



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
    constructor(
        data: FullProp = {} as FullProp, 
        onChange: Function = () => {}, 
        onResponsive: Function = () => {},
        name: string = ''
    ) {

        this._app = window.vevetApplication;
        this._onChange = onChange;
        this._onResponsive = onResponsive;
        this._name = this.constructor.name + ' ' + name;

        this._initProp = data;
        this._initProp = data;
        this._refProp = mergeWithoutArrays({}, data);
        this._prop = mergeWithoutArrays({}, data);

        this._viewportID = false;

        // initialize responsive properties
        // and set events
        this._init();

    }



    /**
     * Initialize responsive properties.
     */
    protected _init() {

        // check if responsive properties exist
        if (typeof this._initProp.responsive != "undefined") {
            // change properties according to the responsive prop
            this._responseProp();
            // add event on resize
            this._viewportID = this._app.viewport.add({
                target: 'w_',
                name: this._name,
                do: this._responseProp.bind(this, true)
            });
        }

    }

    /**
     * Change properties according to the "responsive" settings
     * @param { boolean } [resize=false] If the method was called on window resize.
     */
    protected _responseProp(resize = false) {

        const responsiveProp = this._initProp.responsive;
        
        // check if responsive properties exist
        if (responsiveProp) {

            // get sizes
            const viewport = this._app.viewport;
            const width = viewport.size[0];
            let newProp: PureProp = {} as PureProp;
            
            // go through all breakpoints
            // and check if a proper breakpoint exists
            let breakpointExists = false;
            responsiveProp.forEach((responsiveProp) => {

                // copy settings
                const settings = responsiveProp.settings;
                const breakpoint = responsiveProp.breakpoint;

                // if the breakpoint is a number
                if (typeof breakpoint == 'number') {
                    if (width <= responsiveProp.breakpoint) {
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
     * @example
     * 
     * // changing properties
     * // let's imagine that you set the following properties while initializing:
     * prop = {
     *      name: 'Me',
     *      features: {
     *          cute: true,
     *          sleepy: false
     *      }
     * };
     * // we can change some properties in it: whether one or several properties
     * module.changeProp({
     *     name: 'You'
     * });
     * module.changeProp({
     *      name: 'You',
     *      features: {
     *          cute: false
     *      }
     * });
     */
    public changeProp(prop: ResProp) {

        this._prop = mergeWithoutArrays(this._prop, prop);
        this._refProp = mergeWithoutArrays(this._refProp, prop);
        
        // change prop callback
        this._onChange();

    }



    /**
     * Destroy the responsive properties.
     */
    public destroy() {

        if (this._viewportID) {
            this._app.viewport.remove(this._viewportID);
        }

    }

}





export namespace ResponsiveProp {

    export interface Prop<S> {
        responsive?: Responsive<S>[]
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
        breakpoint: number | 'd' | 't' | 'm' | 'md',
        settings: S
    }

}