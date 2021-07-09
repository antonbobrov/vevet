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
