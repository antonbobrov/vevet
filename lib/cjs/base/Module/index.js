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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
var Callbacks_1 = require("../Callbacks");
var mergeWithNoUndefined_1 = require("../../internal/mergeWithNoUndefined");
// todo: jsdoc
__exportStar(require("./types"), exports);
/**
 * A base class for modules that handle responsive properties, event listeners, and custom callbacks.
 *
 * @group Base
 */
var Module = /** @class */ (function () {
    /**
     * Creates a new instance of the Module class.
     */
    function Module(props) {
        /** Tracks whether the module has been destroyed */
        this._isDestroyed = false;
        /** Stores actions that need to be executed when the module is destroyed */
        this._destroyable = [];
        this._callbacks = new Callbacks_1.Callbacks();
        this._props = (0, mergeWithNoUndefined_1.mergeWithNoUndefined)(__assign(__assign({}, this._getStatic()), this._getMutable()), __assign({}, props));
    }
    /** Get default static props */
    Module.prototype._getStatic = function () {
        return { __staticProp: null };
    };
    /** Set default mutable props */
    Module.prototype._getMutable = function () {
        return { __mutableProp: null };
    };
    Object.defineProperty(Module.prototype, "props", {
        /**
         * Current properties. Do not mutate these directly, use {@linkcode updateProps} instead.
         */
        get: function () {
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "prefix", {
        /** Optional prefix for classnames used by the module */
        get: function () {
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "name", {
        /** The name of the module, derived from the class name */
        get: function () {
            return this.constructor.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "isDestroyed", {
        /**
         * Checks if the module has been destroyed.
         */
        get: function () {
            return this._isDestroyed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "callbacks", {
        /**
         * Retrieves the module's callbacks instance.
         */
        get: function () {
            return this._callbacks;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Method that is called when the module's properties mutate. In most cases, used to handle callbacks.
     */
    Module.prototype._handleProps = function () {
        this.callbacks.emit('props', undefined);
    };
    /** Change module's mutable properties */
    Module.prototype.updateProps = function (props) {
        this._props = __assign(__assign({}, this._props), props);
        this._handleProps();
    };
    /**
     * Adds a callback on the module's destruction.
     *
     * @param action - The function to execute during destruction.
     */
    Module.prototype.onDestroy = function (action) {
        this._destroyable.push(action);
    };
    /**
     * Adds a custom callback to the module.
     *
     * @param target - The event type to listen for (e.g., 'props', 'destroy').
     * @param listener - The function to execute when the event is triggered.
     * @param settings - Additional settings for the callback.
     */
    Module.prototype.on = function (target, listener, settings) {
        if (settings === void 0) { settings = {}; }
        return this.callbacks.on(target, listener, settings);
    };
    /**
     * Helper function to generate classnames with the module's prefix.
     *
     * @param classNames - The class names to generate.
     * @returns A string of class names with the module's prefix applied.
     */
    Module.prototype._cn = function () {
        var _this = this;
        var classNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classNames[_i] = arguments[_i];
        }
        return classNames.map(function (value) { return "".concat(_this.prefix).concat(value); }).join(' ');
    };
    /**
     * Adds a class name on an element, and keeps track of it for removal when the module is destroyed.
     *
     * @param element - The target DOM element.
     * @param className - The class name to toggle.
     */
    Module.prototype._addTempClassName = function (element, className) {
        var isAlreadyExists = element.classList.contains(className);
        if (!isAlreadyExists) {
            element.classList.add(className);
            this.onDestroy(function () { return element.classList.remove(className); });
        }
    };
    /**
     * Destroys the module, cleaning up resources, callbacks, and event listeners.
     */
    Module.prototype.destroy = function () {
        if (this.isDestroyed) {
            return;
        }
        this._destroy();
    };
    /**
     * Internal method to handle the destruction of the module.
     * It removes all callbacks, destroys properties, and cleans up event listeners and class names.
     */
    Module.prototype._destroy = function () {
        this._callbacks.emit('destroy', undefined);
        this._callbacks.destroy();
        this._destroyable.forEach(function (action) { return action(); });
        this._isDestroyed = true;
    };
    return Module;
}());
exports.Module = Module;
//# sourceMappingURL=index.js.map