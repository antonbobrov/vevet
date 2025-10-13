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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marquee = void 0;
var math_1 = require("../../utils/math");
var listeners_1 = require("../../utils/listeners");
var Module_1 = require("../../base/Module");
var Raf_1 = require("../Raf");
var initVevet_1 = require("../../global/initVevet");
var utils_1 = require("../../utils");
__exportStar(require("./types"), exports);
/**
 * A custom marquee component that smoothly scrolls its child elements.
 *
 * This component is designed to loop elements horizontally within a container,
 * with support for customization such as speed, gap, pause on hover, and more.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Marquee)
 *
 * @group Components
 */
var Marquee = /** @class */ (function (_super) {
    __extends(Marquee, _super);
    function Marquee(props) {
        var _this = _super.call(this, props) || this;
        /** Current container width */
        _this._width = 0;
        /** Initial child nodes of the container */
        _this._initialNodes = [];
        /** Array of marquee element nodes */
        _this._elements = [];
        /** Array of widths of each child element */
        _this._widths = [];
        /** Total width of all elements in the marquee */
        _this._totalWidth = 0;
        /** The current X coordinate of the marquee. */
        _this._x = 0;
        var container = _this.props.container;
        if (!container) {
            throw new Error('Marquee container is not defined');
        }
        // Apply base styles to the container
        container.style.position = 'relative';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'flex-start';
        container.style.width = '100%';
        container.style.overflow = 'hidden';
        // Setup elements in the marquee
        _this._setup();
        // Create animation frame
        _this._raf = new Raf_1.Raf({ enabled: _this.props.enabled, fpsRecalcFrames: 1 });
        _this._raf.on('frame', function () {
            var factor = _this.props.adjustSpeed ? _this._raf.fpsFactor : 1;
            var speed = (0, utils_1.toPixels)(_this.props.speed);
            _this._render(speed * factor);
        });
        // Pause on hover
        var mouseenter = (0, listeners_1.addEventListener)(container, 'mouseenter', function () {
            if (_this.props.pauseOnHover) {
                _this._raf.pause();
            }
        });
        _this.onDestroy(function () { return mouseenter(); });
        // Resume on mouse leave
        var mouseleave = (0, listeners_1.addEventListener)(container, 'mouseleave', function () {
            if (_this.props.enabled) {
                _this._raf.play();
            }
        });
        _this.onDestroy(function () { return mouseleave(); });
        // Intersection observer
        _this._intersection = new IntersectionObserver(_this._handleIntersection.bind(_this), { root: null });
        _this._intersection.observe(container);
        return _this;
    }
    /** Get default static properties. */
    Marquee.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { resizeDebounce: 0, hasWillChange: true, cloneNodes: true });
    };
    /** Get default mutable properties. */
    Marquee.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { speed: 1, gap: 0, enabled: true, pauseOnHover: false, centered: false, adjustSpeed: true, pauseOnOut: true });
    };
    Object.defineProperty(Marquee.prototype, "totalWidth", {
        /** Total width of all elements in the marquee */
        get: function () {
            return this._totalWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Marquee.prototype, "x", {
        /** The current X coordinate of the marquee. */
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            this.render(0);
        },
        enumerable: false,
        configurable: true
    });
    /** Handles property changes  */
    Marquee.prototype._handleProps = function () {
        _super.prototype._handleProps.call(this);
        if (this.props.enabled) {
            this._raf.play();
        }
        else {
            this._raf.pause();
        }
        // Rerender the elements
        this.resize();
        this.render(0);
    };
    /** Initializes the marquee setup, including resizing and cloning elements */
    Marquee.prototype._setup = function () {
        var _this = this;
        var _a;
        (_a = this._lastSetup) === null || _a === void 0 ? void 0 : _a.call(this);
        if (this.isDestroyed) {
            return;
        }
        var _b = this.props, container = _b.container, resizeDebounce = _b.resizeDebounce;
        // Save initial child nodes
        this._initialNodes = __spreadArray([], Array.from(container.childNodes), true);
        // Wrap text node if necessary
        this._wrapTextNode();
        // Store element references
        this._elements = Array.from(container.children);
        // Add necessary styles to elements
        this._elements.forEach(function (element, index) {
            return _this._applyNodeStyles(element, index !== 0);
        });
        // initial resize
        this.resize();
        // Resize on page load
        var onPageLoad = (0, initVevet_1.initVevet)().onLoad(function () { return _this.resize(); });
        // Handle resizing
        var resizeHandler = (0, listeners_1.onResize)({
            callback: function () { return _this.resize(); },
            element: __spreadArray([container], this._elements, true),
            viewportTarget: 'width',
            resizeDebounce: resizeDebounce,
            name: this.name,
        });
        // Setup cleanup function
        this._lastSetup = function () {
            onPageLoad();
            resizeHandler.remove();
        };
    };
    /**
     * Wraps the first text node in the container in a span if no other elements exist.
     */
    Marquee.prototype._wrapTextNode = function () {
        var container = this.props.container;
        var hasOneNode = container.childNodes.length === 1;
        var node = container.childNodes[0];
        // Wrap text node if it's the first child and not already wrapped
        if (!node || node.nodeType !== 3 || !hasOneNode) {
            return;
        }
        var wrapper = document.createElement('span');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'block';
        wrapper.style.width = 'max-content';
        wrapper.style.whiteSpace = 'nowrap';
        wrapper.appendChild(node);
        container.appendChild(wrapper);
    };
    /**
     * Adds necessary styles to a given element.
     */
    Marquee.prototype._applyNodeStyles = function (element, isAbsolute) {
        var el = element;
        el.style.position = isAbsolute ? 'absolute' : 'relative';
        el.style.top = isAbsolute ? '50%' : '0';
        el.style.left = '0';
        el.style.width = element.style.width || 'max-content';
        el.style.willChange = this.props.hasWillChange ? 'transform' : '';
        el.style.flexShrink = '0';
    };
    /** Resizes the marquee, recalculating element positions and cloning if necessary. */
    Marquee.prototype.resize = function () {
        var _this = this;
        if (this.isDestroyed) {
            return;
        }
        var props = this.props;
        var container = props.container;
        var gap = (0, utils_1.toPixels)(props.gap);
        // Update container width
        this._width = container.offsetWidth;
        // Update element widths
        this._widths = this._elements.map(function (element) { return element.offsetWidth + gap; });
        this._totalWidth = this._widths.reduce(function (a, b) { return a + b; }, 0);
        // Determine how many times to duplicate elements
        var maxWidth = Math.max.apply(Math, this._widths);
        var copyQuantity = Math.ceil((this._width + maxWidth) / this._totalWidth);
        // update total width
        this._totalWidth = Math.max(this._totalWidth, this._width + maxWidth);
        // Clone elements if necessary
        if (props.cloneNodes && copyQuantity > 1) {
            for (var i = 1; i < copyQuantity; i += 1) {
                this._elements.forEach(function (element) {
                    var copy = element.cloneNode(true);
                    _this._applyNodeStyles(copy, true);
                    container.appendChild(copy);
                });
            }
            // Update element references after cloning
            this._elements = Array.from(container.children);
            this.resize();
        }
        // Trigger resize callbacks
        this.callbacks.emit('resize', undefined);
        // Rerender the marquee
        setTimeout(function () { return _this.render(0); }, 0);
    };
    /** Renders the marquee, adjusting element positions. */
    Marquee.prototype.render = function (step) {
        this._render(step);
    };
    /**
     * Renders the marquee, calculating element positions based on the provided speed.
     */
    Marquee.prototype._render = function (step) {
        if (step === void 0) { step = this.props.speed; }
        if (this.isDestroyed) {
            return;
        }
        // Update animation time
        this._x -= (0, utils_1.toPixels)(step);
        // Calculate current position of the elements
        var centerX = this._width * 0.5;
        var position = this._x + (this.props.centered ? centerX : 0);
        // Update each element's position
        var prevStaticX = 0;
        for (var index = 0; index < this._elements.length; index += 1) {
            var element = this._elements[index];
            var elementWidth = this._widths[index];
            var x = (0, math_1.loop)(position + prevStaticX, -elementWidth, this._totalWidth - elementWidth);
            // Apply transformations to position the element
            var y = element.style.position === 'relative' ? '0' : '-50%';
            element.style.transform = "translate(".concat(x, "px, ").concat(y, ")");
            prevStaticX += elementWidth;
        }
        // Trigger render callbacks
        this.callbacks.emit('render', undefined);
    };
    /**
     * Handle intersection observer
     */
    Marquee.prototype._handleIntersection = function (entries) {
        var _this = this;
        if (!this.props.pauseOnOut) {
            return;
        }
        entries.forEach(function (entry) {
            if (entry.isIntersecting && _this.props.enabled) {
                _this._raf.play();
            }
            else {
                _this._raf.pause();
            }
        });
    };
    /** Destroys the instance and cleans up resources */
    Marquee.prototype._destroy = function () {
        var _a, _b;
        var container = this.props.container;
        _super.prototype._destroy.call(this);
        this._raf.destroy();
        (_a = this._intersection) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this._lastSetup) === null || _b === void 0 ? void 0 : _b.call(this);
        // Remove all children and restore the initial nodes
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        this._initialNodes.forEach(function (node) { return container.appendChild(node); });
    };
    return Marquee;
}(Module_1.Module));
exports.Marquee = Marquee;
//# sourceMappingURL=index.js.map