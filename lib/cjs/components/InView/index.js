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
exports.InView = void 0;
var math_1 = require("../../utils/math");
var Module_1 = require("../../base/Module");
var initVevet_1 = require("../../global/initVevet");
__exportStar(require("./types"), exports);
/**
 * InView is a visibility detection utility that leverages the `IntersectionObserver` API to monitor when elements enter or leave the viewport.
 * It provides customizable options for triggering events, delaying visibility changes, and dynamically adding CSS classes to elements based on their visibility state.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/InView)
 *
 * @group Components
 */
var InView = /** @class */ (function (_super) {
    __extends(InView, _super);
    /**
     * Initializes the `InView` module.
     */
    function InView(props) {
        var _this = _super.call(this, props) || this;
        /** Tracks whether this is the first time the elements are being observed. */
        _this._isInitialStart = true;
        /** Stores the elements being observed. */
        _this._elements = [];
        _this._setup();
        return _this;
    }
    /**
     * Returns default static properties.
     */
    InView.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { hasOut: true, maxInitialDelay: 1000, scrollDirection: 'vertical' });
    };
    /**
     * Returns default mutable properties.
     */
    InView.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { enabled: true, rootMargin: '0% 0% -5% 0%' });
    };
    Object.defineProperty(InView.prototype, "isInitialStart", {
        /**
         * Indicates whether the observation has started for the first time.
         */
        get: function () {
            return this._isInitialStart;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InView.prototype, "elements", {
        /**
         * Returns all elements currently being observed.
         */
        get: function () {
            return this._elements;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Handles property mutations and updates observation events accordingly.
     */
    InView.prototype._handleProps = function () {
        _super.prototype._handleProps.call(this);
        this._setup();
    };
    /**
     * Configures or reconfigures the view observation events.
     */
    InView.prototype._setup = function () {
        this._removeViewEvents();
        if (this.props.enabled) {
            this._setViewEvents();
        }
    };
    /**
     * Removes all observation events and disconnects observers.
     */
    InView.prototype._removeViewEvents = function () {
        var _a, _b;
        (_a = this._observerIn) === null || _a === void 0 ? void 0 : _a.disconnect();
        this._observerIn = undefined;
        (_b = this._observerOut) === null || _b === void 0 ? void 0 : _b.disconnect();
        this._observerOut = undefined;
    };
    /**
     * Sets up `IntersectionObserver` instances to detect visibility changes.
     */
    InView.prototype._setViewEvents = function () {
        var _this = this;
        var _a = this, isInitialStart = _a.isInitialStart, props = _a.props;
        var rootMargin = isInitialStart ? '0% 0% 0% 0%' : props.rootMargin;
        this._observerIn = new IntersectionObserver(function (data) { return _this._handleIn(data); }, { root: null, threshold: 0, rootMargin: rootMargin });
        this.elements.forEach(function (element) { var _a; return (_a = _this._observerIn) === null || _a === void 0 ? void 0 : _a.observe(element); });
        if (props.hasOut) {
            this._observerOut = new IntersectionObserver(function (data) { return _this._handleOut(data); }, { root: null, threshold: 0, rootMargin: '0px 0px 0px 0px' });
            this.elements.forEach(function (element) { var _a; return (_a = _this._observerOut) === null || _a === void 0 ? void 0 : _a.observe(element); });
        }
    };
    /**
     * Handles elements entering the viewport.
     */
    InView.prototype._handleIn = function (data) {
        var _this = this;
        data.forEach(function (entry) {
            var element = entry.target;
            if (!entry.isIntersecting || element.$vevetInViewBool) {
                return;
            }
            element.$vevetInViewBool = true;
            if (element.$vevetInViewTimeout) {
                clearTimeout(element.$vevetInViewTimeout);
            }
            element.$vevetInViewTimeout = setTimeout(function () { return _this._handleInOut(element, true); }, _this._getElementDelay(element));
            if (!_this.props.hasOut) {
                _this.removeElement(element);
            }
        });
        if (this._isInitialStart) {
            this._isInitialStart = false;
            this._setup();
        }
    };
    /**
     * Handles elements leaving the viewport.
     */
    InView.prototype._handleOut = function (data) {
        var _this = this;
        data.forEach(function (entry) {
            var element = entry.target;
            if (entry.isIntersecting || !element.$vevetInViewBool) {
                return;
            }
            element.$vevetInViewBool = false;
            if (element.$vevetInViewTimeout) {
                clearTimeout(element.$vevetInViewTimeout);
            }
            element.$vevetInViewTimeout = setTimeout(function () {
                _this._handleInOut(element, false);
            }, 0);
        });
    };
    /**
     * Toggles visibility classes and emits events for visibility changes.
     */
    InView.prototype._handleInOut = function (element, isInView) {
        var className = element.getAttribute('data-in-view-class');
        if (className) {
            element.classList.toggle(className, isInView);
        }
        this.callbacks.emit(isInView ? 'in' : 'out', { element: element });
    };
    /**
     * Calculates the delay before triggering an element's visibility event.
     */
    InView.prototype._getElementDelay = function (element) {
        var props = this.props;
        var app = (0, initVevet_1.initVevet)();
        if (!this.isInitialStart || props.maxInitialDelay <= 0) {
            return 0;
        }
        var bounding = element.getBoundingClientRect();
        var rootBounding = {
            top: 0,
            left: 0,
            width: app.width,
            height: app.height,
        };
        var progress = (0, math_1.clamp)(props.scrollDirection === 'horizontal'
            ? (bounding.left - rootBounding.left) / rootBounding.width
            : (bounding.top - rootBounding.top) / rootBounding.height, 0, 1);
        return progress * props.maxInitialDelay;
    };
    /**
     * Registers an element for visibility observation.
     *
     * If the element has a `data-in-view-class` attribute, the specified class will be applied upon entering the viewport.
     *
     * @returns A function to stop observing the element.
     */
    InView.prototype.addElement = function (element) {
        var _this = this;
        var _a, _b;
        var finalElement = element;
        finalElement.$vevetInViewBool = undefined;
        this._elements.push(finalElement);
        (_a = this._observerIn) === null || _a === void 0 ? void 0 : _a.observe(finalElement);
        (_b = this._observerOut) === null || _b === void 0 ? void 0 : _b.observe(finalElement);
        return function () { return _this.removeElement(finalElement); };
    };
    /**
     * Removes an element from observation, preventing further visibility tracking.
     */
    InView.prototype.removeElement = function (element) {
        var _a, _b;
        var finalElement = element;
        (_a = this._observerIn) === null || _a === void 0 ? void 0 : _a.unobserve(finalElement);
        (_b = this._observerOut) === null || _b === void 0 ? void 0 : _b.unobserve(finalElement);
        this._elements = this._elements.filter(function (el) { return el !== element; });
        finalElement.$vevetInViewBool = undefined;
    };
    /**
     * Cleans up the module and disconnects all observers and listeners.
     */
    InView.prototype._destroy = function () {
        _super.prototype._destroy.call(this);
        this._removeViewEvents();
    };
    return InView;
}(Module_1.Module));
exports.InView = InView;
//# sourceMappingURL=index.js.map