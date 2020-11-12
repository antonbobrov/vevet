import { Callbacks, NCallbacks } from './Callbacks';
import { ResponsiveProp, NResponsiveProp } from './ResponsiveProp';
import { Application } from '../app/Application';
import mergeWithoutArrays from '../utils/common/mergeWithoutArrays';



/**
 * An abstract class for modules.
 */
export class Module<
    /**
     * Static Properties (won't change)
     */
    StatProp extends NModule.StatProp = NModule.StatProp,
    /**
     * Changeable Properties
     */
    ResProp extends NModule.ResProp = NModule.ResProp,
    /**
     * Module Callbacks
     */
    CallbacksTypes extends NModule.CallbacksTypes = NModule.CallbacksTypes,
> {



    /**
     * Module Properties
     */
    protected _prop: (StatProp & ResProp) & NResponsiveProp.Prop<ResProp>;
    /**
     * Get Module Properties
     */
    get prop () {
        return this._prop;
    }

    /**
     * Get Default properties.
     */
    get defaultProp () {
        return mergeWithoutArrays(this.dp, {
            responsive: [],
        });
    }
    /**
     * Get Default properties (should be extended)
     */
    get dp (): StatProp & ResProp {
        return {} as (StatProp & ResProp);
    }

    /**
     * Responsive properties
     */
    protected _resProp: ResponsiveProp<
        StatProp,
        ResProp
    >;
    /**
     * Get Responsive Properties (Module)
     */
    get rp () {
        return this._resProp;
    }



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
     * Module name
     */
    protected _name: string;
    /**
     * Get module name
     */
    get name () {
        return this._name;
    }



    /**
     * @param data
     * @param init - Defines if you need to call {@linkcode Module#init} at the constructor's end.
     *
     * @example
     * const mod = new Module();
     */
    constructor (
        data: (StatProp & ResProp) & NResponsiveProp.Prop<ResProp>
        = {} as (StatProp & ResProp) & NResponsiveProp.Prop<ResProp>,
        init = true,
    ) {

        // set vars
        this._app = window.vevetApp;
        this._name = this.constructor.name;

        // create properties
        this._createProp(data);
        // create callbacks
        this._createCallbacks();
        // create responsive properties
        this._createResProp();

        // initialize
        if (init) {
            this._init();
        }

    }



    /**
     * Create Module Properties
     */
    protected _createProp<
        C extends ((StatProp & ResProp) & NResponsiveProp.Prop<ResProp>)
    >(data: C = {} as C) {

        // extend properties
        this._prop = mergeWithoutArrays(this.defaultProp, data);

    }

    /**
     * Create Callbacks
     */
    protected _createCallbacks () {

        this._callbacks = new Callbacks<CallbacksTypes>();

    }

    /**
     * Create Responsive Module Properties
     */
    protected _createResProp<
        C extends ((StatProp & ResProp) & NResponsiveProp.Prop<ResProp>)
    >(data: C = {} as C) {

        // create responsive properties
        this._resProp = new ResponsiveProp<
            StatProp, ResProp
        >(
            data,
            this._onPropChange.bind(this),
            this._onPropChange.bind(this),
            this._name,
        );

        // bind properties // because if they have responsive settings,
        // they may change on initialization
        this._prop = this._resProp.prop as C;

        // destroy responsive properties when the module is destroyed
        this.callbacks.add('destroy', () => {
            this._resProp.destroy();
        });

    }



    /**
     * Initializes the class.
     */
    protected _init () {
        this._constructor();
        this._setEvents();
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
    public changeProp (prop: ResProp = {} as ResProp) {
        this._resProp.changeProp(prop);
        this._callbacks.tbt('changeProp', false);
    }

    /**
     * The method that is called on properties change.
     */
    protected _onPropChange () {
        // code
    }



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
            StatProp,
            ResProp,
            CallbacksTypes
        >;
    }

    /**
     * Responsive properties
     */
    export interface ResProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NCallbacks.CallbacksTypes {
        'destroy': false;
        'changeProp': false;
    }

}
