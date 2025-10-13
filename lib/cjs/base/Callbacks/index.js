"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Callbacks = void 0;
var common_1 = require("../../utils/common");
__exportStar(require("./types"), exports);
/**
 * Manages event callbacks with features like one-time execution, protection, and delays.
 *
 * @group Base
 */
var Callbacks = /** @class */ (function () {
    function Callbacks() {
        /** Storage for registered callbacks. */
        this._list = [];
    }
    Object.defineProperty(Callbacks.prototype, "list", {
        /** Returns the list of all registered callbacks. */
        get: function () {
            return this._list;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Registers a callback for an event.
     * @param target - Event name to associate the callback with.
     * @param action - Function to execute on the event.
     * @param settings - Optional callback settings (e.g., timeout, one-time).
     * @returns Callback ID and a removal function.
     */
    Callbacks.prototype.add = function (target, action, settings) {
        var _this = this;
        if (settings === void 0) { settings = {}; }
        var id = (0, common_1.uid)('callback');
        this._list.push(__assign(__assign({}, settings), { id: id, target: target, action: action }));
        return { id: id, remove: function () { return _this.remove(id); } };
    };
    /**
     * Adds a callback and returns a destructor to remove it.
     * @param target - Event name to associate the callback with.
     * @param action - Function to execute on the event.
     * @param settings - Optional callback settings (e.g., timeout, one-time).
     * @returns A function to remove the callback.
     */
    Callbacks.prototype.on = function (target, action, settings) {
        if (settings === void 0) { settings = {}; }
        var callback = this.add(target, action, settings);
        return function () {
            callback.remove();
        };
    };
    /**
     * Removes a callback by its ID.
     * @param id - ID of the callback to remove.
     * @returns `true` if the callback was removed, `false` otherwise.
     */
    Callbacks.prototype.remove = function (id) {
        return this._remove(id);
    };
    /**
     * Removes a callback, with an option to force removal of protected callbacks.
     * @param callbackId - ID of the callback to remove.
     * @param canRemoveProtected - Whether to forcibly remove protected callbacks.
     * @returns `true` if the callback was removed, `false` otherwise.
     */
    Callbacks.prototype._remove = function (callbackId, canRemoveProtected) {
        if (canRemoveProtected === void 0) { canRemoveProtected = false; }
        this._list = this._list.filter(function (callback) {
            if (callback.id !== callbackId) {
                return true;
            }
            if (callback.protected && !canRemoveProtected) {
                return true;
            }
            return false;
        });
        var hasCallback = this._list.some(function (_a) {
            var id = _a.id;
            return id === callbackId;
        });
        return !hasCallback;
    };
    /** Removes all callbacks, including protected ones. */
    Callbacks.prototype._removeAll = function () {
        while (this._list.length > 0) {
            this._remove(this._list[0].id, true);
        }
    };
    /**
     * Executes a callback and removes it if marked as `isOnce`.
     * @param callback - Callback to execute.
     * @param parameter - Argument to pass to the callback.
     */
    Callbacks.prototype._callAction = function (_a, parameter) {
        var id = _a.id, timeout = _a.timeout, action = _a.action, callback = __rest(_a, ["id", "timeout", "action"]);
        if (timeout) {
            setTimeout(function () { return action(parameter); }, timeout);
        }
        else {
            action(parameter);
        }
        if (callback.once) {
            this._remove(id, true);
        }
    };
    /**
     * Triggers all callbacks for a given event.
     * @param target - Event name to trigger.
     * @param arg - Argument to pass to the callbacks.
     */
    Callbacks.prototype.emit = function (target, arg) {
        var _this = this;
        this._list.forEach(function (callback) {
            if (callback.target === target) {
                _this._callAction(callback, arg);
            }
        });
    };
    /** Removes all registered callbacks. */
    Callbacks.prototype.destroy = function () {
        this._removeAll();
    };
    return Callbacks;
}());
exports.Callbacks = Callbacks;
//# sourceMappingURL=index.js.map