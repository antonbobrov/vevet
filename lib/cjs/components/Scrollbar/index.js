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
exports.Scrollbar = void 0;
var base_1 = require("../../base");
var initVevet_1 = require("../../global/initVevet");
var utils_1 = require("../../utils");
var styles_1 = require("./styles");
var Swipe_1 = require("../Swipe");
__exportStar(require("./types"), exports);
/**
 * A custom scrollbar component. Supports both `window` and `HTMLElement` containers.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Scrollbar)
 *
 * @group Components
 */
var Scrollbar = /** @class */ (function (_super) {
    __extends(Scrollbar, _super);
    function Scrollbar(props) {
        var _this = _super.call(this, props) || this;
        /** Save scroll value on swipe start */
        _this._valueOnSwipeStart = 0;
        /** Previous scroll value */
        _this._prevScrollValue = 0;
        // No need to remove styles on destroy
        (0, styles_1.createScrollbarStyles)(_this.prefix);
        // Create elements
        _this._create();
        // Set events
        _this._setResize();
        _this._setOnscroll();
        _this._setSwipe();
        // Initialize
        _this.outer.classList.add(_this._cn('_inited'));
        return _this;
    }
    /** Get default static properties. */
    Scrollbar.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { container: window, parent: false, class: false, axis: 'y', draggable: true, autoHide: true, resizeDebounce: 10 });
    };
    /** Get default mutable properties. */
    Scrollbar.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { minSize: 50, autoSize: true });
    };
    Object.defineProperty(Scrollbar.prototype, "prefix", {
        get: function () {
            return "".concat((0, initVevet_1.initVevet)().prefix, "scrollbar");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "container", {
        /**
         * The element to which the scrollbar is applied.
         */
        get: function () {
            return this._props.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "outer", {
        /**
         * Scrollbar outer element
         */
        get: function () {
            return this._outer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "track", {
        /**
         * Scrollbar track element (the container of the thumb).
         */
        get: function () {
            return this._track;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "thumb", {
        /**
         * Scrollbar thumb element (draggable handle).
         */
        get: function () {
            return this._thumb;
        },
        enumerable: false,
        configurable: true
    });
    /** Handles property mutations */
    Scrollbar.prototype._handleProps = function () {
        _super.prototype._handleProps.call(this);
        this.resize();
    };
    Object.defineProperty(Scrollbar.prototype, "axis", {
        /** Scroll axis */
        get: function () {
            return this.props.axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "parent", {
        /**
         * The element where the scrollbar is appended.
         * If `parent` is not set, it defaults to `container` or `document.body` (if applied to `window`).
         */
        get: function () {
            var _a = this.props, parent = _a.parent, container = _a.container;
            return (parent || (container instanceof Window ? (0, initVevet_1.initVevet)().body : container));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "scrollElement", {
        /**
         * The actual scrollable element.
         * Returns `document.documentElement` for `window`, otherwise the `container` itself.
         */
        get: function () {
            return this.container instanceof Window ? (0, initVevet_1.initVevet)().html : this.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "scrollSize", {
        /**
         * Returns the total scroll width/height of the content.
         */
        get: function () {
            var scrollElement = this.scrollElement;
            return this.axis === 'x'
                ? scrollElement.scrollWidth
                : scrollElement.scrollHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "scrollableSize", {
        /**
         * Returns the total scrollable distance.
         */
        get: function () {
            var scrollElement = this.scrollElement;
            return this.axis === 'x'
                ? this.scrollSize - scrollElement.clientWidth
                : this.scrollSize - scrollElement.clientHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "scrollValue", {
        /**
         * Returns scrollTop or scrollLeft of the scrollable element.
         */
        get: function () {
            var axis = this.axis;
            if (this.container instanceof Window) {
                return axis === 'x' ? window.scrollX : window.scrollY;
            }
            return axis === 'x' ? this.container.scrollLeft : this.container.scrollTop;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "trackSize", {
        /** Returns the current track size. */
        get: function () {
            return this.axis === 'x'
                ? this._track.offsetWidth
                : this._track.offsetHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "thumbSize", {
        /** Returns the current thumb size. */
        get: function () {
            return this.axis === 'x'
                ? this._thumb.offsetWidth
                : this._thumb.offsetHeight;
        },
        enumerable: false,
        configurable: true
    });
    /** Create elements */
    Scrollbar.prototype._create = function () {
        var _this = this;
        var app = (0, initVevet_1.initVevet)();
        var _a = this, parent = _a.parent, scrollElement = _a.scrollElement;
        var isInWindow = this.container instanceof Window;
        this._outer = this._createOuter();
        parent.appendChild(this._outer);
        this._track = this._createTrack();
        this._outer.appendChild(this._track);
        this._thumb = this._createThumb();
        this._track.appendChild(this._thumb);
        // Apply global styles
        if (isInWindow) {
            this._addTempClassName(app.html, this._cn('-scrollable'));
            this._addTempClassName(app.body, this._cn('-scrollable'));
        }
        else {
            this._addTempClassName(scrollElement, this._cn('-scrollable'));
        }
        this.onDestroy(function () { return _this._outer.remove(); });
    };
    /** Create outer element */
    Scrollbar.prototype._createOuter = function () {
        var cn = this._cn.bind(this);
        var _a = this, props = _a.props, axis = _a.axis;
        var element = document.createElement('div');
        element.classList.add(cn(''));
        element.classList.add(cn("_".concat(axis)));
        if (props.class) {
            element.classList.add(props.class);
        }
        if (this.container instanceof Window) {
            this._addTempClassName(element, this._cn('_in-window'));
        }
        if (props.autoHide) {
            this._addTempClassName(element, this._cn('_auto-hide'));
        }
        return element;
    };
    /** Create track element */
    Scrollbar.prototype._createTrack = function () {
        var cn = this._cn.bind(this);
        var axis = this.axis;
        var element = document.createElement('div');
        element.classList.add(cn('__track'));
        element.classList.add(cn("__track_".concat(axis)));
        return element;
    };
    /** Create thumb element */
    Scrollbar.prototype._createThumb = function () {
        var cn = this._cn.bind(this);
        var element = document.createElement('div');
        element.classList.add(cn('__thumb'));
        element.classList.add(cn("__thumb_".concat(this.axis)));
        return element;
    };
    /** Set resize events */
    Scrollbar.prototype._setResize = function () {
        var _this = this;
        var createResizeHandler = function () {
            var children = Array.from(_this.scrollElement.children);
            return (0, utils_1.onResize)({
                element: __spreadArray([_this.track, _this.parent, _this.scrollElement], children, true),
                viewportTarget: 'width',
                resizeDebounce: _this.props.resizeDebounce,
                callback: function () { return _this.resize(); },
            });
        };
        var resizeHandler = createResizeHandler();
        resizeHandler.resize();
        var childrenObserver = new MutationObserver(function () {
            resizeHandler.remove();
            resizeHandler = createResizeHandler();
            resizeHandler.debounceResize();
        });
        childrenObserver.observe(this.scrollElement, { childList: true });
        this.onDestroy(function () {
            resizeHandler.remove();
            childrenObserver.disconnect();
        });
    };
    /** Set scroll events */
    Scrollbar.prototype._setOnscroll = function () {
        var _this = this;
        var handler = (0, utils_1.addEventListener)(this.container, 'scroll', function () { return _this._onScroll(); }, {
            passive: true,
        });
        this.onDestroy(function () { return handler(); });
    };
    /** Set swipe events */
    Scrollbar.prototype._setSwipe = function () {
        var _this = this;
        if (!this.props.draggable) {
            return;
        }
        var swipe = new Swipe_1.Swipe({ container: this.thumb, grabCursor: true });
        swipe.on('start', function (coords) {
            _this._valueOnSwipeStart = _this.scrollValue;
            _this.callbacks.emit('swipeStart', coords);
        });
        swipe.on('move', function (coords) {
            _this._onSwipeMove(coords);
            _this.callbacks.emit('swipe', coords);
        });
        swipe.on('end', function (coords) {
            _this.callbacks.emit('swipeEnd', coords);
        });
        swipe.on('touchmove', function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
        swipe.on('mousemove', function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
        this.onDestroy(function () { return swipe.destroy(); });
    };
    /** Resize the scrollbar. */
    Scrollbar.prototype.resize = function () {
        var _a = this, scrollableSize = _a.scrollableSize, scrollSize = _a.scrollSize, outer = _a.outer, track = _a.track, thumb = _a.thumb, props = _a.props, axis = _a.axis;
        var shouldAutoSize = props.autoSize;
        var isHorizontal = axis === 'x';
        // Define if the scrollbar is empty
        outer.classList.toggle(this._cn('_empty'), scrollableSize === 0);
        // Save sizes
        var trackSize = isHorizontal ? track.offsetWidth : track.offsetHeight;
        // Calculate minimum thumb size
        var minThumbSize = (0, utils_1.toPixels)(props.minSize);
        var newThumbSize = minThumbSize;
        // Calculate thumb sizes if auto-size is enabled
        if (shouldAutoSize) {
            newThumbSize = (0, utils_1.clamp)(trackSize / (scrollSize / trackSize), minThumbSize, Infinity);
        }
        // Apply sizes
        if (isHorizontal) {
            thumb.style.width = "".concat(newThumbSize, "px");
        }
        else {
            thumb.style.height = "".concat(newThumbSize, "px");
        }
        // Reset timeouts
        if (this._addInActionTimeout) {
            clearTimeout(this._addInActionTimeout);
        }
        // Render the scrollbar
        this._render();
        // Emit callbacks
        this.callbacks.emit('resize', undefined);
    };
    /** Render the scrollbar. */
    Scrollbar.prototype._render = function () {
        var _a = this, scrollValue = _a.scrollValue, scrollableSize = _a.scrollableSize, axis = _a.axis, thumbSize = _a.thumbSize, trackSize = _a.trackSize;
        var scrollProgress = (0, utils_1.clamp)(scrollValue / scrollableSize);
        var translate = (trackSize - thumbSize) * scrollProgress;
        var x = axis === 'x' ? translate : 0;
        var y = axis === 'y' ? translate : 0;
        this._thumb.style.transform = "translate(".concat(x, "px, ").concat(y, "px)");
        // Emit callbacks
        this.callbacks.emit('update', undefined);
    };
    /** Handle scroll update */
    Scrollbar.prototype._onScroll = function () {
        var _this = this;
        var _a = this, scrollValue = _a.scrollValue, outer = _a.outer;
        var inActionClass = this._cn('_in-action');
        if (scrollValue !== this._prevScrollValue) {
            this._addInActionTimeout = setTimeout(function () {
                if (!outer.classList.contains(inActionClass)) {
                    outer.classList.add(inActionClass);
                    _this.callbacks.emit('show', undefined);
                }
            }, 50);
        }
        else {
            this._prevScrollValue = scrollValue;
        }
        this._render();
        if (this._removeInActionTimeout) {
            clearTimeout(this._removeInActionTimeout);
        }
        this._removeInActionTimeout = setTimeout(function () {
            outer.classList.remove(inActionClass);
            _this.callbacks.emit('hide', undefined);
        }, 500);
    };
    /** Handle swipe move */
    Scrollbar.prototype._onSwipeMove = function (_a) {
        var diff = _a.diff;
        var _b = this, scrollElement = _b.scrollElement, axis = _b.axis, trackSize = _b.trackSize, thumbSize = _b.thumbSize, scrollableSize = _b.scrollableSize;
        var diffCoord = axis === 'x' ? diff.x : diff.y;
        var iterator = (diffCoord / (trackSize - thumbSize)) * scrollableSize;
        var target = this._valueOnSwipeStart + iterator;
        scrollElement.scrollTo({
            top: axis === 'y' ? target : undefined,
            left: axis === 'x' ? target : undefined,
            behavior: 'instant',
        });
    };
    /**
     * Destroys the component and cleans up resources.
     */
    Scrollbar.prototype._destroy = function () {
        _super.prototype._destroy.call(this);
        if (this._addInActionTimeout) {
            clearTimeout(this._addInActionTimeout);
        }
        if (this._removeInActionTimeout) {
            clearTimeout(this._removeInActionTimeout);
        }
    };
    return Scrollbar;
}(base_1.Module));
exports.Scrollbar = Scrollbar;
//# sourceMappingURL=index.js.map