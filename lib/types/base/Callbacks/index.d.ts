import { ICallback, ICallbacksSettings, ICallbacksMap, TCallbacksAction } from './types';
export * from './types';
/**
 * Manages event callbacks with features like one-time execution, protection, and delays.
 *
 * @group Base
 */
export declare class Callbacks<Types extends ICallbacksMap = ICallbacksMap> {
    /** Storage for registered callbacks. */
    private _list;
    /** Returns the list of all registered callbacks. */
    get list(): ICallback<Types>[];
    /**
     * Registers a callback for an event.
     * @param target - Event name to associate the callback with.
     * @param action - Function to execute on the event.
     * @param settings - Optional callback settings (e.g., timeout, one-time).
     * @returns Callback ID and a removal function.
     */
    add<T extends keyof Types>(target: T, action: TCallbacksAction<Types[T]>, settings?: ICallbacksSettings): {
        id: string;
        remove: () => boolean;
    };
    /**
     * Adds a callback and returns a destructor to remove it.
     * @param target - Event name to associate the callback with.
     * @param action - Function to execute on the event.
     * @param settings - Optional callback settings (e.g., timeout, one-time).
     * @returns A function to remove the callback.
     */
    on<T extends keyof Types>(target: T, action: TCallbacksAction<Types[T]>, settings?: ICallbacksSettings): () => void;
    /**
     * Removes a callback by its ID.
     * @param id - ID of the callback to remove.
     * @returns `true` if the callback was removed, `false` otherwise.
     */
    remove(id: string): boolean;
    /**
     * Removes a callback, with an option to force removal of protected callbacks.
     * @param callbackId - ID of the callback to remove.
     * @param canRemoveProtected - Whether to forcibly remove protected callbacks.
     * @returns `true` if the callback was removed, `false` otherwise.
     */
    private _remove;
    /** Removes all callbacks, including protected ones. */
    private _removeAll;
    /**
     * Executes a callback and removes it if marked as `isOnce`.
     * @param callback - Callback to execute.
     * @param parameter - Argument to pass to the callback.
     */
    private _callAction;
    /**
     * Triggers all callbacks for a given event.
     * @param target - Event name to trigger.
     * @param arg - Argument to pass to the callbacks.
     */
    emit<T extends keyof Types>(target: T, arg: Types[T]): void;
    /** Removes all registered callbacks. */
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map