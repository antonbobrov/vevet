"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapTrack = void 0;
var math_1 = require("../../../utils/math");
var utils_1 = require("../../../utils");
var SnapTrack = /** @class */ (function () {
    function SnapTrack(snap) {
        this.snap = snap;
        /** The current track value */
        this._current = 0;
        /** The target track value */
        this._target = 0;
    }
    Object.defineProperty(SnapTrack.prototype, "current", {
        /** Gets the current track value. */
        get: function () {
            return this._current;
        },
        /** Sets the current track value */
        set: function (value) {
            this._current = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "target", {
        /** Gets the target track value. */
        get: function () {
            return this._target;
        },
        /** Sets the target track value */
        set: function (value) {
            this._target = value;
        },
        enumerable: false,
        configurable: true
    });
    /** Set a value to current & target value instantly */
    SnapTrack.prototype.set = function (value) {
        this.current = value;
        this.target = value;
    };
    Object.defineProperty(SnapTrack.prototype, "canLoop", {
        /** If can loop */
        get: function () {
            return this.snap.props.loop && this.snap.slides.length > 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "loopedCurrent", {
        /** Get looped current value */
        get: function () {
            return this.loopCoord(this.current);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "offset", {
        /** Get track offset */
        get: function () {
            var snap = this.snap;
            return snap.props.centered ? snap.domSize / 2 - snap.firstSlideSize / 2 : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "loopCount", {
        /** Get loop count */
        get: function () {
            return Math.floor(this.current / this.max);
        },
        enumerable: false,
        configurable: true
    });
    /** Loop a coordinate if can loop */
    SnapTrack.prototype.loopCoord = function (coord) {
        return this.canLoop ? (0, math_1.loop)(coord, this.min, this.max) : coord;
    };
    /** Interpolate the current track value */
    SnapTrack.prototype.lerp = function (factor) {
        var target = this.target;
        var _a = this, snap = _a.snap, min = _a.min, max = _a.max;
        // Edge space & resistance
        if (!snap.props.loop) {
            var domSize = snap.domSize, props = snap.props;
            var edgeSpace = (1 - props.edgeFriction) * domSize;
            if (target < min) {
                var edgeProgress = 1 - (0, math_1.scoped)(target, -domSize, min);
                target = min - edgeProgress * edgeSpace;
            }
            else if (target > max) {
                var edgeProgress = (0, math_1.scoped)(target, max, max + domSize);
                target = max + edgeProgress * edgeSpace;
            }
            target = (0, math_1.clamp)(target, min - edgeSpace, max + edgeSpace);
        }
        // Interpolate current value
        var rest = Math.abs(this.current - target);
        var fastThreshold = 5;
        if (rest < fastThreshold) {
            var fastProgress = 1 - rest / fastThreshold;
            var additionalFactor = (1 - factor) / 3;
            factor += additionalFactor * fastProgress;
        }
        this.current = (0, math_1.lerp)(this.current, target, factor, 0.000001);
    };
    Object.defineProperty(SnapTrack.prototype, "isInterpolated", {
        /** Whether the track is interpolated */
        get: function () {
            return this.current === this.target;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "min", {
        /** Get minimum track value */
        get: function () {
            var snap = this.snap;
            if (this.canLoop || snap.isEmpty) {
                return 0;
            }
            if (snap.props.centered) {
                var firstSlide = snap.slides[0];
                if (firstSlide.size > snap.domSize) {
                    return snap.domSize / 2 - firstSlide.size / 2;
                }
            }
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "max", {
        /** Get maximum track value */
        get: function () {
            var _a = this.snap, domSize = _a.domSize, slides = _a.slides, isEmpty = _a.isEmpty, props = _a.props;
            var canLoop = this.canLoop;
            if (isEmpty) {
                return 0;
            }
            var firstSlide = slides[0];
            var lastSlide = slides[slides.length - 1];
            var lastCoordWithSlide = lastSlide.staticCoord + lastSlide.size;
            var max = canLoop
                ? lastCoordWithSlide + (0, utils_1.toPixels)(props.gap)
                : lastCoordWithSlide - domSize;
            if (canLoop) {
                return max;
            }
            if (props.centered) {
                max += domSize / 2 - firstSlide.size / 2;
                if (lastSlide.size < domSize) {
                    max += domSize / 2 - lastSlide.size / 2;
                }
            }
            if (!props.centered) {
                max = Math.max(max, 0);
            }
            return max;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "progress", {
        /** Get track progress. From 0 to 1 if not loop. From -Infinity to Infinity if loop */
        get: function () {
            return this.current / this.max;
        },
        enumerable: false,
        configurable: true
    });
    /** Iterate track target value */
    SnapTrack.prototype.iterateTarget = function (delta) {
        var snap = this.snap;
        this.target += delta;
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        snap._raf.play();
    };
    /** Clamp target value between min and max values */
    SnapTrack.prototype.clampTarget = function () {
        var snap = this.snap;
        if (!this.canLoop) {
            this.target = (0, math_1.clamp)(this.target, this.min, this.max);
        }
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        snap._raf.play();
    };
    Object.defineProperty(SnapTrack.prototype, "isStart", {
        /** If the start has been reached */
        get: function () {
            if (this.snap.props.loop) {
                return false;
            }
            return Math.floor(this.target) <= Math.floor(this.min);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "isEnd", {
        /** If the end has been reached */
        get: function () {
            if (this.snap.props.loop) {
                return false;
            }
            return Math.floor(this.target) >= Math.floor(this.max);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapTrack.prototype, "isSlideScrolling", {
        /** Check if the active slide is larger than the container and is being scrolled */
        get: function () {
            var snap = this.snap;
            var domSize = snap.domSize;
            return snap.scrollableSlides.some(function (_a) {
                var size = _a.size, coord = _a.coord;
                return (0, math_1.inRange)(coord, domSize - size, 0);
            });
        },
        enumerable: false,
        configurable: true
    });
    return SnapTrack;
}());
exports.SnapTrack = SnapTrack;
//# sourceMappingURL=index.js.map