import { Callbacks, NCallbacks } from './Callbacks';
import { ResponsiveProp, NResponsiveProp } from './ResponsiveProp';
import { Application } from '../app/Application';
import mergeWithoutArrays from '../utils/common/mergeWithoutArrays';



/**
 * An abstract class for modules.
 */
export class Module<
    /**
     * All Properties
     */
    AllProp extends NModule.AllProp = NModule.AllProp,
    /**
     * Responsive Properties (may change on window resize, a part of the first object)
     */
    ResProp extends NModule.MutableProp = NModule.MutableProp,
    /**
     * Properties that may be changed through {@linkcode Module#changeProp}
     * (a part of the first object)
     */
    ChangeableProp extends NModule.MutableProp = NModule.MutableProp,
    /**
     * Module Callbacks
     */
    CallbacksTypes extends NModule.CallbacksTypes = NModule.CallbacksTypes,
> {



    /**
     * Get Default properties (should be extended)
     */
    protected get defaultProp () {
        return {} as AllProp;
    }

    /**
     * Current properties
     */
    get prop (): NModule.AllProp {
        return this._resProp.prop;
    }

    /**
     * Responsive properties
     */
    protected _resProp: ResponsiveProp<
        AllProp,
        ResProp,
        ChangeableProp
    >;



    /**
     * Module Callbacks
     */
    protected _callbacks: Callbacks<CallbacksTypes>;
    /**
     * Module Callbacks
     */
    get callbacks () {
        return this._callbacks;
    }



    /**
     * Vevet Application
     */
    protected _app: Application;

    /**
     * Module prefix
     */
    get prefix (): string {
        return '';
    }

    /**
     * Get module name
     */
    get name () {
        return this.constructor.name;
    }



    /**
     * @example
     * const mod = new Module();
     */
    constructor (
        /**
         * Properties on script start
         */
        initialProp: AllProp = {} as AllProp,
        /**
         * Responsive rules
         */
        responsiveRules: NResponsiveProp.Responsive<ResProp>[] = [],
        /**
         * Defines if you need to call {@linkcode Module#init} at the constructor's end.
         */
        init = true,
    ) {

        // set vars
        this._app = window.vevetApp;

        // create callbacks
        this._createCallbacks();
        // create responsive properties
        this._createResProp(initialProp, responsiveRules);

        // initialize
        if (init) {
            this._init();
        }

    }



    /**
     * Create Callbacks
     */
    protected _createCallbacks () {

        this._callbacks = new Callbacks<CallbacksTypes>();

    }

    /**
     * Create Responsive Properties
     */
    protected _createResProp<
        InitPropData extends AllProp,
        ResPropData extends NResponsiveProp.Responsive<ResProp>[]
    > (initialProp: InitPropData, responsiveRules: ResPropData) {

        const prop = mergeWithoutArrays(this.defaultProp, initialProp);

        // create responsive properties
        this._resProp = new ResponsiveProp(
            prop,
            responsiveRules,
            this._onPropResponsive.bind(this),
            this._onPropChange.bind(this),
            this.name,
        );

        // destroy responsive properties when the module is destroyed
        this.callbacks.add('destroy', () => {
            this._resProp.destroy();
        }, {
            protected: true,
        });

    }



    /**
     * Initializes the class.
     */
    protected _init () {

        this._constructor();
        this._setEvents();

        // destroy the current module on parent destroy
        if (this.prop.parent) {
            this.prop.parent.callbacks.add('destroy', () => {
                this.destroy();
            });
        }

    }

    /**
     * Extra constructor
     */
    protected _constructor () {
        // code
    }

    /**
     * Set events
     */
    protected _setEvents () {
        // code
    }



    /**
     * Change module properties.
     * @example
     *
     * // changing properties
     * // let's imagine that the module has the following properties:
     * prop = {
     *     name: 'module',
     *     cute: true
     * };
     * // we can change some properties in it: whether one or several properties
     * // after the properties are changed, the method _onPropChange is called.
     * module.changeProp({
     *     cute: false
     * });
     */
    public changeProp (prop: ChangeableProp = {} as ChangeableProp) {
        this._resProp.changeProp(prop);
        this._callbacks.tbt('changeProp', false);
    }

    /**
     * The method that is called on window resize and properties change.
     */
    protected _onPropResponsive () {
        this._onPropMutate();
    }

    /**
     * The method that is called on properties change.
     */
    protected _onPropChange (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        changedProp: ChangeableProp,
    ) {
        this._onPropMutate();
    }

    /**
     * The method that is called on properties change.
     */
    protected _onPropMutate () { }



    /**
     * Destroy the module
     */
    public destroy () {

        this._callbacks.tbt('destroy', false);

        this._destroy();

    }

    /**
     * Destroy the module
     */
    protected _destroy () {

        this._callbacks.tbt('destroy', false);
        this._callbacks.destroy();

    }



}



/**
 * @namespace
 */
export namespace NModule {

    /**
     * Static properties
     */
    export interface StatProp {
        /**
         * Parent module
         */
        parent?: Module<
            AllProp,
            MutableProp,
            MutableProp,
            CallbacksTypes
        >;
    }

    /**
     * Properties that may change
     */
    export interface MutableProp { }

    /**
     * All properties
     */
    export interface AllProp extends StatProp, MutableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NCallbacks.CallbacksTypes {
        'destroy': false;
        'changeProp': false;
    }

}
