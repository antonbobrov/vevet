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
exports.SnapSwipe = void 0;
var Swipe_1 = require("../../../components/Swipe");
var utils_1 = require("../../../utils");
var SnapSwipe = /** @class */ (function () {
    function SnapSwipe(snap) {
        var _this = this;
        this.snap = snap;
        snap.on('destroy', function () { return _this._destroy(); }, { protected: true });
        var props = snap.props, activeIndex = snap.activeIndex;
        this._startIndex = activeIndex;
        this._startTime = 0;
        this._swipe = new Swipe_1.Swipe({
            container: snap.eventsEmitter,
            enabled: props.swipe,
            grabCursor: props.grabCursor,
            minTime: props.swipeMinTime,
            threshold: props.swipeThreshold,
            axis: this.axis,
            inertia: false,
            inertiaDuration: props.swipeInertiaDuration,
            inertiaRatio: props.swipeInertiaRatio,
            velocityModifier: this._handleVelocityModifier.bind(this),
            inertiaDistanceThreshold: 5,
        });
        this._swipe.on('start', function (data) { return _this._handleSwipeStart(data); });
        this._swipe.on('move', function (data) { return _this._handleSwipeMove(data); });
        this._swipe.on('end', function (data) { return _this._handleSwipeEnd(data); });
        this._swipe.on('inertiaStart', function () { return _this._handleSwipeInertiaStart(); });
        this._swipe.on('inertiaEnd', function () { return _this._handleSwipeInertiaEnd(); });
        this._swipe.on('inertiaFail', function () { return _this._handleSwipeInertiaFail(); });
        this._swipe.on('inertiaCancel', function () { return _this._handleSwipeInertiaCancel(); });
        // on props change
        snap.on('props', function () {
            _this._swipe.updateProps({
                enabled: snap.props.swipe,
                grabCursor: snap.props.grabCursor,
                minTime: snap.props.swipeMinTime,
                threshold: snap.props.swipeThreshold,
                axis: _this.axis,
                inertiaDuration: snap.props.swipeInertiaDuration,
                inertiaRatio: snap.props.swipeInertiaRatio,
            });
        }, { protected: true });
    }
    Object.defineProperty(SnapSwipe.prototype, "axis", {
        /** Axis name depending on swipe direction */
        get: function () {
            var snap = this.snap;
            return snap.props.swipeAxis === 'auto' ? snap.axis : snap.props.swipeAxis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSwipe.prototype, "isSwiping", {
        /** Check if swiping in action */
        get: function () {
            return this._swipe.isSwiping;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSwipe.prototype, "hasInertia", {
        /** Check if inertia is active */
        get: function () {
            return this._swipe.hasInertia;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSwipe.prototype, "isShort", {
        /** Detect if swipe is short */
        get: function () {
            var props = this.snap.props;
            if (!props.shortSwipes) {
                return false;
            }
            var diff = +new Date() - this._startTime;
            return diff <= props.shortSwipesDuration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSwipe.prototype, "allowFriction", {
        /** Checks if resistance is allowed */
        get: function () {
            return !this.isShort && this.snap.props.swipeFriction;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapSwipe.prototype, "diff", {
        /** Swipe difference between start and current coordinates */
        get: function () {
            return this.axis === 'x' ? this._swipe.diff.x : this._swipe.diff.y;
        },
        enumerable: false,
        configurable: true
    });
    SnapSwipe.prototype._handleVelocityModifier = function (source) {
        var _a, _b;
        var _c = this.snap, props = _c.props, track = _c.track, activeSlide = _c.activeSlide, domSize = _c.domSize;
        var coord = activeSlide.coord, slideSize = activeSlide.size;
        // Simple freemode
        if (props.freemode === true) {
            return source;
        }
        // Update target coordinate
        track.target = track.current;
        // Sticky freemode
        if (props.freemode === 'sticky' && !track.isSlideScrolling) {
            var virtualCoord = track.loopedCurrent - source[this.axis];
            var magnet = this.snap.getNearestMagnet(virtualCoord);
            if (!magnet) {
                return source;
            }
            var newVelocity = track.loopedCurrent - virtualCoord - magnet.diff;
            return __assign(__assign({}, source), (_a = {}, _a[this.axis] = newVelocity, _a));
        }
        // Freemode: false, when slides are scrolled
        var value = (0, utils_1.clamp)(source[this.axis], -coord, domSize - slideSize - coord);
        var output = __assign(__assign({}, source), (_b = {}, _b[this.axis] = value, _b));
        return output;
    };
    /**
     * Handles swipe `start` event.
     */
    SnapSwipe.prototype._handleSwipeStart = function (coords) {
        var snap = this.snap;
        this._startIndex = snap.activeIndex;
        this._startTime = +new Date();
        // disable pointer events
        snap.eventsEmitter.style.pointerEvents = 'none';
        // cancel sticky behavior
        if (snap.props.followSwipe) {
            snap.cancelTransition();
        }
        // Emit callbacks
        snap.callbacks.emit('swipeStart', coords);
    };
    /**
     * Handles swipe `move` event.
     */
    SnapSwipe.prototype._handleSwipeMove = function (coords) {
        var snap = this.snap;
        var props = snap.props, track = snap.track, callbacks = snap.callbacks;
        var shouldFollow = props.followSwipe;
        if (!shouldFollow && !track.isSlideScrolling) {
            return;
        }
        // Normalize swipe delta
        var swipeDelta = this.axis === 'x' ? coords.step.x : coords.step.y;
        var speed = this.hasInertia ? 1 : props.swipeSpeed;
        var delta = swipeDelta * -speed;
        // Update track target
        track.iterateTarget(delta);
        // Clamp target if inertia is animating
        if (this._swipe.hasInertia) {
            track.clampTarget();
        }
        // Emit move callbacks
        callbacks.emit('swipe', coords);
    };
    /** Handles swipe `end` event */
    SnapSwipe.prototype._handleSwipeEnd = function (coords) {
        this._end();
        // Enable pointer events
        this.snap.eventsEmitter.style.pointerEvents = '';
        // Emit end callbacks
        this.snap.callbacks.emit('swipeEnd', coords);
    };
    /** Handles swipe inertia start */
    SnapSwipe.prototype._handleSwipeInertiaStart = function () {
        this.snap.callbacks.emit('swipeInertiaStart', undefined);
    };
    /** Handles swipe inertia end */
    SnapSwipe.prototype._handleSwipeInertiaEnd = function () {
        this.snap.callbacks.emit('swipeInertiaEnd', undefined);
    };
    /** Handles swipe inertia fail */
    SnapSwipe.prototype._handleSwipeInertiaFail = function () {
        var snap = this.snap;
        if (snap.props.freemode === 'sticky' && !snap.track.isSlideScrolling) {
            if (this.isShort) {
                this._endShort();
            }
            else {
                snap.stick();
            }
        }
        this.snap.callbacks.emit('swipeInertiaFail', undefined);
    };
    /** Handles swipe inertia cancel */
    SnapSwipe.prototype._handleSwipeInertiaCancel = function () {
        this.snap.callbacks.emit('swipeInertiaCancel', undefined);
    };
    /** End swipe action */
    SnapSwipe.prototype._end = function () {
        var _a = this, snap = _a.snap, swipe = _a._swipe;
        var props = snap.props, track = snap.track;
        // Handle freemode
        if (props.freemode) {
            this._swipe.updateProps({ inertia: true });
            // Clamp & stick if out of bounds
            if (!track.canLoop &&
                (track.target < track.min || track.target > track.max)) {
                swipe.cancelInertia();
                snap.stick();
            }
            // End short swipe
            if (this.isShort && props.freemode === 'sticky') {
                this._swipe.updateProps({ inertia: false });
                swipe.cancelInertia();
                this._endShort();
            }
            return;
        }
        // Enable inertia if active slide is being scrolled
        if (track.isSlideScrolling) {
            this._swipe.updateProps({ inertia: true });
            return;
        }
        // Disable inertia
        this._swipe.updateProps({ inertia: false });
        // Return if followSwipe is disabled
        if (!props.followSwipe) {
            this._endNoFollow();
            return;
        }
        // Short swipe
        if (this.isShort) {
            this._endShort();
            return;
        }
        // Or just stick to the nearest slide
        snap.stick();
    };
    /** End short swipe */
    SnapSwipe.prototype._endShort = function () {
        var _a = this, diff = _a.diff, snap = _a.snap;
        var props = snap.props, activeSlide = snap.activeSlide;
        if (Math.abs(diff) < props.shortSwipesThreshold) {
            snap.stick();
            return;
        }
        var normalizedDiff = Math.sign(diff) * Math.sign(props.swipeSpeed);
        if (this._startIndex !== snap.activeIndex) {
            if (normalizedDiff < 0 && activeSlide.progress > 0) {
                snap.next();
            }
            else if (normalizedDiff > 0 && activeSlide.progress < 0) {
                snap.prev();
            }
            else {
                snap.stick();
            }
            return;
        }
        if (normalizedDiff < 0) {
            snap.next();
        }
        else {
            snap.prev();
        }
    };
    /** End action when `followSwipe` is disabled */
    SnapSwipe.prototype._endNoFollow = function () {
        var _a = this, diff = _a.diff, snap = _a.snap;
        if (Math.abs(diff) < 20) {
            snap.stick();
            return;
        }
        if (diff < 0) {
            snap.next();
        }
        else {
            snap.prev();
        }
    };
    /** Destroy swipe */
    SnapSwipe.prototype._destroy = function () {
        this._swipe.destroy();
    };
    return SnapSwipe;
}());
exports.SnapSwipe = SnapSwipe;
//# sourceMappingURL=index.js.map