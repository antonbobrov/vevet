import { Callbacks, ICallbacks } from "./Callbacks";
import { ResponsiveProp, IResponsiveProp } from "./ResponsiveProp";
import { Application } from "../app/Application";
import mergeWithoutArrays from "../utils/mergeWithoutArrays";



/**
 * An abstract class for modules.
 */
export class Module<
    /**
     * Module Callbacks
     */
    CallbackType extends IModule.CallbackType,
    /**
     * Static Properties (won't change)
     */
    StatProp extends IModule.StatProp,
    /**
     * Changeable Properties
     */
    ResProp extends IModule.ResProp,
    /**
     * Static & Changeable Properties
     */
    SRProp extends StatProp & ResProp,
    /**
     * Static & Changeable Properties
     */
    Prop extends SRProp & IResponsiveProp.Prop<ResProp> & IModule.CallbacksProp
> {



    /**
     * Module Properties
     */
    protected _prop: Prop;

    /**
     * Module Properties
     */
    get prop () {
        return this._prop;
    }

    /**
     * Default properties.
     */
    get defaultProp (): Prop {
        return {
            callbacks: [],
            responsive: [],
        } as Prop;
    }

    /**
     * Responsive properties
     */
    protected _resProp: ResponsiveProp<
        StatProp,
        ResProp,
        SRProp,
        Prop
    >;

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
    protected _callbacks: Callbacks<CallbackType>;

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
        data: Prop = {} as Prop,
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

        this._callbacks = new Callbacks<CallbackType>(
            this._prop.callbacks as CallbackType[],
        );

    }

    /**
     * Create Module Properties
     */
    protected _createProp (
        data: Prop = {} as Prop,
    ) {

        // extend properties
        this._prop = mergeWithoutArrays(this.defaultProp, data);

    }

    /**
     * Create Responsive Module Properties
     */
    protected _createResProp (
        data: Prop = {} as Prop,
    ) {

        // create responsive properties
        this._resProp = new ResponsiveProp<StatProp, ResProp, SRProp, Prop>(
            data,
            this._changeProp.bind(this),
            this._changeProp.bind(this),
            this._name,
        );

        // bind properties // because if they have responsive settings,
        // they may change on initialization
        this._prop = this._resProp.prop;

        // destroy responsive properties when the module is destroyed
        this.callbacks.add({
            target: "destroy",
            do: () => {
                this._resProp.destroy();
            },
        } as CallbackType);

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
     * // after the properties are changed, the method _changeProp is called.
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
    protected _changeProp () {
        // code
    }



}



export namespace IModule {

    export interface StatProp {
        parent?: Module<
            CallbackType,
            StatProp,
            ResProp,
            StatProp & ResProp,
            StatProp & ResProp
                & IResponsiveProp.Prop<ResProp> & IModule.CallbacksProp
        >;
    }
    export interface ResProp { }

    export interface CallbacksProp {
        callbacks?: CallbackType[];
    }

    export type CallbackType = {
        target: "destroy";
        do: () => void;
    } & ICallbacks.CallbackBaseSettings | {
        target: "changeProp";
        do: () => void;
    } & ICallbacks.CallbackBaseSettings;

}
