import { Application } from '../app/Application';
import { timeoutCallback, randID } from '../utils/common';



export namespace NCallbacks {

    /**
     * Callbacks Properties Settings
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
     * Callbacks Settings
     */
    export interface CallbackSettings<
        Types, Target extends keyof Types
    > extends CallbackBaseSettings {
        target: Target;
        do: (arg: Types[Target]) => void;
    }

    /**
     * Callbacks Types
     */
    export interface CallbacksTypes { }

    /**
     * Callback Full Data
     */
    export type CallbacksData<Types> = {
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
        data: CallbackSettings<Types, keyof Types>;
    }

    export type SingleCallbackData<Types, Target extends keyof Types> = {
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
        data: CallbackSettings<Types, Target>;
    }

    export interface AddedCallback {
        /**
         * ID of the callback
         */
        id: string;
        /**
         * Remove the callback
         */
        remove: () => void;
    }

}



/**
 * A class for callbacks' manipulation.
 */
export class Callbacks<
    /**
     * Module Callbacks
     */
    Types extends NCallbacks.CallbacksTypes = NCallbacks.CallbacksTypes
> {
    /**
     * Vevet Application
     */
    protected _app: Application;

    /**
     * All callbacks
     */
    protected _callbacks: NCallbacks.CallbacksData<Types>[];

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
    constructor (
        callInit = true,
    ) {
        this._app = window.vevetApp;
        this._callbacks = [];

        // initialize callbacks
        if (callInit) {
            this._init();
        }
    }

    /**
     * Initialize the class.
     */
    protected _init () {
        this._constructor();
        this._setEvents();
    }

    /**
     * An empty method that is called in {@linkcode Callbacks._init}.
     */
    protected _constructor () {
        // code
    }

    /**
     * An empty method that is called in {@linkcode Callbacks._init}.
     */
    protected _setEvents () {
        // code
    }



    /**
     * Adds a callback
     * @param target - Callback target name
     * @param func - Callback function
     * @param data - Callback data
     *
     * @example
     * const onTarget = callback.add("target-name", () => {
     *     alert("callback");
     * });
     */
    public add <Target extends keyof Types> (
        target: Target,
        func: NCallbacks.CallbackSettings<Types, Target>['do'],
        data: NCallbacks.CallbackBaseSettings = {},
    ): NCallbacks.AddedCallback {
        const id = randID('callback');
        const obj: NCallbacks.CallbacksData<Types> = {
            id,
            on: true,
            data: {
                target,
                // @ts-ignore
                do: func,
                ...data,
            },
        };

        this._callbacks.push(obj);
        this._onAdd(id);

        return {
            id,
            remove: this.remove.bind(this, id),
        };
    }

    /**
     * Use it to implement some actions after adding a callback.
     */
    protected _onAdd (id: string) {
        // code
    }



    /**
     * Remove a callback.
     */
    public remove (
        id: string,
        removeProtected = false,
    ): boolean {
        // remove the callback and get new ones
        let removed = false;
        const newCallbacks = this._callbacks.filter((callback) => {
            // if not ID overlap
            if (callback.id !== id) {
                return true;
            }
            // to be removed
            const { data } = callback;
            if (data.protected && !removeProtected) {
                return true;
            }
            this._onRemove(id);
            removed = true;
            return false;
        });

        // replace the callbacks' array
        this._callbacks = newCallbacks;

        // return results
        return removed;
    }

    /**
     * Use it to implement some actions after removing a callback.
     */
    protected _onRemove (id: string) {
        // code
    }

    /**
     * Remove all callbacks.
     */
    public removeAll (
        removeProtected = false,
    ) {
        while (this._callbacks.length > 0) {
            this.remove(this._callbacks[0].id, removeProtected);
        }
    }



    /**
     * Enable/disable a callback.
     * @param id - ID of the callback
     * @param enabled - True to enable, false to disable.
     */
    public turn (
        id: string,
        enabled = true,
    ): boolean {
        const callback = this.get(id);
        if (callback) {
            callback.on = enabled;
            this._onTurn(id);
            return true;
        }

        return false;
    }

    /**
     * Use it to implement some actions after enabling or disabling a callback.
     */
    protected _onTurn (id: string) {
        // code
    }



    /**
     * Get a callback by id
     */
    public get (
        id: string,
    ): false | NCallbacks.CallbacksData<Types> {
        const callbacks = this._callbacks.filter((callback) => callback.id === id);
        if (callbacks.length > 0) {
            return callbacks[0];
        }
        return false;
    }



    /**
     * Trigger a callback. It will work only if the callback is enabled.
     */
    protected _trigger <Target extends keyof Types> (
        callback: NCallbacks.SingleCallbackData<Types, Target>,
        arg: Types[Target],
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
            } else {
                timeoutCallback(
                    this._triggerFunc.bind(this, func, false),
                    timeout,
                );
            }
        } else if (arg) {
            this._triggerFunc(func, arg);
        } else {
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
        arg: false | any,
    ) {
        if (arg) {
            func(arg);
        } else {
            func();
        }
    }

    /**
     * Trigger all enabled callbacks under a certain target name. (TBT: Trigger by target).
     */
    public tbt <T extends keyof Types> (
        target: T,
        arg: Types[T],
    ) {
        this._callbacks.forEach((callback) => {
            if (callback.data.target === target) {
                this._trigger(callback, arg);
            }
        });
    }



    /**
     * Destroy the callbacks
     */
    public destroy () {
        this.removeAll(true);
    }
}
