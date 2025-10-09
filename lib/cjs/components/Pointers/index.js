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
exports.Pointers = void 0;
var base_1 = require("../../base");
var utils_1 = require("../../utils");
var initVevet_1 = require("../../global/initVevet");
var styles_1 = require("./styles");
__exportStar(require("./types"), exports);
/**
 * Manages pointer events, including tracking multiple pointers,
 * and emitting callbacks for pointer interactions.
 *
 * For proper functionality, ensure the container has an appropriate
 * [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) property.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Pointers)
 *
 * @group Components
 */
var Pointers = /** @class */ (function (_super) {
    __extends(Pointers, _super);
    function Pointers(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Stores active event listeners for runtime interactions.
         */
        _this._listeners = [];
        /** Indicates whether the `start` event has been triggered. */
        _this._isStarted = false;
        // Defaults
        _this._pointersMap = new Map();
        // Setup base events
        _this._setBaseEvents();
        return _this;
    }
    /**
     * Returns the default static properties.
     */
    Pointers.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { buttons: [0], relative: false, minPointers: 1, maxPointers: 5, disableUserSelect: true });
    };
    /**
     * Returns the default mutable properties.
     */
    Pointers.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { enabled: true });
    };
    Object.defineProperty(Pointers.prototype, "isStarted", {
        /** Indicates whether the `start` event has been triggered. */
        get: function () {
            return this._isStarted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointers.prototype, "pointersMap", {
        /** Returns the map of active pointers. */
        get: function () {
            return this._pointersMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointers.prototype, "container", {
        /** Returns the container element handling events. */
        get: function () {
            return this.props.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointers.prototype, "minPointers", {
        /** Returns the minimum number of pointers required to trigger events. */
        get: function () {
            return (0, utils_1.clamp)(this.props.minPointers, 1, Infinity);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointers.prototype, "maxPointers", {
        /** Returns the maximum number of pointers that can be tracked. */
        get: function () {
            return (0, utils_1.clamp)(this.props.maxPointers, this.props.minPointers, Infinity);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Attaches base event listeners to the container.
     */
    Pointers.prototype._setBaseEvents = function () {
        var _this = this;
        var container = this.container;
        var pointerdown = (0, utils_1.addEventListener)(container, 'pointerdown', function (event) {
            return _this._handlePointerDown(event);
        });
        var dragstart = (0, utils_1.addEventListener)(container, 'dragstart', function (event) { return event.preventDefault(); }, { passive: false });
        var centralMouseDown = (0, utils_1.addEventListener)(container, 'mousedown', function (event) {
            if (_this.props.buttons.includes(1)) {
                event.preventDefault();
            }
        }, { passive: false });
        var contextmenu = (0, utils_1.addEventListener)(container, 'contextmenu', function (event) {
            if (_this.props.buttons.includes(2)) {
                event.preventDefault();
            }
        }, { passive: false });
        this.onDestroy(function () {
            pointerdown();
            dragstart();
            centralMouseDown();
            contextmenu();
        });
    };
    /**
     * Attaches runtime event listeners for active pointer interactions.
     */
    Pointers.prototype._setRuntimeEvents = function () {
        var _this = this;
        var listeners = this._listeners;
        if (listeners.length > 0) {
            return;
        }
        var pointermove = (0, utils_1.addEventListener)(window, 'pointermove', function (event) { return _this._handlePointerMove(event); }, { passive: false });
        var pointerup = (0, utils_1.addEventListener)(window, 'pointerup', function (event) { return _this._handlePointerUp(event); }, { passive: false });
        var pointercancel = (0, utils_1.addEventListener)(window, 'pointercancel', function () { return _this._handleCancel(); }, { passive: false });
        var blur = (0, utils_1.addEventListener)(window, 'blur', function () { return _this._handleCancel(); });
        this._listeners = [pointermove, pointerup, pointercancel, blur];
    };
    /**
     * Handles pointer down events (`pointerdown`).
     * Adds a new pointer if conditions are met and triggers the `pointerdown` callback.
     */
    Pointers.prototype._handlePointerDown = function (event) {
        var props = this.props;
        var _a = this._decodeCoords(event), x = _a.x, y = _a.y;
        if (!props.enabled) {
            return;
        }
        // check if button type is allowed
        if (!props.buttons.includes(event.button)) {
            return;
        }
        // Check if pointer already exists or no more pointers allowed
        var hasPointer = this.pointersMap.get(event.pointerId);
        if (hasPointer || this.pointersMap.size >= this.maxPointers) {
            return;
        }
        // Add new pointer
        var pointer = {
            id: event.pointerId,
            index: this.pointersMap.size,
            start: { x: x, y: y },
            prev: { x: x, y: y },
            current: { x: x, y: y },
            diff: { x: 0, y: 0 },
            step: { x: 0, y: 0 },
            accum: { x: 0, y: 0 },
        };
        this.pointersMap.set(event.pointerId, pointer);
        // update indices
        var index = 0;
        this.pointersMap.forEach(function (currentPointer) {
            // eslint-disable-next-line no-param-reassign
            currentPointer.index = index;
            index += 1;
        });
        // Start callback
        if (this.pointersMap.size === this.minPointers) {
            this._isStarted = true;
            this.callbacks.emit('start', undefined);
        }
        // Add runtime events
        this._setRuntimeEvents();
        // Apply styles to prevent user-select
        if (props.disableUserSelect) {
            (0, initVevet_1.initVevet)().body.append(styles_1.styles);
        }
        // Trigger start callback
        this.callbacks.emit('pointerdown', { event: event, pointer: pointer });
    };
    /**
     * Handles pointer movement (`pointermove`).
     * Updates pointer positions and triggers the `pointermove` callback.
     */
    Pointers.prototype._handlePointerMove = function (event) {
        var pointer = this.pointersMap.get(event.pointerId);
        if (!pointer) {
            return;
        }
        var _a = this._decodeCoords(event), x = _a.x, y = _a.y;
        // Update previous and current coordinates
        pointer.prev = __assign({}, pointer.current);
        pointer.current = { x: x, y: y };
        // Update diff
        pointer.diff.x = pointer.current.x - pointer.start.x;
        pointer.diff.y = pointer.current.y - pointer.start.y;
        // Update step
        pointer.step.x = pointer.current.x - pointer.prev.x;
        pointer.step.y = pointer.current.y - pointer.prev.y;
        // Update total movement
        pointer.accum.x += Math.abs(pointer.step.x);
        pointer.accum.y += Math.abs(pointer.step.y);
        // Trigger 'move' callback with relevant data
        this.callbacks.emit('pointermove', { event: event, pointer: pointer });
    };
    /**
     * Handles pointer release (`pointerup`).
     * Removes the pointer and triggers the `pointerup` callback.
     * If no active pointers remain, fires the `end` callback.
     */
    Pointers.prototype._handlePointerUp = function (event) {
        // check if pointer exists
        var pointer = this.pointersMap.get(event.pointerId);
        if (!pointer) {
            return;
        }
        // Trigger callbacks
        this.callbacks.emit('pointerup', { pointer: pointer });
        // delete pointer
        this.pointersMap.delete(event.pointerId);
        // end if no pointers left
        if (this.pointersMap.size < this.minPointers && this._isStarted) {
            this._isStarted = false;
            this.callbacks.emit('end', undefined);
        }
        // cancel
        if (this.pointersMap.size === 0) {
            this._cleanup();
        }
    };
    /**
     * Handles event cancellations (`pointercancel`, `blur`).
     * Triggers the `end` callback and cleans up all pointers.
     */
    Pointers.prototype._handleCancel = function () {
        var _this = this;
        this.callbacks.emit('end', undefined);
        // Trigger callbacks for all pointers
        this.pointersMap.forEach(function (pointer) {
            _this.callbacks.emit('pointerup', { pointer: pointer });
        });
        this._cleanup();
    };
    /**
     * Prevents text selection during pointer interactions.
     */
    Pointers.prototype._resetSelection = function () {
        var _a, _b;
        (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.empty();
        (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.removeAllRanges();
    };
    /**
     * Returns pointer coordinates relative to the container.
     */
    Pointers.prototype._decodeCoords = function (event) {
        var _a = this, container = _a.container, props = _a.props;
        if (!props.relative) {
            return { x: event.clientX, y: event.clientY };
        }
        var bounding = container.getBoundingClientRect();
        var x = event.clientX - bounding.left;
        var y = event.clientY - bounding.top;
        return { x: x, y: y };
    };
    /**
     * Cleans up event listeners, pointers, and injected styles.
     */
    Pointers.prototype._cleanup = function () {
        this._listeners.forEach(function (listener) { return listener(); });
        this._listeners = [];
        this._isStarted = false;
        this.pointersMap.clear();
        if (this.props.disableUserSelect) {
            this._resetSelection();
            styles_1.styles === null || styles_1.styles === void 0 ? void 0 : styles_1.styles.remove();
        }
    };
    /**
     * Destroys the component and removes all event listeners.
     */
    Pointers.prototype._destroy = function () {
        this._cleanup();
        _super.prototype._destroy.call(this);
    };
    return Pointers;
}(base_1.Module));
exports.Pointers = Pointers;
//# sourceMappingURL=index.js.map