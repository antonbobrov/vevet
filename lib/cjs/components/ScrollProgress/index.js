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
exports.ScrollProgress = void 0;
var base_1 = require("../../base");
var initVevet_1 = require("../../global/initVevet");
var utils_1 = require("../../utils");
__exportStar(require("./types"), exports);
/**
 * `ScrollProgress` is a component that tracks the scroll progress of a specified section element.
 *
 * This component can be used for creating scroll-based animations such as parallax effects.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/ScrollProgress)
 *
 * @group Components
 */
var ScrollProgress = /** @class */ (function (_super) {
    __extends(ScrollProgress, _super);
    function ScrollProgress(props) {
        var _this = _super.call(this, props) || this;
        /** Indicates whether the section is currently visible within the viewport or root element. */
        _this._isVisible = false;
        /** The bounds of the root element used for scroll calculations. */
        _this._rootBounds = {
            top: 0,
            left: 0,
            width: 1,
            height: 1,
        };
        /** The bounds of the section element relative to the root element. */
        _this._sectionBounds = {
            top: 0,
            left: 0,
            width: 1,
            height: 1,
        };
        _this._isVisible = !_this.props.optimized;
        _this._setup();
        return _this;
    }
    /** Retrieves the default static properties. */
    ScrollProgress.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { root: null, optimized: true, useSvh: false });
    };
    /** Retrieves the default mutable properties. */
    ScrollProgress.prototype._getMutable = function () {
        return __assign({}, _super.prototype._getMutable.call(this));
    };
    Object.defineProperty(ScrollProgress.prototype, "section", {
        /**
         * Returns the section element being tracked for scroll progress.
         */
        get: function () {
            return this.props.section;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollProgress.prototype, "isVisible", {
        /** Indicates whether the section is currently visible within the viewport or root element. */
        get: function () {
            return this._isVisible;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollProgress.prototype, "rootBounds", {
        /** The bounds of the root element used for scroll calculations. */
        get: function () {
            return this._rootBounds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollProgress.prototype, "sectionBounds", {
        /** The bounds of the section element relative to the root element. */
        get: function () {
            return this._sectionBounds;
        },
        enumerable: false,
        configurable: true
    });
    /** Sets up events */
    ScrollProgress.prototype._setup = function () {
        this._setupObserver();
        this._setupScroll();
    };
    /**
     * Sets up an `IntersectionObserver` to track the visibility of the section.
     */
    ScrollProgress.prototype._setupObserver = function () {
        var _this = this;
        if (!this.props.optimized) {
            return;
        }
        var section = this.props.section;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.target === section) {
                    _this._isVisible = entry.isIntersecting;
                    _this.update();
                }
            });
        });
        observer.observe(section);
        this.onDestroy(function () { return observer.disconnect(); });
    };
    /**
     * Sets up a scroll event listener to track and update progress.
     */
    ScrollProgress.prototype._setupScroll = function () {
        var _this = this;
        var container = this.props.root || window;
        var listener = (0, utils_1.addEventListener)(container, 'scroll', function () {
            if (_this._isVisible) {
                _this.update();
            }
        }, { passive: false });
        this.onDestroy(listener);
    };
    /** Updates the section and root bounds, and emits an update callback. */
    ScrollProgress.prototype.update = function () {
        var _a = this, section = _a.section, props = _a.props;
        var container = props.root;
        var core = (0, initVevet_1.initVevet)();
        var sectionBounding = section.getBoundingClientRect();
        var viewportBounds = {
            top: 0,
            left: 0,
            width: core.width,
            height: props.useSvh ? core.sHeight : core.height,
        };
        this._rootBounds = container
            ? container.getBoundingClientRect()
            : viewportBounds;
        this._sectionBounds = {
            top: sectionBounding.top - this._rootBounds.top,
            left: sectionBounding.left - this._rootBounds.left,
            width: sectionBounding.width,
            height: sectionBounding.height,
        };
        this.callbacks.emit('update', undefined);
    };
    /**
     * Calculates the section scroll progress relative to the root element.
     *
     * The function takes top or left corner of the section as the reference point.
     *
     * @param topThreshold - Top threshold of the section position.
     * @param rightThreshold - Right threshold of the section position.
     * @param bottomThreshold - Bottom threshold of the section position.
     * @param leftThreshold - Left threshold of the section position.
     * @returns The scroll progress along the x and y axes.
     *
     * @example
     *
     * const progress = getProgress(0, vevet.width, vevet.height / 2, 0)
     *
     * // `progress.y` is `0` when the top corner of the section is at the beginning of the viewport or root element
     * // `progress.y` is `1` when the top corner of the section is at the center of the viewport or root element
     */
    ScrollProgress.prototype.getProgress = function (topThreshold, rightThreshold, bottomThreshold, leftThreshold) {
        var y = (0, utils_1.clampScope)(this._sectionBounds.top, [
            topThreshold,
            bottomThreshold,
        ]);
        var x = (0, utils_1.clampScope)(this._sectionBounds.left, [
            leftThreshold,
            rightThreshold,
        ]);
        return {
            x: Number.isNaN(x) ? 0 : x,
            y: Number.isNaN(y) ? 0 : y,
        };
    };
    Object.defineProperty(ScrollProgress.prototype, "inProgress", {
        /** Calculates the progress of the section entering the root element. */
        get: function () {
            var _a = this, rootBounds = _a.rootBounds, sectionBounds = _a.sectionBounds;
            var top = this.rootBounds.height;
            var right = sectionBounds.width > rootBounds.width
                ? 0
                : rootBounds.width - sectionBounds.width;
            var bottom = sectionBounds.height > rootBounds.height
                ? 0
                : rootBounds.height - sectionBounds.height;
            var left = this.rootBounds.width;
            return this.getProgress(top, right, bottom, left);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollProgress.prototype, "outProgress", {
        /** Calculates the progress of the section leaving the root element. */
        get: function () {
            var _a = this, rootBounds = _a.rootBounds, sectionBounds = _a.sectionBounds;
            var top = Math.min(rootBounds.height - sectionBounds.height, 0);
            var right = -sectionBounds.width;
            var bottom = -sectionBounds.height;
            var left = Math.min(rootBounds.width - sectionBounds.width, 0);
            return this.getProgress(top, right, bottom, left);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollProgress.prototype, "moveProgress", {
        /** Calculates the progress of the section's movement within the root element. */
        get: function () {
            var _a = this, rootBounds = _a.rootBounds, sectionBounds = _a.sectionBounds;
            var top = sectionBounds.height > rootBounds.height
                ? 0
                : rootBounds.height - sectionBounds.height;
            var right = sectionBounds.width > rootBounds.width
                ? -(sectionBounds.width - rootBounds.width)
                : 0;
            var bottom = sectionBounds.height > rootBounds.height
                ? -(sectionBounds.height - rootBounds.height)
                : 0;
            var left = sectionBounds.width > rootBounds.width
                ? 0
                : rootBounds.width - sectionBounds.width;
            return this.getProgress(top, right, bottom, left);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollProgress.prototype, "progress", {
        /** Calculates the global scroll progress of the section relative to the root element. */
        get: function () {
            var _a = this, sectionBounds = _a.sectionBounds, rootBounds = _a.rootBounds;
            var top = rootBounds.height;
            var right = -sectionBounds.width;
            var bottom = -sectionBounds.height;
            var left = rootBounds.width;
            return this.getProgress(top, right, bottom, left);
        },
        enumerable: false,
        configurable: true
    });
    return ScrollProgress;
}(base_1.Module));
exports.ScrollProgress = ScrollProgress;
//# sourceMappingURL=index.js.map