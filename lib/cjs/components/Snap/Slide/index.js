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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapSlide = void 0;
var utils_1 = require("../../../utils");
var SnapSlide = /** @class */ (function () {
    function SnapSlide(_element, initProps) {
        if (initProps === void 0) { initProps = {}; }
        this._element = _element;
        /** Current coordinate */
        this._coord = 0;
        /** If the slide is appended */
        this._isAppended = false;
        /** If the slide is visible */
        this._isVisible = false;
        /** Static coordinate (as if the slide was never moved) */
        this._staticCoord = 0;
        /** Current progress of slide movement: from -1 to 1 */
        this._progress = 0;
        this._id = (0, utils_1.uid)('snap-slide');
        this._index = 0;
        var defaultProps = {
            virtual: false,
        };
        this._props = __assign(__assign({}, defaultProps), initProps);
        if (this.props.virtual && (!initProps.size || initProps.size === 'auto')) {
            throw new Error('Virtual slide must have a size');
        }
    }
    Object.defineProperty(SnapSlide.prototype, "element", {
        /** Slide element */
        get: function () {
            return this._element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSlide.prototype, "props", {
        /** Slide properties */
        get: function () {
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSlide.prototype, "id", {
        /** Slide id */
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSlide.prototype, "index", {
        /** Slide index */
        get: function () {
            return this._index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSlide.prototype, "snap", {
        /** Snap component */
        get: function () {
            return this._snap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSlide.prototype, "coord", {
        /** Current coordinate */
        get: function () {
            return this._coord;
        },
        enumerable: false,
        configurable: true
    });
    /** Current coordinate. Do not update it manually! */
    SnapSlide.prototype.setCoord = function (value) {
        var _a, _b;
        this._coord = value;
        this._isVisible =
            this.size > 0 &&
                this.coord > -this.size &&
                this.coord < ((_b = (_a = this.snap) === null || _a === void 0 ? void 0 : _a.domSize) !== null && _b !== void 0 ? _b : 0);
    };
    Object.defineProperty(SnapSlide.prototype, "staticCoord", {
        /** Static coordinate (as if the slide was never moved) */
        get: function () {
            return this._staticCoord;
        },
        enumerable: false,
        configurable: true
    });
    /** Static coordinate (as if the slide was never moved). Do not update it manually! Alignment: start */
    SnapSlide.prototype.setStaticCoord = function (value) {
        this._staticCoord = value;
    };
    Object.defineProperty(SnapSlide.prototype, "progress", {
        /** Current progress of slide movement: from -1 to 1 */
        get: function () {
            return this._progress;
        },
        enumerable: false,
        configurable: true
    });
    /** Current progress of slide movement: from -1 to 1. Do not update it manually! */
    SnapSlide.prototype.setProgress = function (value) {
        this._progress = value;
    };
    Object.defineProperty(SnapSlide.prototype, "sizeProp", {
        /** Size property */
        get: function () {
            var _a, _b, _c;
            return (_c = (_a = this.props.size) !== null && _a !== void 0 ? _a : (_b = this.snap) === null || _b === void 0 ? void 0 : _b.props.slideSize) !== null && _c !== void 0 ? _c : 'auto';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSlide.prototype, "size", {
        /** Slide size in pixels */
        get: function () {
            var _a;
            var _b = this, snap = _b.snap, sizeProp = _b.sizeProp;
            if (!snap) {
                return 0;
            }
            if (sizeProp === 'stretch') {
                return snap.domSize;
            }
            if (sizeProp === 'auto') {
                return (_a = this._domSize) !== null && _a !== void 0 ? _a : snap.domSize;
            }
            return (0, utils_1.toPixels)(sizeProp);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSlide.prototype, "isVisible", {
        /** Check if the slide is visible */
        get: function () {
            return this._isVisible;
        },
        enumerable: false,
        configurable: true
    });
    /** Resize the slide & trigger snap reflow */
    SnapSlide.prototype.resize = function (isManual) {
        if (isManual === void 0) { isManual = false; }
        var _a = this, element = _a.element, snap = _a.snap;
        if (!snap) {
            return;
        }
        // Update DOM size
        if (element) {
            var direction = snap.props.direction;
            this._domSize =
                direction === 'horizontal' ? element.offsetWidth : element.offsetHeight;
        }
        // Re-flow
        snap.resize(isManual);
    };
    /** Attach the slide to the Snap class */
    SnapSlide.prototype.attach = function (snap, index) {
        var _this = this;
        this.detach();
        this._snap = snap;
        this._index = index;
        if (this.element && this.sizeProp === 'auto') {
            this._onResize = (0, utils_1.onResize)({
                element: this.element,
                viewportTarget: 'width',
                callback: function () { return _this.resize(); },
                name: 'Snap Slide',
            });
        }
        this.resize();
    };
    /** Detach the slide from the Snap class */
    SnapSlide.prototype.detach = function () {
        var _a;
        this._snap = undefined;
        (_a = this._onResize) === null || _a === void 0 ? void 0 : _a.remove();
    };
    /** Render the slide */
    SnapSlide.prototype.render = function () {
        this._toggleAppend();
    };
    /** Toggle slide append/remove */
    SnapSlide.prototype._toggleAppend = function () {
        if (!this.props.virtual || !this.element || !this.snap) {
            return;
        }
        var element = this.element;
        var container = this.snap.container;
        if (this.isVisible && !this._isAppended) {
            this._isAppended = true;
            container.appendChild(element);
        }
        else if (!this.isVisible && this._isAppended) {
            this._isAppended = false;
            container.removeChild(element);
        }
    };
    Object.defineProperty(SnapSlide.prototype, "magnets", {
        /** Get magnets with static coordinates but dynamic alignment */
        get: function () {
            if (!this.snap) {
                return [];
            }
            var _a = this, snap = _a.snap, staticCoord = _a.staticCoord, size = _a.size, index = _a.index;
            var domSize = snap.domSize, track = snap.track, firstSlideSize = snap.firstSlideSize;
            var points = [];
            if (index === 0 && snap.props.loop) {
                points.push(track.max);
            }
            if (snap.props.centered) {
                var point = staticCoord + size / 2 - firstSlideSize / 2;
                if (size > domSize) {
                    points.push(point);
                    points.push(point + (domSize - size) / 2);
                    points.push(point - (domSize - size) / 2);
                }
                else {
                    points.push(point);
                }
            }
            else {
                points.push(staticCoord);
                if (size > domSize) {
                    points.push(staticCoord + (size - domSize));
                }
            }
            if (!track.canLoop && !snap.props.centered) {
                points = points.map(function (point) { return (0, utils_1.clamp)(point, 0, track.max); });
            }
            return points;
        },
        enumerable: false,
        configurable: true
    });
    return SnapSlide;
}());
exports.SnapSlide = SnapSlide;
//# sourceMappingURL=index.js.map