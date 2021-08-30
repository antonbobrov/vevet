import { Application } from '../app/Application';
import { mergeWithoutArrays } from '../utils/common';
import { NCallbacks } from './Callbacks';



export namespace NMutableProp {

    export interface Responsive<S> {
        /**
         * Breakpoint on which the properties will change.
         * Available breakpoints:
         * <ul>
         *      <li>any number - width breakpoint</li>
         *      <li>'d' - for desktop size</li>
         *      <li>'t' - for tablet size</li>
         *      <li>'p' - for phone size</li>
         *      <li>'phone' - for phones</li>
         *      <li>'tablet' - for tablets</li>
         *      <li>'mobile' - for phone or tablet devices</li>
         * </ul>
         */
        breakpoint: number | 'd' | 't' | 'p' | 'phone' | 'tablet' | 'mobile';
        settings: S;
    }

}



/**
 * A class for creating mutable properties that can change on window resize. <br><br>
 *
 * There are two ways to change properties:
 * <ul>
 *     <li>
 *         To set a resize-listener on window (or use {@linkcode Viewport}).
 *         When the window is resized, change the properties with the help of
 *         {@linkcode MutableProp.changeProp}</li>
 *     <li>
 *         The second way is to use the MutableProp and add responsive properties
 *         with help of {@linkcode MutableProp.addResponsiveProp}.</li>
 * </ul>
 */
export class MutableProp<
    /**
     * Static Properties (they never change)
     */
    StaticProp extends Record<string, any>,
    /**
     * Mutable Properties
     * (may change on window resize or through {@linkcode MutableProp.changeProp})
     */
    ChangeableProp extends Record<string, any>,
> {
    /**
     * Vevet Application.
     */
    protected _app: Application;

    /**
     * @description Reference properties.
     * These properties may change only through {@linkcode MutableProp.changeProp}.
     */
    protected _refProp: StaticProp & ChangeableProp;

    /**
     * Current properties.
     * These properties may change both on {@linkcode MutableProp.changeProp} and resize.
     */
    protected _prop: StaticProp & ChangeableProp;

    /**
     * A set of responsive rules
     */
    protected _responsiveRules: NMutableProp.Responsive<ChangeableProp>[] = [];

    /**
     * Get current properties
     */
    get prop () {
        return this._prop;
    }

    /**
     * Viewport callback
     */
    protected _viewportCallback: NCallbacks.AddedCallback | undefined;



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
     * const prop = new MutableProp(static, responsive);
     */
    constructor (
        /**
         * The properties that were set while initialization.
         * These properties do not change throughout time.
         */
        protected _initProp: (StaticProp & ChangeableProp),
        /**
         * A callback that is launched when properties are changed on window resize
         */
        protected _onResponsive: () => void = () => {},
        /**
         * A callback that is launched when properties are changed
         * through {@linkcode MutableProp.changeProp}
         */
        protected _onChange: (prop: ChangeableProp) => void = () => {},
        /**
         * Name of the responsive properties.
         */
        protected _name = 'Responsive Prop',
    ) {
        this._app = window.vevetApp;
        this._refProp = mergeWithoutArrays({}, _initProp);
        this._prop = mergeWithoutArrays({}, _initProp);
    }



    /**
     * Add responsive rules
     */
    public addResponsiveProp (
        rules: NMutableProp.Responsive<ChangeableProp>,
    ) {
        this._responsiveRules.push(rules);

        // add event on resize
        if (typeof this._viewportCallback === 'undefined') {
            this._viewportCallback = this._app.viewport.add('w', this._responseProp.bind(this, true), {
                name: this._name,
            });
        }

        // change properties according to the responsive prop
        this._responseProp();
    }



    /**
     * Change properties according to the "responsive" settings
     * @param onResize - If the method was called on window resize.
     */
    protected _responseProp (
        onResize = false,
    ) {
        const responsiveProp = this._responsiveRules;

        // get sizes
        const app = this._app;
        const { viewport } = app;
        const { width } = viewport;
        let newProp: (StaticProp & ChangeableProp) | false = false;
        const statProp = mergeWithoutArrays({}, this._refProp);

        // go through all breakpoints
        // and check if a proper breakpoint exists
        responsiveProp.forEach((prop) => {
            // copy settings
            const { settings, breakpoint } = prop;

            // if the breakpoint is a number
            if (typeof breakpoint === 'number') {
                if (width <= prop.breakpoint) {
                    newProp = mergeWithoutArrays(statProp, settings);
                }
            } else if (typeof breakpoint === 'string') {
                const string = breakpoint.toLowerCase() as typeof breakpoint;
                // viewport size
                if (
                    (string === 'd' && viewport.isDesktop)
                    || (string === 't' && viewport.isTablet)
                    || (string === 'p' && viewport.isPhone)
                ) {
                    newProp = mergeWithoutArrays(statProp, settings);
                }
                // device type
                if (
                    (string === 'phone' && app.isPhone)
                    || (string === 'tablet' && app.isTablet)
                    || (string === 'mobile' && app.isMobile)
                ) {
                    newProp = mergeWithoutArrays(statProp, settings);
                }
            }
        });

        // if there's no breakpoint, restore the props
        if (!newProp) {
            this._prop = mergeWithoutArrays(this._prop, this._refProp);
        } else {
            // otherwise, change the properties
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
