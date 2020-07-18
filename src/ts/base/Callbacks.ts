import { Application } from "./Application";
import generateID from "../utils/generateID";
import mergeWithoutArrays from "../utils/mergeWithoutArrays";
import timeoutCallback from "../utils/timeoutCallback";

/**
 * A class for callbacks' manipulation.
 */
export abstract class Callbacks<
    ClassProp extends Callbacks.Prop<CallbackType>, 
    CallbackType extends Callbacks.CallbackSettings
> {

    /**
     * Module Properties
     */
    protected _prop: ClassProp;
    /**
     * Module Properties
     */
    get prop() {
        return this._prop;
    }
    /**
     * Default properties.
     */
    get defaultProp(): ClassProp {
        return {
            callbacks: []
        } as ClassProp;
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
     * Get module prefix
     */
    get prefix(): string {
        return '';
    }



    /**
     * Module name
     */
    protected _name: string;
    /**
     * Get module name
     */
    get name() {
        return this._name;
    }

    /**
     * All callbacks
     */
    protected _callbacks: Callbacks.CallbackData<CallbackType>[];
    /**
     * Get all callbacks
     */
    get callbacks() {
        return this._callbacks;
    }



    /**
     * @param data
     * @param init - Defines if you need to call {@linkcode Callbacks#init} at the constructor's end.
     * 
     * @example
     * const callback = new Callbacks();
     */
    constructor(data: ClassProp, init = true) {

        this._app = window.vevetApplication;

        this._prefix = this.prefix;
        this._prop = mergeWithoutArrays(this.defaultProp, data);
        this._name = this.constructor.name;
        this._callbacks = [];

        // add callbacks from properties
        for (let i = 0, l = this._prop.callbacks.length; i < l; i++) {
            this.addCallback(this._prop.callbacks[i]);
        }

        // initialize
        if (init) {
            this._init();
        }

    }



    /**
     * Initializes the class.
     */		    
    protected _init() {
        this._constructor();
        this._setEvents();
    }

    /**
     * An empty method that is called in {@linkcode Callbacks#_init}.
     */
    protected _constructor() { }
    /**
     * An empty method that is called in {@linkcode Callbacks#_init}.
     */
    protected _setEvents() { }
    


    /**
     * Adds a callback
     * @param data - Callback's data
     * @param bool
     * 
     * @example
     * const id = callback.add({
     *     target: 'target_name',
     * 	   func: () => {
     * 		   alert("callback");
     * 	   }
     * });
     */
    public addCallback(data: CallbackType, bool = true): string {

        const id = generateID(this.name);
        const obj = {
            id: id,
            on: bool,
            data: data
        };
        
        this._callbacks.push(obj);
        this._addCallback(id);
        
        return id;

    }

    /**
     * Use it to implement some actions after adding a callback.
     * @param id
     */
    protected _addCallback(id: string) { }
    


    /**
     * Remove a callback.
     */
    public removeCallback(id: string): boolean {

        const callbacks = this._callbacks;
        const newCallbacks: Callbacks.CallbackData<CallbackType>[] = [];
        let removed = false;
        
        for (let i = 0, l = callbacks.length; i < l; i++) {

            const callback = callbacks[i];

            // check id
            if (callback.id !== id) {
                // add the callback to the new array
                newCallbacks.push(callback);
                continue;
            } 

            // check if the callback is protected
            let protectedCallback = false;
            if (callback.data.protected) {
                protectedCallback = true;
            }
            
            // remove the callback if not protected
            if (!protectedCallback) {
                this._removeCallback(id);
                removed = true;
            }
            else {
                // add the callback to the new array
                newCallbacks.push(callback);
            }
    
        }

        // replace the callbacks' array
        this._callbacks = newCallbacks;

        // return results
        return removed;

    }

    /**
     * Use it to implement some actions after removing a callback.
     */
    protected _removeCallback(id: string) { }
    
    /**
     * Remove all callbacks.
     */
    public removeAllCallbacks() {

        while (this._callbacks.length > 0) {
            this.removeCallback(this._callbacks[0].id);
        }

    }
    


    /**
     * Enable/disable a callback.
     * @param id - ID of the callback
     * @param bool - True to enable, false to disable.
     */
    public turnCallback(id: string, bool = true): boolean {

        const callback = this.getCallback(id);
        if (callback) {
            callback.on = bool;
            this._turnCallback(id);
            return true;
        }
        
        return false;

    }

    /**
     * Use it to implement some actions after enabling or disabling a callback.
     */
    protected _turnCallback(id: string) { }
    


    /**
     * Get a callback by id
     */
    public getCallback(id: string): false | Callbacks.CallbackData<CallbackType> {

        const callbacks = this._callbacks;
        for (let i = 0; i < callbacks.length; i++) {
            if (callbacks[i].id === id) {
                return callbacks[i];
            }
        }

        return false;

    }
    


    /**
     * Trigger a callback. It will work only if the callback is enabled.
     */
    protected _triggerCallback(
        callback: Callbacks.CallbackData<CallbackType>, 
        arg: Callbacks.CallbackArg = false
    ) {

        // check if enabled
        if (!callback.on) {
            return;
        }

        const { timeout, func, once } = callback.data;

        // launch
        if (timeout) {
            if (arg) {
                timeoutCallback(this._triggerCallbackFunc.bind(this, func, arg), timeout);
            }
            else {
                timeoutCallback(this._triggerCallbackFunc.bind(this, func, false), timeout);
            }
        }
        else {
            if (arg) {
                this._triggerCallbackFunc(func, arg);
            }
            else {
                this._triggerCallbackFunc(func, false);
            }
        }

        // remove once-callback
        if (once) {
            this.removeCallback(callback.id);
        }

    }

    /**
     * Launch a callback's function
     */
    protected _triggerCallbackFunc(func: Function, arg: Callbacks.CallbackArg) {
        
        if (arg) {
            func(arg);
        }
        else {
            func();
        }

    }

    /**
     * Trigger all existing callbacks.
     */
    public triggerAllCallbacks() {

        for (let i = 0, l = this._callbacks.length; i < l; i++) {
            this._triggerCallback(this._callbacks[i]);
        }

    }

    /**
     * Trigger all enabled callbacks under a certain target name. (TBT: Trigger by target).
     */
    public tbt(target: string, arg: Callbacks.CallbackArg = false) {

        for (let i = 0; i < this._callbacks.length; i++) {
            if (this._callbacks[i].data.target === target) {
                this._triggerCallback(this._callbacks[i], arg);
            }
        }

    }



}



/**
 * @namespace
 */
export namespace Callbacks {

    /**
     * Class Properties
     */
    export type Prop<C> = {
        callbacks?: C[];
    }

    /**
     * Callbacks Properties' Settings
     */
    export interface CallbackBaseSettings {
        /**
         * Name of the callback if needed.
         */
        name?: string | undefined;
        /**
         * Timeout of the callback.
         */
        timeout?: number | undefined;
        /**
         * If true, the callback can't be removed.
         */
        protected?: boolean | undefined;
        /**
         * If true, the callback is to be removed after it is called.
         */
        once?: boolean | undefined;
    }
    /**
     * Callbacks's Data with a Target
     */
    export interface CallbackSettings extends CallbackBaseSettings {
        /**
         * Callback target name
         */
        target?: any;
        /**
         * Callback Function
         */
        func: Function;
    };

    /**
     * Full Callbacks Data
     */
    export type CallbackData<C> = {
        /**
         * ID of the callback
         */
        id: string;
        /**
         * Defines if the callback is enabled
         */
        on: boolean;
        /**
         * Callback Data
         */
        data: C;
    }

    /**
     * The argument that is transmitted to the callback function
     */
    export type CallbackArg = false | object;
    
}