import { Callbacks, ICallbacks } from "./Callbacks";
import { ResponsiveProp, IResponsiveProp } from "./ResponsiveProp";
import { Application } from "../app/Application";
import mergeWithoutArrays from "../utils/common/mergeWithoutArrays";



/**
 * An abstract class for modules.
 */
export abstract class Module<
    /**
     * Module Callbacks
     */
    CallbackTypes extends ICallbacks.CallbackSettings,
    /**
     * Static Properties (won't change)
     */
    StatProp extends IModule.StatProp,
    /**
     * Changeable Properties
     */
    ResProp extends IModule.ResProp,
> {



    /**
     * Module Properties
     */
    protected _prop: (StatProp & ResProp) & IResponsiveProp.Prop<ResProp>;
    /**
     * Module Properties
     */
    get prop () {
        return this._prop;
    }

    /**
     * Default properties.
     */
    get defaultProp () {
        return mergeWithoutArrays(this.dp, {
            callbacks: [],
            responsive: [],
        }) as (StatProp & ResProp) & IResponsiveProp.Prop<ResProp>;
    }
    /**
     * Default properties (may be extended)
     */
    get dp () {
        return { } as (StatProp & ResProp);
    }

    /**
     * Responsive properties
     */
    protected _resProp: ResponsiveProp<
        StatProp,
        ResProp
    >;
    /**
     * Responsive Properties (Module)
     */
    get rp () {
        return this._resProp;
    }



    /**
     * Vevet Application
     */
    protected _app: Application;

    /**
     * Module prefix
     */
    protected _prefix: string;
    /**
     * Module prefix
     */
    get prefix (): string {
        return "";
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
     * Module Callbacks
     */
    protected _callbacks: Callbacks<CallbackTypes>;
    /**
     * Module Callbacks
     */
    get callbacks () {
        return this._callbacks;
    }



    /**
     * @param data
     * @param init - Defines if you need to call {@linkcode Module#init} at the constructor's end.
     *
     * @example
     * const mod = new Module();
     */
    constructor (
        data: (StatProp & ResProp) & IResponsiveProp.Prop<ResProp>
        = {} as (StatProp & ResProp) & IResponsiveProp.Prop<ResProp>,
        init = true,
    ) {

        // set vars
        this._app = window.vevetApplication;
        this._prefix = this.prefix;
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
     * Create Callbacks
     */
    protected _createCallbacks () {

        this._callbacks = new Callbacks<CallbackTypes>();

    }

    /**
     * Create Module Properties
     */
    protected _createProp <
        C extends ((StatProp & ResProp) & IResponsiveProp.Prop<ResProp>)
    > (data: C = {} as C) {

        // extend properties
        this._prop = mergeWithoutArrays(this.defaultProp, data);

    }

    /**
     * Create Responsive Module Properties
     */
    protected _createResProp <
        C extends ((StatProp & ResProp) & IResponsiveProp.Prop<ResProp>)
    > (data: C = {} as C) {

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
        this.callbacks.add({
            target: "destroy",
            do: () => {
                this._resProp.destroy();
            },
        } as CallbackTypes);

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
        this._callbacks.tbt("changeProp");
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

        this._destroy();

    }

    /**
     * Destroy the module
     */
    protected _destroy () {

        this.rp.destroy();

    }



}



/**
 * @namespace
 */
export namespace IModule {

    export interface StatProp {
        /**
         * Parent module
         */
        parent?: Module<
            ICallbacks.CallbackSettings,
            StatProp,
            ResProp
        >;
    }
    export interface ResProp { }

    export type CallbackTypes = {
        target: "destroy";
        do: () => void;
    } & ICallbacks.CallbackBaseSettings | {
        target: "changeProp";
        do: (data: number) => void;
    };

}
