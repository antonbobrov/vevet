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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snap = void 0;
var base_1 = require("../../base");
var Timeline_1 = require("../Timeline");
var Raf_1 = require("../Raf");
var utils_1 = require("../../utils");
var Slide_1 = require("./Slide");
var Wheel_1 = require("./Wheel");
var Swipe_1 = require("./Swipe");
var Track_1 = require("./Track");
var Keyboard_1 = require("./Keyboard");
var initVevet_1 = require("../../global/initVevet");
__exportStar(require("./types"), exports);
__exportStar(require("./Slide"), exports);
// todo: add examples for freemode: sticky
// todo: fix freemode with negative swipeSpeed
// todo: jsdoc
/**
 * Snap/Carousel handler.
 * This class manages sliding progress with options like swipe, wheel interactions, and smooth transitions.
 *
 * Please not that the class does not apply any styles to the slides, it only handles the logic.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Snap)
 *
 * @group Components
 */
var Snap = /** @class */ (function (_super) {
    __extends(Snap, _super);
    function Snap(props) {
        var _this = _super.call(this, props) || this;
        /** Container size */
        _this._domSize = 0;
        /** All slides */
        _this._slides = [];
        /** Scrollable slides (which size is larger than the container) */
        _this._scrollableSlides = [];
        var _a = _this.props, container = _a.container, activeIndex = _a.activeIndex;
        // set vars
        _this._activeIndex = activeIndex;
        // add resize event
        _this._resizeHandler = (0, utils_1.onResize)({
            element: container,
            viewportTarget: 'width',
            callback: function () { return _this._handleResize(); },
            name: _this.name,
        });
        // initial resize
        _this._resizeHandler.debounceResize();
        // Create the animation frame
        _this._raf = new Raf_1.Raf();
        _this._raf.on('frame', function () { return _this._handleRaf(); });
        _this._raf.on('play', function () { return _this._callbacks.emit('rafPlay', undefined); });
        _this._raf.on('pause', function () { return _this._callbacks.emit('rafPause', undefined); });
        // fetch slides
        _this._fetchSlides();
        // add wheel listener
        _this._wheel = new Wheel_1.SnapWheel(_this);
        // add swipe
        _this._swipe = new Swipe_1.SnapSwipe(_this);
        // add track
        _this._track = new Track_1.SnapTrack(_this);
        // add keyboard
        _this._keyboard = new Keyboard_1.SnapKeyboard(_this);
        return _this;
    }
    /** Retrieves the default static properties. */
    Snap.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { eventsEmitter: null, activeIndex: 0 });
    };
    /** Retrieves the default mutable properties. */
    Snap.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { slides: false, direction: 'horizontal', centered: false, loop: false, gap: 0, lerp: 0.2, freemode: false, stickOnResize: true, friction: 0, edgeFriction: 0.85, duration: 500, easing: utils_1.EaseOutCubic, swipe: true, grabCursor: false, swipeSpeed: 1, swipeAxis: 'auto', followSwipe: true, shortSwipes: true, shortSwipesDuration: 300, shortSwipesThreshold: 30, swipeFriction: false, swipeLerp: (0, initVevet_1.initVevet)().mobile ? 1 : 0.6, swipeThreshold: 5, swipeMinTime: 0, swipeInertiaDuration: function (distance) { return (0, utils_1.clamp)(distance, 500, 2000); }, swipeInertiaRatio: 0.3, wheel: false, wheelSpeed: 1, wheelAxis: 'auto', followWheel: true, wheelThrottle: 'auto', stickOnWheelEnd: true, stickOnWheelEndThreshold: 30, slideSize: 'auto' });
    };
    /** Handles properties change */
    Snap.prototype._handleProps = function () {
        // attach slides
        this._fetchSlides();
        // resize instantly
        this._resizeHandler.resize();
        // update props
        _super.prototype._handleProps.call(this);
    };
    /** Update slides list and attach them */
    Snap.prototype._fetchSlides = function () {
        var _this = this;
        this._slides.forEach(function (slide) { return slide.detach(); });
        var children = this.props.slides
            ? this.props.slides
            : Array.from(this.props.container.children);
        this._slides = children.map(function (item) {
            if (item instanceof Slide_1.SnapSlide) {
                return item;
            }
            return new Slide_1.SnapSlide(item);
        });
        this._slides.forEach(function (slide, index) { return slide.attach(_this, index); });
    };
    /** Request resize (handled with debounce timeout) */
    Snap.prototype.resize = function (isManual) {
        if (isManual === void 0) { isManual = false; }
        if (isManual) {
            this._resizeHandler.resize();
        }
        else {
            this._resizeHandler.debounceResize();
        }
    };
    /** Resize the scene and reflow */
    Snap.prototype._handleResize = function () {
        var _a = this.props, direction = _a.direction, container = _a.container;
        // cancel sticky behavior
        this.cancelTransition();
        // update container size
        this._domSize =
            direction === 'horizontal'
                ? container.offsetWidth
                : container.offsetHeight;
        // reflow
        this._reflow();
        // emit callbacks
        this.callbacks.emit('resize', undefined);
    };
    Object.defineProperty(Snap.prototype, "container", {
        /** Get container */
        get: function () {
            return this.props.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "eventsEmitter", {
        /** Get events emitter */
        get: function () {
            var _a;
            return (_a = this.props.eventsEmitter) !== null && _a !== void 0 ? _a : this.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "domSize", {
        /** Container size depending on direction (width or height) */
        get: function () {
            return this._domSize;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "slides", {
        /** All slides */
        get: function () {
            return this._slides;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "scrollableSlides", {
        /** Scrollable slides (which size is larger than the container) */
        get: function () {
            return this._scrollableSlides;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "activeIndex", {
        /** Active slide index */
        get: function () {
            return this._activeIndex;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "activeSlide", {
        /** Active slide */
        get: function () {
            return this.slides[this._activeIndex];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "isEmpty", {
        get: function () {
            return this.slides.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "axis", {
        /** Get axis name depending on direction */
        get: function () {
            return this.props.direction === 'horizontal' ? 'x' : 'y';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "track", {
        /** Snap track */
        get: function () {
            return this._track;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "isTransitioning", {
        /** If transition in progress */
        get: function () {
            return !!this._timeline;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snap.prototype, "isSwiping", {
        /** If swipe in progress */
        get: function () {
            return !!this._swipe.isSwiping;
        },
        enumerable: false,
        configurable: true
    });
    /** Reflow: update static values of slides */
    Snap.prototype._reflow = function () {
        var _this = this;
        var _a = this, slides = _a.slides, props = _a.props;
        if (slides.length === 0) {
            return;
        }
        // Reset scrollable slides
        this._scrollableSlides = [];
        // Calculate static values
        slides.reduce(function (prev, slide) {
            slide.setStaticCoord(prev);
            if (slide.size > _this.domSize) {
                _this._scrollableSlides.push(slide);
            }
            return prev + slide.size + (0, utils_1.toPixels)(props.gap);
        }, 0);
        // Reset to active slide
        var slide = slides.find(function (_a) {
            var index = _a.index;
            return index === _this.activeIndex;
        });
        if (props.stickOnResize && slide) {
            this.track.clampTarget();
            this.track.set(slide.magnets[0]);
        }
        // Emit callbacks
        this.callbacks.emit('reflow', undefined);
        // Render after resize
        this.render();
    };
    /** Handle RAF update, interpolate track values */
    Snap.prototype._handleRaf = function () {
        if (this.isTransitioning) {
            return;
        }
        var _a = this, track = _a.track, props = _a.props, swipe = _a._swipe;
        // Get lerp factor
        var lerpFactor = (swipe.isSwiping || swipe.hasInertia) && props.swipeLerp
            ? props.swipeLerp
            : props.lerp;
        // Interpolate track value
        track.lerp(this._raf.lerpFactor(lerpFactor));
        // Stop raf if target reached
        if (track.isInterpolated) {
            this._raf.pause();
        }
        // Render the scene
        this.render(this._raf.duration);
    };
    /** Render slides */
    Snap.prototype.render = function (frameDuration) {
        if (frameDuration === void 0) { frameDuration = 0; }
        if (this.isEmpty) {
            return;
        }
        var _a = this, swipe = _a._swipe, track = _a.track, props = _a.props;
        // Update values
        this._updateSlidesCoords();
        this._updateSlidesProgress();
        // Get magnet after slide coordinates are updated
        var magnet = this.magnet;
        // Active index change
        if (magnet &&
            magnet.slide.index !== this._activeIndex &&
            (typeof this._targetIndex === 'undefined' ||
                magnet.slide.index === this._targetIndex)) {
            this._activeIndex = magnet.slide.index;
            this._targetIndex = undefined;
            this.callbacks.emit('activeSlide', this.activeSlide);
        }
        // Check if friction is allowed
        var hasFriction = (swipe.isSwiping && swipe.allowFriction) || !swipe.isSwiping;
        // Apply friction
        if (magnet &&
            hasFriction &&
            frameDuration > 0 &&
            props.friction >= 0 &&
            !track.isSlideScrolling &&
            !props.freemode) {
            track.target = (0, utils_1.damp)(track.target, track.current + magnet.diff, props.friction * props.lerp, frameDuration, 0.000001);
        }
        // Render slides
        this.slides.forEach(function (slide) { return slide.render(); });
        // Emit Calbacks
        this.callbacks.emit('update', undefined);
    };
    /** Update slides values */
    Snap.prototype._updateSlidesCoords = function () {
        var _a = this, slides = _a.slides, track = _a.track;
        var isCentered = this.props.centered;
        var offset = isCentered ? this._domSize / 2 - this.firstSlideSize / 2 : 0;
        slides.forEach(function (slide) {
            var staticCoord = slide.staticCoord, size = slide.size;
            if (!track.canLoop) {
                slide.setCoord(staticCoord + offset - track.current);
                return;
            }
            if (isCentered) {
                slide.setCoord((0, utils_1.loop)(staticCoord + offset - track.current, -track.max / 2 + offset, track.max / 2 + offset));
                return;
            }
            slide.setCoord((0, utils_1.loop)(staticCoord - track.current, -size, track.max - size));
        });
    };
    Object.defineProperty(Snap.prototype, "firstSlideSize", {
        /** Get first slide size */
        get: function () {
            return this.slides[0].size;
        },
        enumerable: false,
        configurable: true
    });
    /** Update slides progress */
    Snap.prototype._updateSlidesProgress = function () {
        var _this = this;
        var _a = this, slides = _a.slides, domSize = _a.domSize;
        slides.forEach(function (slide) {
            var coord = slide.coord, size = slide.size;
            if (_this.props.centered) {
                var center = domSize / 2 - size / 2;
                slide.setProgress((0, utils_1.scoped)(coord, center, center - size));
                return;
            }
            slide.setProgress((0, utils_1.scoped)(coord, 0, -size));
        });
    };
    Object.defineProperty(Snap.prototype, "magnet", {
        /** Get nearest magnet */
        get: function () {
            var current = this.track.loopedCurrent;
            return this.getNearestMagnet(current);
        },
        enumerable: false,
        configurable: true
    });
    /** Get nearest magnet to the current position */
    Snap.prototype.getNearestMagnet = function (coord) {
        // todo: search only in nearby slides
        var magnets = this.slides.flatMap(function (slide) {
            return slide.magnets.map(function (magnet) { return ({ slide: slide, magnet: magnet, index: slide.index }); });
        });
        if (magnets.length === 0) {
            return undefined;
        }
        var closestMagnet = magnets.reduce(function (p, c) {
            return Math.abs(c.magnet - coord) < Math.abs(p.magnet - coord) ? c : p;
        });
        return __assign(__assign({}, closestMagnet), { diff: closestMagnet.magnet - coord });
    };
    /** Cancel sticky behavior */
    Snap.prototype.cancelTransition = function () {
        var _a;
        (_a = this._timeline) === null || _a === void 0 ? void 0 : _a.destroy();
        this._timeline = undefined;
    };
    /** Stick to the nearest magnet */
    Snap.prototype.stick = function () {
        var magnet = this.magnet;
        if (this.track.isSlideScrolling || !magnet) {
            return;
        }
        this.toCoord(this.track.current + magnet.diff);
    };
    /** Go to a definite coordinate */
    Snap.prototype.toCoord = function (coordinate, options) {
        var _this = this;
        var _a, _b;
        if (this.isEmpty) {
            return false;
        }
        this.cancelTransition();
        var _c = this, track = _c.track, props = _c.props, callbacks = _c.callbacks;
        var start = track.current;
        var end = coordinate;
        var diff = Math.abs(end - start);
        var durationProp = (_a = options === null || options === void 0 ? void 0 : options.duration) !== null && _a !== void 0 ? _a : props.duration;
        var duration = typeof durationProp === 'number' ? durationProp : durationProp(diff);
        if (diff === 0) {
            duration = 0;
        }
        var easing = (_b = options === null || options === void 0 ? void 0 : options.easing) !== null && _b !== void 0 ? _b : props.easing;
        var tm = new Timeline_1.Timeline({ duration: duration, easing: easing });
        this._timeline = tm;
        tm.on('start', function () {
            var _a;
            callbacks.emit('timelineStart', undefined);
            (_a = options === null || options === void 0 ? void 0 : options.onStart) === null || _a === void 0 ? void 0 : _a.call(options);
        });
        tm.on('update', function (data) {
            var _a;
            track.current = (0, utils_1.lerp)(start, end, data.eased);
            track.target = track.current;
            if (data.progress === 1) {
                _this._targetIndex = undefined;
            }
            _this.render();
            callbacks.emit('timelineUpdate', data);
            (_a = options === null || options === void 0 ? void 0 : options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, data);
        });
        tm.on('end', function () {
            var _a;
            tm.destroy();
            callbacks.emit('timelineEnd', undefined);
            (_a = options === null || options === void 0 ? void 0 : options.onEnd) === null || _a === void 0 ? void 0 : _a.call(options);
            _this._timeline = undefined;
        });
        tm.on('destroy', function () {
            _this._targetIndex = undefined;
        });
        tm.play();
        return true;
    };
    /** Go to a slide by index */
    Snap.prototype.toSlide = function (targetIndex, _a) {
        var _b, _c;
        if (_a === void 0) { _a = {}; }
        var _d = _a.direction, direction = _d === void 0 ? null : _d, options = __rest(_a, ["direction"]);
        var _e = this, isEmpty = _e.isEmpty, activeIndex = _e.activeIndex, slides = _e.slides, track = _e.track, props = _e.props;
        var current = track.current, max = track.max, loopCount = track.loopCount;
        if (isEmpty) {
            return false;
        }
        var index = (0, utils_1.loop)(targetIndex, 0, this.slides.length);
        // Stick if the same slide
        if (index === activeIndex) {
            this.stick();
            return false;
        }
        this._targetIndex = index;
        var slideMagnets = slides[index].magnets;
        var targetStaticMagnet = slideMagnets[0];
        if (props.centered) {
            if (direction === 'prev') {
                targetStaticMagnet = (_b = slideMagnets[2]) !== null && _b !== void 0 ? _b : slideMagnets[0];
            }
            else if (direction === 'next') {
                targetStaticMagnet = (_c = slideMagnets[1]) !== null && _c !== void 0 ? _c : slideMagnets[0];
            }
        }
        else {
            targetStaticMagnet =
                direction === 'prev'
                    ? slideMagnets[slideMagnets.length - 1]
                    : targetStaticMagnet;
        }
        // Use static magnet when not looping
        if (!props.loop) {
            return this.toCoord(targetStaticMagnet, options);
        }
        // Or calculate closest magnet
        var targetMagnet = targetStaticMagnet + loopCount * max;
        var targetMagnetMin = targetMagnet - max;
        var targetMagnetMax = targetMagnet + max;
        var allMagnets = [targetMagnetMin, targetMagnet, targetMagnetMax];
        if (typeof direction === 'string') {
            var magnets = allMagnets.filter(function (magnet) {
                return direction === 'next' ? magnet >= current : magnet <= current;
            });
            var magnet_1 = (0, utils_1.closest)(current, magnets);
            return this.toCoord(magnet_1, options);
        }
        var magnet = (0, utils_1.closest)(current, allMagnets);
        return this.toCoord(magnet, options);
    };
    /** Go to next slide */
    Snap.prototype.next = function (_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.skip, skip = _b === void 0 ? 1 : _b, options = __rest(_a, ["skip"]);
        var _c = this, props = _c.props, slides = _c.slides, activeIndex = _c.activeIndex;
        var index = props.loop
            ? (0, utils_1.loop)(activeIndex + skip, 0, slides.length)
            : Math.min(activeIndex + skip, slides.length - 1);
        return this.toSlide(index, __assign(__assign({}, options), { direction: 'next' }));
    };
    /** Go to previous slide */
    Snap.prototype.prev = function (_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.skip, skip = _b === void 0 ? 1 : _b, options = __rest(_a, ["skip"]);
        var _c = this, props = _c.props, slides = _c.slides, activeIndex = _c.activeIndex;
        var index = props.loop
            ? (0, utils_1.loop)(activeIndex - skip, 0, slides.length)
            : Math.max(activeIndex - skip, 0);
        return this.toSlide(index, __assign(__assign({}, options), { direction: 'prev' }));
    };
    /**
     * Destroys the component and clears all timeouts and resources.
     */
    Snap.prototype._destroy = function () {
        _super.prototype._destroy.call(this);
        this._resizeHandler.remove();
        this.cancelTransition();
        this._raf.destroy();
        this._slides.forEach(function (slide) { return slide.detach(); });
    };
    return Snap;
}(base_1.Module));
exports.Snap = Snap;
//# sourceMappingURL=index.js.map