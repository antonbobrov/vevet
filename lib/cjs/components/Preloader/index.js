"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Preloader = void 0;
var Module_1 = require("../../base/Module");
var Timeline_1 = require("../Timeline");
var initVevet_1 = require("../../global/initVevet");
__exportStar(require("./types"), exports);
/**
 * Page preloader component that manages the visibility and lifecycle of a loading screen.
 * The module does not provide styling for the container.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Preloader)
 *
 * @group Components
 */
var Preloader = /** @class */ (function (_super) {
    __extends(Preloader, _super);
    function Preloader(props) {
        var _this = _super.call(this, props) || this;
        /** Indicates if the preloader is in the process of being hidden. */
        _this._shouldHide = false;
        /** Indicates if the preloader has already been hidden. */
        _this._isHidden = false;
        /** Indicates if the page is fully loaded. */
        _this._isLoaded = false;
        // Handle page load event
        var timeout = setTimeout(function () {
            _this._onLoaded(function () { return _this._handleLoaded(); });
        }, 0);
        _this.onDestroy(function () { return clearTimeout(timeout); });
        return _this;
    }
    /**
     * Retrieves the default static properties.
     */
    Preloader.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { hide: 250 });
    };
    /**
     * Retrieves the default mutable properties.
     */
    Preloader.prototype._getMutable = function () {
        return __assign({}, _super.prototype._getMutable.call(this));
    };
    Object.defineProperty(Preloader.prototype, "isHidden", {
        /**
         * Returns whether the preloader is currently hidden.
         */
        get: function () {
            return this._isHidden;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Handles the page load event, triggering when the page is fully loaded.
     */
    Preloader.prototype._onLoaded = function (callback) {
        (0, initVevet_1.initVevet)().onLoad(callback);
    };
    /**
     * Handles the logic that occurs after the page is fully loaded.
     */
    Preloader.prototype._handleLoaded = function () {
        if (this.isDestroyed) {
            return;
        }
        this._isLoaded = true;
        this.callbacks.emit('loaded', undefined);
        if (typeof this.props.hide === 'number') {
            this.hide(this.props.hide);
        }
    };
    /**
     * Hides the preloader with a custom animation duration.
     *
     * @param duration - The duration of the hide animation (in milliseconds). Applies only when the container is used.
     * @param callback - The callback to execute when the hide animation is complete.
     *
     * @returns Returns an action destructor.
     */
    Preloader.prototype.hide = function (duration, callback) {
        var _this = this;
        if (!this._isLoaded || this._shouldHide) {
            return undefined;
        }
        var isDestroyed = false;
        this._shouldHide = true;
        this.callbacks.emit('hide', undefined);
        this._hideContainer(function () {
            _this._onHidden();
            if (!isDestroyed) {
                callback === null || callback === void 0 ? void 0 : callback();
            }
        }, duration);
        return function () {
            isDestroyed = true;
        };
    };
    /**
     * Executes the hiding animation for the preloader container.
     */
    Preloader.prototype._hideContainer = function (onHidden, duration) {
        var container = this.props.container;
        if (!container) {
            onHidden();
            return;
        }
        var tm = new Timeline_1.Timeline({ duration: duration });
        this.onDestroy(function () { return tm.destroy(); });
        tm.on('update', function (_a) {
            var progress = _a.progress;
            container.style.opacity = String(1 - progress);
            container.style.display = progress === 1 ? 'none' : 'flex';
        });
        tm.on('end', function () { return onHidden(); });
        tm.play();
    };
    /**
     * Handles actions when the preloader is fully hidden.
     */
    Preloader.prototype._onHidden = function () {
        this._isHidden = true;
        this.callbacks.emit('hidden', undefined);
    };
    /**
     * Registers a callback for when the preloader starts hiding.
     *
     * @param action - The callback function to execute.
     * @returns A destructor.
     */
    Preloader.prototype.onHide = function (action) {
        if (this._shouldHide) {
            action();
            return function () { };
        }
        return this.on('hide', (function () { return action(); }));
    };
    /**
     * Registers a callback for when the preloader is fully hidden.
     *
     * @param action - The callback function to execute.
     * @returns A destructor.
     */
    Preloader.prototype.onHidden = function (action) {
        if (this._isHidden) {
            action();
            return function () { };
        }
        return this.on('hidden', (function () { return action(); }));
    };
    return Preloader;
}(Module_1.Module));
exports.Preloader = Preloader;
//# sourceMappingURL=index.js.map