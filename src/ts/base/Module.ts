import {
    addEventListener, IAddEventListener, IAddEventListenerOptions, ListenerElement,
} from 'vevet-dom';
import { Callbacks, NCallbacks } from './Callbacks';
import { MutableProp, NMutableProp } from './MutableProp';
import { Application } from '../app/Application';
import mergeWithoutArrays from '../utils/common/mergeWithoutArrays';
import { Viewport } from '../app/events/Viewport';
import { RequiredModuleProp } from '../utils/types/utility';
import { throwVevetAppError } from '../utils/errors';



export namespace NModule {

    /**
     * Mutable Properties (may change on window resize or through {@linkcode Module.changeProp})
     */
    export interface ChangeableProp { }

    /**
     * Static properties
     */
    export interface StaticProp {
        /**
         * Parent module
         */
        parent?: any;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NCallbacks.CallbacksTypes {
        'destroy': false;
        'changeProp': false;
    }

}



/**
 * A class for modules.
 */
export class Module<
    /**
     * Static Properties (they never change)
     */
    StaticProp extends NModule.StaticProp = NModule.StaticProp,
    /**
     * Mutable Properties
     * (may change on window resize or through {@linkcode Module.changeProp})
     */
    ChangeableProp extends NModule.ChangeableProp = NModule.ChangeableProp,
    /**
     * Module Callbacks
     */
    CallbacksTypes extends NModule.CallbacksTypes = NModule.CallbacksTypes,
> {
    /**
     * Get Default properties (should be extended)
     */
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            parent: false,
        } as T;
    }

    /**
     * Current properties
     */
    get prop (): RequiredModuleProp<(StaticProp & ChangeableProp)> {
        return this._mutableProp.prop as RequiredModuleProp<(StaticProp & ChangeableProp)>;
    }

    /**
     * Responsive properties
     */
    protected _mutableProp: MutableProp<
        StaticProp,
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
     * Module listeners
     */
    protected _listeners: IAddEventListener[];



    /**
     * Vevet Application
     */
    protected _app!: Application;

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
     * If the module is initialized
     */
    protected _inited = false;
    get inited () {
        return this._inited;
    }

    /**
     * If the module is destroyed
     */
    protected _destroyed: boolean;
    get destroyed () {
        return this._destroyed;
    }



    /**
     * @example
     * const mod = new Module();
     */
    constructor (
        /**
         * Properties on script start
         */
        initialProp?: (StaticProp & ChangeableProp),
        /**
         * Defines if you need to call {@linkcode Module.init} at the constructor's end.
         * If you want to add responsive properties, set this argument to FALSE.
         */
        init = true,
    ) {
        // set vars
        if (window.vevetApp) {
            this._app = window.vevetApp;
        } else {
            throwVevetAppError();
        }

        // set default vars
        this._destroyed = false;
        this._listeners = [];

        // create callbacks
        this._callbacks = new Callbacks<CallbacksTypes>();

        // create mutable properties
        const prop = mergeWithoutArrays(this._getDefaultProp(), initialProp || {});
        this._mutableProp = new MutableProp(
            prop as (StaticProp & ChangeableProp),
            this._onPropResponsive.bind(this),
            this._onPropChange.bind(this),
            this.name,
        );

        if (init) {
            this.init();
        }
    }



    /**
     * Add responsive rules
     */
    public addResponsiveProp (
        rules: NMutableProp.Responsive<ChangeableProp>,
    ) {
        if (this._inited) {
            throw new Error('Responsive properties cannot be added because the class instance is already initialized');
        } else {
            this._mutableProp.addResponsiveProp(rules);
        }
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
    public changeProp (
        prop: ChangeableProp = {} as ChangeableProp,
    ) {
        this._mutableProp.changeProp(prop);
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
     * Initializes the class.
     */
    public init () {
        // return if the module is already initialized
        if (this._inited) {
            return;
        }
        this._inited = true;

        // continue initializing
        this._constructor();
        this._setEvents();

        // destroy the current module on parent destroy
        if (this.prop.parent) {
            this.prop.parent.addCallback('destroy', () => {
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
     * Viewport callbacks
     */
    protected _viewportCallbacks: NCallbacks.AddedCallback[] = [];

    /**
     * Add a viewport callback that will be removed on class destroy
     * {@see Viewport}
     */
    public addViewportCallback (
        target: Parameters<Viewport['add']>[0],
        func: Parameters<Viewport['add']>[1],
        data: Parameters<Viewport['add']>[2] = {},

    ) {
        const callback = this._app.viewport.add(target, func, {
            ...data,
            name: this.constructor.name,
        });
        this._viewportCallbacks.push(callback);
        return callback;
    }



    /**
     * Add a module callback
     * {@see Callbacks}
     */
    public addCallback <Target extends keyof CallbacksTypes> (
        target: Target,
        func: NCallbacks.CallbackSettings<CallbacksTypes, Target>['do'],
        data: NCallbacks.CallbackBaseSettings = {},

    ) {
        const callback = this.callbacks.add(target, func, data);
        return callback;
    }



    /**
     * Add a DOM event listeners
     */
    public addEventListeners <
        El extends ListenerElement,
        Target extends keyof HTMLElementEventMap,
        Callback extends (evt: HTMLElementEventMap[Target]) => void,
    > (

        el: El,
        target: Target,
        callback: Callback,
        options?: IAddEventListenerOptions): IAddEventListener {
        const listener = addEventListener(el, target, callback, options);
        this._listeners.push(listener);

        return listener;
    }



    /**
     * Destroy the module
     */
    public destroy () {
        if (this.destroyed) {
            return;
        }
        this._destroy();
    }

    /**
     * Destroy the module
     */
    protected _destroy () {
        // destroy callbacks
        this._callbacks.tbt('destroy', false);
        this._callbacks.destroy();

        // destroy mutable properties
        this._mutableProp.destroy();

        // destroy viewport callbacks
        this._viewportCallbacks.forEach((callback) => {
            callback.remove();
        });

        // destroy all listeners
        this._listeners.forEach((listener) => {
            listener.remove();
        });

        // events
        this._destroyed = true;
    }
}
