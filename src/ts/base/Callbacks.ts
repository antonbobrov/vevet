import generateID from "../utils/common/generateID";
import timeoutCallback from "../utils/common/timeoutCallback";
import { Application } from "../app/Application";

/**
 * A class for callbacks' manipulation.
 */
export class Callbacks<
    /**
     * Module Callbacks
     */
    CallbackType extends ICallbacks.CallbackType
> {

    /**
     * Vevet Application
     */
    protected _app: Application;

    /**
     * All callbacks
     */
    protected _callbacks: ICallbacks.CallbackData<CallbackType>[];
    /**
     * Get all callbacks
     */
    get callbacks () {
        return this._callbacks;
    }



    /**
     * @example
     * const callback = new Callbacks();
     */
    constructor () {

        this._app = window.vevetApplication;
        this._callbacks = [];

        // initialize callbacks
        this._init();

    }

    /**
     * Initialize the class.
     */
    protected _init () {
        this._constructor();
        this._setEvents();
    }

    /**
     * An empty method that is called in {@linkcode Callbacks#_init}.
     */
    protected _constructor () {
        // code
    }

    /**
     * An empty method that is called in {@linkcode Callbacks#_init}.
     */
    protected _setEvents () {
        // code
    }



    /**
     * Adds a callback
     * @param data - Callback's data
     * @param bool - If the callback is enabled by default
     *
     * @example
     * const id = callback.add({
     *     target: "target-name",
     *     do: () => {
     *         alert("callback");
     *     }
     * });
     */
    public add (
        data: CallbackType,
        bool = true,
    ): string {

        const id = generateID("callback");
        const obj = {
            id,
            on: bool,
            data,
        };

        this._callbacks.push(obj);
        this._add(id);

        return id;

    }

    /**
     * Use it to implement some actions after adding a callback.
     * @param id
     */
    protected _add (id: string) {
        // code
        this.get(id);
    }



    /**
     * Remove a callback.
     */
    public remove (
        id: string,
    ): boolean {

        const callbacks = this._callbacks;
        const newCallbacks: ICallbacks.CallbackData<CallbackType>[] = [];
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
                this._remove(id);
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
    protected _remove (id: string) {
        // code
        this.get(id);
    }

    /**
     * Remove all callbacks.
     */
    public removeAll () {

        while (this._callbacks.length > 0) {
            this.remove(this._callbacks[0].id);
        }

    }



    /**
     * Enable/disable a callback.
     * @param id - ID of the callback
     * @param bool - True to enable, false to disable.
     */
    public turn (
        id: string,
        bool = true,
    ): boolean {

        const callback = this.get(id);
        if (callback) {
            callback.on = bool;
            this._turn(id);
            return true;
        }

        return false;

    }

    /**
     * Use it to implement some actions after enabling or disabling a callback.
     */
    protected _turn (id: string) {
        // code
        this.get(id);
    }



    /**
     * Get a callback by id
     */
    public get (
        id: string,
    ): false | ICallbacks.CallbackData<CallbackType> {

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
    protected _trigger (
        callback: ICallbacks.CallbackData<CallbackType>,
        arg: ICallbacks.CallbackArg = false,
    ) {

        // check if enabled
        if (!callback.on) {
            return;
        }

        const { timeout, once } = callback.data;
        const func = callback.data.do;

        // launch
        if (timeout) {
            if (arg) {
                timeoutCallback(
                    this._triggerFunc.bind(this, func, arg),
                    timeout,
                );
            }
            else {
                timeoutCallback(
                    this._triggerFunc.bind(this, func, false),
                    timeout,
                );
            }
        }
        else if (arg) {
            this._triggerFunc(func, arg);
        }
        else {
            this._triggerFunc(func, false);
        }

        // remove once-callback
        if (once) {
            this.remove(callback.id);
        }

    }

    /**
     * Launch a callback's function
     */
    protected _triggerFunc (
        func: Function,
        arg: ICallbacks.CallbackArg,
    ) {

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
    public triggerAll () {

        for (let i = 0, l = this._callbacks.length; i < l; i++) {
            this._trigger(this._callbacks[i]);
        }

    }

    /**
     * Trigger all enabled callbacks under a certain target name. (TBT: Trigger by target).
     */
    public tbt (
        target: string,
        arg: ICallbacks.CallbackArg = false,
    ) {

        for (let i = 0; i < this._callbacks.length; i++) {
            if (this._callbacks[i].data.target === target) {
                this._trigger(this._callbacks[i], arg);
            }
        }

    }
}



/**
 * @namespace
 */
export namespace ICallbacks {

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
    export interface CallbackType extends CallbackBaseSettings {
        /**
         * Callback target name
         */
        target?: any;
        /**
         * Callback Function
         */
        do: Function;
    }

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
    export type CallbackArg = false | Record<string, any>;

}
