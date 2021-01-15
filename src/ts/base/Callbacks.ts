import generateID from '../utils/common/generateID';
import timeoutCallback from '../utils/common/timeoutCallback';
import { Application } from '../app/Application';

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
    constructor () {

        this._app = window.vevetApp;
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
     * @param target - Callback target
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

        const id = generateID('callback');
        const obj: NCallbacks.CallbacksData<Types> = {
            id,
            on: true,
            data: {
                target,
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
        this.get(id);
    }



    /**
     * Remove a callback.
     */
    public remove (
        id: string,
    ): boolean {

        const callbacks = this._callbacks;
        const newCallbacks: NCallbacks.CallbacksData<Types>[] = [];
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
            let isProtected = false;
            if (callback.data.protected) {
                isProtected = true;
            }

            // remove the callback if not protected
            if (!isProtected) {
                this._onRemove(id);
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
    protected _onRemove (id: string) {
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
        this.get(id);
    }



    /**
     * Get a callback by id
     */
    public get (
        id: string,
    ): false | NCallbacks.CallbacksData<Types> {

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
        arg: false | any,
    ) {

        if (arg) {
            func(arg);
        }
        else {
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

        for (let i = 0; i < this._callbacks.length; i++) {
            if (this._callbacks[i].data.target === target) {
                this._trigger(this._callbacks[i], arg);
            }
        }

    }



    /**
     * Destroy the callbacks
     */
    public destroy () {

        // remove all callbakcs, event protected
        const callbacks = this._callbacks;
        for (let i = 0, l = callbacks.length; i < l; i++) {
            const callback = callbacks[i];
            this._onRemove(callback.id);
        }
        this._callbacks = [];

    }

}



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
