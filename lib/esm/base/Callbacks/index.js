var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { uid } from '../../utils/common';
export * from './types';
/**
 * Manages event callbacks with features like one-time execution, protection, and delays.
 *
 * @group Base
 */
export class Callbacks {
    constructor() {
        /** Storage for registered callbacks. */
        this._list = [];
    }
    /** Returns the list of all registered callbacks. */
    get list() {
        return this._list;
    }
    /**
     * Registers a callback for an event.
     * @param target - Event name to associate the callback with.
     * @param action - Function to execute on the event.
     * @param settings - Optional callback settings (e.g., timeout, one-time).
     * @returns Callback ID and a removal function.
     */
    add(target, action, settings = {}) {
        const id = uid('callback');
        this._list.push(Object.assign(Object.assign({}, settings), { id,
            target, action: action }));
        return { id, remove: () => this.remove(id) };
    }
    /**
     * Adds a callback and returns a destructor to remove it.
     * @param target - Event name to associate the callback with.
     * @param action - Function to execute on the event.
     * @param settings - Optional callback settings (e.g., timeout, one-time).
     * @returns A function to remove the callback.
     */
    on(target, action, settings = {}) {
        const callback = this.add(target, action, settings);
        return () => {
            callback.remove();
        };
    }
    /**
     * Removes a callback by its ID.
     * @param id - ID of the callback to remove.
     * @returns `true` if the callback was removed, `false` otherwise.
     */
    remove(id) {
        return this._remove(id);
    }
    /**
     * Removes a callback, with an option to force removal of protected callbacks.
     * @param callbackId - ID of the callback to remove.
     * @param canRemoveProtected - Whether to forcibly remove protected callbacks.
     * @returns `true` if the callback was removed, `false` otherwise.
     */
    _remove(callbackId, canRemoveProtected = false) {
        this._list = this._list.filter((callback) => {
            if (callback.id !== callbackId) {
                return true;
            }
            if (callback.protected && !canRemoveProtected) {
                return true;
            }
            return false;
        });
        const hasCallback = this._list.some(({ id }) => id === callbackId);
        return !hasCallback;
    }
    /** Removes all callbacks, including protected ones. */
    _removeAll() {
        while (this._list.length > 0) {
            this._remove(this._list[0].id, true);
        }
    }
    /**
     * Executes a callback and removes it if marked as `isOnce`.
     * @param callback - Callback to execute.
     * @param parameter - Argument to pass to the callback.
     */
    _callAction(_a, parameter) {
        var { id, timeout, action } = _a, callback = __rest(_a, ["id", "timeout", "action"]);
        if (timeout) {
            setTimeout(() => action(parameter), timeout);
        }
        else {
            action(parameter);
        }
        if (callback.once) {
            this._remove(id, true);
        }
    }
    /**
     * Triggers all callbacks for a given event.
     * @param target - Event name to trigger.
     * @param arg - Argument to pass to the callbacks.
     */
    emit(target, arg) {
        this._list.forEach((callback) => {
            if (callback.target === target) {
                this._callAction(callback, arg);
            }
        });
    }
    /** Removes all registered callbacks. */
    destroy() {
        this._removeAll();
    }
}
//# sourceMappingURL=index.js.map