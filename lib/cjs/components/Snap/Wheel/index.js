"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapWheel = void 0;
var utils_1 = require("../../../utils");
var initVevet_1 = require("../../../global/initVevet");
var deltasCount = 6;
var SnapWheel = /** @class */ (function () {
    function SnapWheel(_snap) {
        var _this = this;
        this._snap = _snap;
        /** Detects if wheel event is started */
        this._hasStarted = false;
        /** Deltas history */
        this._deltas = [];
        /** Last time wheel event was fired */
        this._lastWheelTime = 0;
        _snap.on('destroy', function () { return _this._destroy(); }, { protected: true });
        this._destructor = (0, utils_1.addEventListener)(_snap.eventsEmitter, 'wheel', function (event) {
            return _this._handleWheel(event);
        });
    }
    /** Destroy wheel listeners */
    SnapWheel.prototype._destroy = function () {
        this._destructor();
        if (this._debounceEnd) {
            clearTimeout(this._debounceEnd);
        }
    };
    Object.defineProperty(SnapWheel.prototype, "snap", {
        /** Snap component */
        get: function () {
            return this._snap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapWheel.prototype, "absDeltas", {
        /** Get absolute deltas */
        get: function () {
            return this._deltas.map(function (d) { return Math.abs(d); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapWheel.prototype, "lastWheelTime", {
        /** Get last wheel time */
        get: function () {
            return this._lastWheelTime;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Handles wheel events
     */
    SnapWheel.prototype._handleWheel = function (event) {
        var _this = this;
        var snap = this.snap;
        var props = snap.props;
        if (!props.wheel) {
            return;
        }
        event.preventDefault();
        // Get delta
        var wheelData = (0, utils_1.normalizeWheel)(event);
        var wheelAxis = props.wheelAxis === 'auto' ? snap.axis : props.wheelAxis;
        var delta = wheelAxis === 'x' ? wheelData.pixelX : wheelData.pixelY;
        // Start
        this._handleStart(delta);
        // Start
        this._handleMove(delta, event);
        // Debounce End
        if (this._debounceEnd) {
            clearTimeout(this._debounceEnd);
        }
        // End callback
        this._debounceEnd = setTimeout(function () { return _this._handleEnd(); }, 200);
    };
    /** Handle wheel start */
    SnapWheel.prototype._handleStart = function (delta) {
        if (this._hasStarted || Math.abs(delta) < 2) {
            return;
        }
        this._hasStarted = true;
        this.snap.callbacks.emit('wheelStart', undefined);
    };
    /** Handle wheel move */
    SnapWheel.prototype._handleMove = function (delta, event) {
        if (!this._hasStarted) {
            return;
        }
        var snap = this.snap;
        var props = snap.props;
        // Save delta
        this._addDelta(delta);
        // Move callback
        snap.callbacks.emit('wheel', event);
        // Handle wheel logic
        if (props.followWheel) {
            this._handleFollow(delta);
        }
        else {
            this._handleNoFollow(delta);
        }
    };
    /** Handle `followWheel=true` */
    SnapWheel.prototype._handleFollow = function (delta) {
        var snap = this.snap;
        // Cancel snap transition
        snap.cancelTransition();
        // Update track target
        snap.track.iterateTarget(delta * snap.props.wheelSpeed);
        snap.track.clampTarget();
    };
    /** Handle `followWheel=false` */
    SnapWheel.prototype._handleNoFollow = function (delta) {
        // vars
        var _a = this, snap = _a.snap, isTouchPad = _a.isTouchPad, isGainingDelta = _a.isGainingDelta;
        var track = snap.track, activeSlide = snap.activeSlide, domSize = snap.domSize;
        // Detect wheel throttling
        if (this._detectNoFollowThrottle()) {
            return;
        }
        // Detect if need to throttle or follow
        var shouldFollow = false;
        var isThrottled = true;
        if (!shouldFollow) {
            if (track.isSlideScrolling) {
                if (activeSlide.coord === 0) {
                    if (delta > 0) {
                        shouldFollow = true;
                    }
                }
                else if (activeSlide.coord === domSize - activeSlide.size) {
                    if (delta < 0) {
                        shouldFollow = true;
                    }
                }
                else {
                    shouldFollow = true;
                    isThrottled = false;
                }
            }
        }
        // Throttle
        if (isThrottled) {
            if (!isTouchPad ||
                (isTouchPad && (isGainingDelta || this.absDeltas.length === 1))) {
                var direction = Math.sign(delta);
                if (shouldFollow) {
                    snap.cancelTransition();
                    track.iterateTarget(direction);
                    track.clampTarget();
                    if (!isTouchPad) {
                        track.current = track.target;
                    }
                }
                else if (direction === 1) {
                    if (!snap.props.loop && snap.activeIndex === snap.slides.length - 1) {
                        return;
                    }
                    this._lastWheelTime = +new Date();
                    snap.next();
                }
                else {
                    if (!snap.props.loop && snap.activeIndex === 0) {
                        return;
                    }
                    this._lastWheelTime = +new Date();
                    snap.prev();
                }
            }
            return;
        }
        // Follow wheel
        if (shouldFollow) {
            snap.cancelTransition();
            var deltaWithSpeed = delta * snap.props.wheelSpeed;
            var start = Math.min.apply(Math, activeSlide.magnets);
            var end = Math.max.apply(Math, activeSlide.magnets);
            var loopedTarget = track.loopCoord(track.target);
            var clampedLoopedTarget = (0, utils_1.clamp)(loopedTarget + deltaWithSpeed, start, end);
            track.target += clampedLoopedTarget - loopedTarget;
            track.clampTarget();
        }
    };
    /** Detect if wheel should be throttled */
    SnapWheel.prototype._detectNoFollowThrottle = function () {
        var _a = this, isTouchPad = _a.isTouchPad, snap = _a.snap;
        var wheelThrottle = snap.props.wheelThrottle;
        var timeDiff = +new Date() - this._lastWheelTime;
        // NUMBER
        if (typeof wheelThrottle === 'number') {
            return timeDiff < wheelThrottle;
        }
        // AUTO
        if (isTouchPad) {
            return this.snap.isTransitioning;
        }
        var visibleScrollableSlides = snap.scrollableSlides.filter(function (slide) { return slide.isVisible; });
        if (visibleScrollableSlides.length && snap.isTransitioning) {
            return true;
        }
        if (timeDiff < 500) {
            return true;
        }
        return false;
    };
    /** Handle wheel end */
    SnapWheel.prototype._handleEnd = function () {
        if (!this._hasStarted) {
            return;
        }
        var snap = this.snap;
        var props = snap.props, activeSlide = snap.activeSlide, track = snap.track;
        var lastThreeDeltas = this._deltas.slice(-3).reduce(function (a, b) { return a + b; }, 0);
        // Reset states
        this._deltas = [];
        this._hasStarted = false;
        // Stick to the nearest magnet
        if (!props.freemode || props.freemode === 'sticky') {
            if (props.followWheel && props.stickOnWheelEnd) {
                // Classic stick when scrolling stops
                var slideThreshold = Math.abs(props.stickOnWheelEndThreshold) / activeSlide.size;
                if (activeSlide.progress > slideThreshold &&
                    !track.isSlideScrolling &&
                    lastThreeDeltas > 0) {
                    snap.next();
                }
                else if (activeSlide.progress < -slideThreshold &&
                    !track.isSlideScrolling &&
                    lastThreeDeltas < 0) {
                    snap.prev();
                }
                else {
                    snap.stick();
                }
            }
            else if (!props.followWheel && !snap.isTransitioning) {
                // Stick if something goes wrong when followWheel is disabled
                snap.stick();
            }
        }
        snap.callbacks.emit('wheelEnd', undefined);
    };
    /** Save delta */
    SnapWheel.prototype._addDelta = function (delta) {
        if (this._deltas.length >= deltasCount) {
            this._deltas.shift();
        }
        this._deltas.push(delta);
    };
    Object.defineProperty(SnapWheel.prototype, "isTouchPad", {
        /** Detect if touchpad */
        get: function () {
            return !this.isStableDelta || this.isSmallDelta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapWheel.prototype, "isStableDelta", {
        /** Detects if deltas are stable */
        get: function () {
            var deltas = this.absDeltas;
            var precision = 0.8;
            // get difference between deltas
            var diffs = deltas.map(function (d, i) {
                var prev = deltas[i - 1];
                if (!deltas[i - 1]) {
                    return 0;
                }
                return d - prev;
            });
            var zeroDiffs = diffs.filter(function (d) { return d === 0; });
            return zeroDiffs.length > diffs.length * precision;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapWheel.prototype, "isSmallDelta", {
        /** Detects if the latest delta is small */
        get: function () {
            var deltas = this.absDeltas;
            if (deltas.length === 0) {
                return true;
            }
            var last = deltas[deltas.length - 1];
            return last < 50;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapWheel.prototype, "isGainingDelta", {
        /** Detect if delta is gaining its value */
        get: function () {
            var vevet = (0, initVevet_1.initVevet)();
            var deltas = this.absDeltas;
            var precision = vevet.osName.includes('window') ? 1.5 : 1.2;
            if (deltas.length < deltasCount) {
                return false;
            }
            var lastDeltas = deltas.slice(-deltasCount);
            var half1 = lastDeltas.slice(0, Math.floor(lastDeltas.length / 2));
            var half2 = lastDeltas.slice(Math.floor(lastDeltas.length / 2));
            var avg1 = this._getAverage(half1);
            var avg2 = this._getAverage(half2);
            var isGaining = avg2 > avg1 * precision;
            return isGaining;
        },
        enumerable: false,
        configurable: true
    });
    /** Get average value in an array */
    SnapWheel.prototype._getAverage = function (array) {
        return array.length ? array.reduce(function (a, b) { return a + b; }, 0) / array.length : 0;
    };
    return SnapWheel;
}());
exports.SnapWheel = SnapWheel;
//# sourceMappingURL=index.js.map