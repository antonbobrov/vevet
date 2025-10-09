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
exports.Cursor = void 0;
var Module_1 = require("../../base/Module");
var Raf_1 = require("../Raf");
var listeners_1 = require("../../utils/listeners");
var initVevet_1 = require("../../global/initVevet");
var math_1 = require("../../utils/math");
var styles_1 = require("./styles");
__exportStar(require("./types"), exports);
/**
 * A customizable custom cursor component with smooth animations and hover interactions.
 * Supports dynamic appearance changes and enhanced user interaction.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Cursor)
 *
 * @group Components
 */
var Cursor = /** @class */ (function (_super) {
    __extends(Cursor, _super);
    function Cursor(props) {
        var _this = _super.call(this, props) || this;
        /** Defines if the cursor has been moved after initialization */
        _this._isFirstMove = true;
        // Set default variables
        var _a = _this.props, width = _a.width, height = _a.height, isEnabled = _a.enabled;
        _this._coords = { x: 0, y: 0, width: width, height: height };
        _this._targetCoords = { x: 0, y: 0, width: width, height: height };
        _this._types = [];
        _this._activeTypes = [];
        // No need to remove styles on destroy
        (0, styles_1.createCursorStyles)(_this.prefix);
        // Setup
        _this._createElements();
        _this._setEvents();
        // enable by default
        _this._toggle(isEnabled);
        return _this;
    }
    /** Get default static properties */
    Cursor.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { container: window, hideNative: false });
    };
    /** Get default mutable properties */
    Cursor.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { enabled: true, width: 50, height: 50, lerp: 0.2, autoStop: true });
    };
    Object.defineProperty(Cursor.prototype, "prefix", {
        /**
         * Classname prefix for styling elements.
         */
        get: function () {
            return "".concat((0, initVevet_1.initVevet)().prefix, "cursor");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "container", {
        /** The cursor container */
        get: function () {
            return this.props.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "domContainer", {
        /** Returns the DOM parent for the cursor element. */
        get: function () {
            if (this.container instanceof Window) {
                return (0, initVevet_1.initVevet)().body;
            }
            return this.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "outer", {
        /**
         * The outer element of the custom cursor.
         * This is the visual element that represents the cursor on screen.
         */
        get: function () {
            return this._outer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "inner", {
        /**
         * The inner element of the custom cursor.
         * This element is nested inside the outer element and can provide additional styling.
         */
        get: function () {
            return this._inner;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "hoveredElement", {
        /**
         * The currently hovered element.
         * Stores information about the element that the cursor is currently interacting with.
         */
        get: function () {
            return this._hoveredElement;
        },
        set: function (value) {
            this._hoveredElement = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "coords", {
        /**
         * The current coordinates (x, y, width, height).
         * These are updated during cursor movement.
         */
        get: function () {
            return this._coords;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "targetCoords", {
        /** Target coordinates of the cursor (without smooth interpolation). */
        get: function () {
            var _a;
            var _b = this, hoveredElement = _b.hoveredElement, props = _b.props;
            var _c = this._targetCoords, x = _c.x, y = _c.y;
            var width = props.width, height = props.height;
            var padding = 0;
            if (hoveredElement) {
                var bounding = hoveredElement.element.getBoundingClientRect();
                if (hoveredElement.sticky) {
                    x = bounding.left + bounding.width / 2;
                    y = bounding.top + bounding.height / 2;
                }
                if (hoveredElement.width === 'auto') {
                    width = bounding.width;
                }
                else if (typeof hoveredElement.width === 'number') {
                    width = hoveredElement.width;
                }
                if (hoveredElement.height === 'auto') {
                    height = bounding.height;
                }
                else if (typeof hoveredElement.height === 'number') {
                    height = hoveredElement.height;
                }
                padding = (_a = hoveredElement.padding) !== null && _a !== void 0 ? _a : 0;
            }
            width += padding * 2;
            height += padding * 2;
            return { x: x, y: y, width: width, height: height };
        },
        enumerable: false,
        configurable: true
    });
    /** Creates the custom cursor and appends it to the DOM. */
    Cursor.prototype._createElements = function () {
        var _a = this, container = _a.container, domContainer = _a.domContainer;
        var cn = this._cn.bind(this);
        // Hide native cursor
        if (this.props.hideNative) {
            domContainer.style.cursor = 'none';
            this._addTempClassName(domContainer, cn('-hide-default'));
        }
        // Set class names
        this._addTempClassName(domContainer, cn('-container'));
        // Set container position
        if (domContainer !== (0, initVevet_1.initVevet)().body) {
            domContainer.style.position = 'relative';
        }
        // Create outer element
        var outer = document.createElement('div');
        domContainer.append(outer);
        outer.classList.add(cn(''));
        outer.classList.add(cn(container instanceof Window ? '-in-window' : '-in-element'));
        outer.classList.add(cn('-disabled'));
        // Create inner element
        var inner = document.createElement('div');
        outer.append(inner);
        inner.classList.add(cn('__inner'));
        inner.classList.add(cn('-disabled'));
        outer.append(inner);
        // assign
        this._outer = outer;
        this._inner = inner;
        // Destroy the cursor
        this.onDestroy(function () {
            domContainer.style.cursor = '';
            inner.remove();
            outer.remove();
        });
    };
    /** Sets up the various event listeners for the cursor, such as mouse movements and clicks. */
    Cursor.prototype._setEvents = function () {
        var _this = this;
        var domContainer = this.domContainer;
        this._raf = new Raf_1.Raf({ enabled: false });
        this._raf.on('frame', function () { return _this.render(); });
        var mouseenter = (0, listeners_1.addEventListener)(domContainer, 'mouseenter', this._handleMouseEnter.bind(this));
        var mouseleave = (0, listeners_1.addEventListener)(domContainer, 'mouseleave', this._handleMouseLeave.bind(this));
        var mousemove = (0, listeners_1.addEventListener)(domContainer, 'mousemove', this._handleMouseMove.bind(this));
        var mousedown = (0, listeners_1.addEventListener)(domContainer, 'mousedown', this._handleMouseDown.bind(this));
        var mouseup = (0, listeners_1.addEventListener)(domContainer, 'mouseup', this._handleMouseUp.bind(this));
        var blur = (0, listeners_1.addEventListener)(window, 'blur', this._handleWindowBlur.bind(this));
        this.onDestroy(function () {
            _this._raf.destroy();
            mouseenter();
            mouseleave();
            mousemove();
            mousedown();
            mouseup();
            blur();
        });
    };
    /** Handles property mutations */
    Cursor.prototype._handleProps = function () {
        _super.prototype._handleProps.call(this);
        this._toggle(this.props.enabled);
    };
    /** Enables cursor animation. */
    Cursor.prototype._toggle = function (enabled) {
        var className = this._cn('-disabled');
        this.outer.classList.toggle(className, !enabled);
        this.inner.classList.toggle(className, !enabled);
        this._raf.updateProps({ enabled: enabled });
    };
    /** Handles mouse enter events. */
    Cursor.prototype._handleMouseEnter = function (evt) {
        this._coords.x = evt.clientX;
        this._coords.y = evt.clientY;
        this._targetCoords.x = evt.clientX;
        this._targetCoords.y = evt.clientY;
        this.outer.classList.add(this._cn('-visible'));
    };
    /** Handles mouse leave events. */
    Cursor.prototype._handleMouseLeave = function () {
        this.outer.classList.remove(this._cn('-visible'));
    };
    /** Handles mouse move events. */
    Cursor.prototype._handleMouseMove = function (evt) {
        this._targetCoords.x = evt.clientX;
        this._targetCoords.y = evt.clientY;
        if (this._isFirstMove) {
            this._coords.x = evt.clientX;
            this._coords.y = evt.clientY;
            this._isFirstMove = false;
        }
        this.outer.classList.add(this._cn('-visible'));
        if (this.props.enabled) {
            this._raf.play();
        }
    };
    /** Handles mouse down events. */
    Cursor.prototype._handleMouseDown = function (evt) {
        var className = this._cn('-click');
        if (evt.which === 1) {
            this.outer.classList.add(className);
            this.inner.classList.add(className);
        }
    };
    /** Handles mouse up events. */
    Cursor.prototype._handleMouseUp = function () {
        var className = this._cn('-click');
        this.outer.classList.remove(className);
        this.inner.classList.remove(className);
    };
    /** Handles window blur events. */
    Cursor.prototype._handleWindowBlur = function () {
        this._handleMouseUp();
    };
    /**
     * Registers an element to interact with the cursor, enabling dynamic size and position changes based on hover effects.
     * @param settings The settings for the hovered element.
     * @param {number} [enterTimeout=100] The timeout before the hover effect is applied.
     * @returns Returns a destructor
     */
    Cursor.prototype.attachElement = function (settings, enterTimeout) {
        var _this = this;
        if (enterTimeout === void 0) { enterTimeout = 100; }
        var data = __assign({ width: null, height: null }, settings);
        var element = data.element;
        var timeout;
        if (element.matches(':hover')) {
            this._handleElementEnter(data);
        }
        var mouseEnter = (0, listeners_1.addEventListener)(element, 'mouseenter', function () {
            timeout = setTimeout(function () { return _this._handleElementEnter(data); }, enterTimeout);
        });
        var mouseLeave = (0, listeners_1.addEventListener)(element, 'mouseleave', function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            _this._handleElementLeave(data);
        });
        var remove = function () {
            var _a;
            if (((_a = _this.hoveredElement) === null || _a === void 0 ? void 0 : _a.element) === element) {
                _this.hoveredElement = undefined;
            }
            mouseEnter();
            mouseLeave();
            if (timeout) {
                clearTimeout(timeout);
            }
        };
        this.onDestroy(function () { return remove(); });
        return function () { return remove(); };
    };
    /** Handle element enter */
    Cursor.prototype._handleElementEnter = function (data) {
        this.hoveredElement = __assign({}, data);
        if (data.type) {
            this._toggleType(data.type, true);
        }
        if (this.props.enabled) {
            this._raf.play();
        }
    };
    /** Handle element leave */
    Cursor.prototype._handleElementLeave = function (data) {
        this.hoveredElement = undefined;
        if (data.type) {
            this._toggleType(data.type, false);
        }
        if (this.props.enabled) {
            this._raf.play();
        }
    };
    /**
     * Registers a cursor type.
     */
    Cursor.prototype.attachCursor = function (_a) {
        var element = _a.element, type = _a.type;
        this._types.push({ element: element, type: type });
        this._inner.append(element);
    };
    /** Enable or disable a cursor type */
    Cursor.prototype._toggleType = function (type, isEnabled) {
        if (isEnabled) {
            this._activeTypes.push(type);
        }
        else {
            this._activeTypes = this._activeTypes.filter(function (item) { return type !== item; });
        }
        var activeType = this._activeTypes.length > 0
            ? this._activeTypes[this._activeTypes.length - 1]
            : null;
        this._types.forEach(function (item) {
            item.element.classList.toggle('active', item.type === activeType);
        });
    };
    Object.defineProperty(Cursor.prototype, "isInterpolated", {
        /**
         * Checks if all coordinates are interpolated.
         * @returns {boolean} True if all coordinates are interpolated, false otherwise.
         */
        get: function () {
            var _a = this, coords = _a.coords, targetCoords = _a.targetCoords;
            return (coords.x === targetCoords.x &&
                coords.y === targetCoords.y &&
                coords.width === targetCoords.width &&
                coords.height === targetCoords.height);
        },
        enumerable: false,
        configurable: true
    });
    /** Renders the cursor. */
    Cursor.prototype.render = function () {
        this._calculate();
        this._renderElements();
        if (this.props.autoStop && this.isInterpolated) {
            this._raf.pause();
        }
        // Launch render events
        this.callbacks.emit('render', undefined);
    };
    /** Recalculates current coordinates. */
    Cursor.prototype._calculate = function () {
        var _a = this, targetCoords = _a.targetCoords, coords = _a._coords;
        coords.x = this._lerp(coords.x, targetCoords.x);
        coords.y = this._lerp(coords.y, targetCoords.y);
        coords.width = this._lerp(coords.width, targetCoords.width);
        coords.height = this._lerp(coords.height, targetCoords.height);
    };
    /**
     * Performs linear interpolation.
     * @param {number} current The current value.
     * @param {number} target The target value.
     * @returns {number} The interpolated value.
     */
    Cursor.prototype._lerp = function (current, target) {
        var value = (0, math_1.lerp)(current, target, this._raf.lerpFactor(this.props.lerp), 0.0001);
        return value;
    };
    /** Renders the cursor elements. */
    Cursor.prototype._renderElements = function () {
        var _a = this, container = _a.container, domContainer = _a.domContainer, outer = _a.outer;
        var _b = this.coords, x = _b.x, y = _b.y;
        var _c = this.coords, width = _c.width, height = _c.height;
        if (!(container instanceof Window)) {
            var bounding = domContainer.getBoundingClientRect();
            x -= bounding.left;
            y -= bounding.top;
        }
        // Update DOM coordinates
        outer.style.transform = "translate(".concat(x, "px, ").concat(y, "px)");
        outer.style.setProperty('--cursor-w', "".concat(width, "px"));
        outer.style.setProperty('--cursor-h', "".concat(height, "px"));
    };
    return Cursor;
}(Module_1.Module));
exports.Cursor = Cursor;
//# sourceMappingURL=index.js.map