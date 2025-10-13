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
import { Module } from '../../base';
import { Timeline } from '../Timeline';
import { Raf } from '../Raf';
import { onResize, scoped, loop, EaseOutCubic, damp, lerp, toPixels, closest, clamp, } from '../../utils';
import { SnapSlide } from './Slide';
import { SnapWheel } from './Wheel';
import { SnapSwipe } from './Swipe';
import { SnapTrack } from './Track';
import { SnapKeyboard } from './Keyboard';
import { initVevet } from '../../global/initVevet';
export * from './types';
export * from './Slide';
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
export class Snap extends Module {
    /** Retrieves the default static properties. */
    _getStatic() {
        return Object.assign(Object.assign({}, super._getStatic()), { eventsEmitter: null, activeIndex: 0 });
    }
    /** Retrieves the default mutable properties. */
    _getMutable() {
        return Object.assign(Object.assign({}, super._getMutable()), { slides: false, direction: 'horizontal', centered: false, loop: false, gap: 0, lerp: 0.2, freemode: false, stickOnResize: true, friction: 0, edgeFriction: 0.85, duration: 500, easing: EaseOutCubic, swipe: true, grabCursor: false, swipeSpeed: 1, swipeAxis: 'auto', followSwipe: true, shortSwipes: true, shortSwipesDuration: 300, shortSwipesThreshold: 30, swipeFriction: false, swipeLerp: initVevet().mobile ? 1 : 0.6, swipeThreshold: 5, swipeMinTime: 0, swipeInertiaDuration: (distance) => clamp(distance, 500, 2000), swipeInertiaRatio: 0.3, wheel: false, wheelSpeed: 1, wheelAxis: 'auto', followWheel: true, wheelThrottle: 'auto', stickOnWheelEnd: true, stickOnWheelEndThreshold: 30, slideSize: 'auto' });
    }
    constructor(props) {
        super(props);
        /** Container size */
        this._domSize = 0;
        /** All slides */
        this._slides = [];
        /** Scrollable slides (which size is larger than the container) */
        this._scrollableSlides = [];
        const { container, activeIndex } = this.props;
        // set vars
        this._activeIndex = activeIndex;
        // add resize event
        this._resizeHandler = onResize({
            element: container,
            viewportTarget: 'width',
            callback: () => this._handleResize(),
            name: this.name,
        });
        // initial resize
        this._resizeHandler.debounceResize();
        // Create the animation frame
        this._raf = new Raf();
        this._raf.on('frame', () => this._handleRaf());
        this._raf.on('play', () => this._callbacks.emit('rafPlay', undefined));
        this._raf.on('pause', () => this._callbacks.emit('rafPause', undefined));
        // fetch slides
        this._fetchSlides();
        // add wheel listener
        this._wheel = new SnapWheel(this);
        // add swipe
        this._swipe = new SnapSwipe(this);
        // add track
        this._track = new SnapTrack(this);
        // add keyboard
        this._keyboard = new SnapKeyboard(this);
    }
    /** Handles properties change */
    _handleProps() {
        // attach slides
        this._fetchSlides();
        // resize instantly
        this._resizeHandler.resize();
        // update props
        super._handleProps();
    }
    /** Update slides list and attach them */
    _fetchSlides() {
        this._slides.forEach((slide) => slide.detach());
        const children = this.props.slides
            ? this.props.slides
            : Array.from(this.props.container.children);
        this._slides = children.map((item) => {
            if (item instanceof SnapSlide) {
                return item;
            }
            return new SnapSlide(item);
        });
        this._slides.forEach((slide, index) => slide.attach(this, index));
    }
    /** Request resize (handled with debounce timeout) */
    resize(isManual = false) {
        if (isManual) {
            this._resizeHandler.resize();
        }
        else {
            this._resizeHandler.debounceResize();
        }
    }
    /** Resize the scene and reflow */
    _handleResize() {
        const { direction, container } = this.props;
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
    }
    /** Get container */
    get container() {
        return this.props.container;
    }
    /** Get events emitter */
    get eventsEmitter() {
        var _a;
        return (_a = this.props.eventsEmitter) !== null && _a !== void 0 ? _a : this.container;
    }
    /** Container size depending on direction (width or height) */
    get domSize() {
        return this._domSize;
    }
    /** All slides */
    get slides() {
        return this._slides;
    }
    /** Scrollable slides (which size is larger than the container) */
    get scrollableSlides() {
        return this._scrollableSlides;
    }
    /** Active slide index */
    get activeIndex() {
        return this._activeIndex;
    }
    /** Active slide */
    get activeSlide() {
        return this.slides[this._activeIndex];
    }
    get isEmpty() {
        return this.slides.length === 0;
    }
    /** Get axis name depending on direction */
    get axis() {
        return this.props.direction === 'horizontal' ? 'x' : 'y';
    }
    /** Snap track */
    get track() {
        return this._track;
    }
    /** If transition in progress */
    get isTransitioning() {
        return !!this._timeline;
    }
    /** If swipe in progress */
    get isSwiping() {
        return !!this._swipe.isSwiping;
    }
    /** Reflow: update static values of slides */
    _reflow() {
        const { slides, props } = this;
        if (slides.length === 0) {
            return;
        }
        // Reset scrollable slides
        this._scrollableSlides = [];
        // Calculate static values
        slides.reduce((prev, slide) => {
            slide.setStaticCoord(prev);
            if (slide.size > this.domSize) {
                this._scrollableSlides.push(slide);
            }
            return prev + slide.size + toPixels(props.gap);
        }, 0);
        // Reset to active slide
        const slide = slides.find(({ index }) => index === this.activeIndex);
        if (props.stickOnResize && slide) {
            this.track.clampTarget();
            this.track.set(slide.magnets[0]);
        }
        // Emit callbacks
        this.callbacks.emit('reflow', undefined);
        // Render after resize
        this.render();
    }
    /** Handle RAF update, interpolate track values */
    _handleRaf() {
        if (this.isTransitioning) {
            return;
        }
        const { track, props, _swipe: swipe } = this;
        // Get lerp factor
        const lerpFactor = (swipe.isSwiping || swipe.hasInertia) && props.swipeLerp
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
    }
    /** Render slides */
    render(frameDuration = 0) {
        if (this.isEmpty) {
            return;
        }
        const { _swipe: swipe, track, props } = this;
        // Update values
        this._updateSlidesCoords();
        this._updateSlidesProgress();
        // Get magnet after slide coordinates are updated
        const { magnet } = this;
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
        const hasFriction = (swipe.isSwiping && swipe.allowFriction) || !swipe.isSwiping;
        // Apply friction
        if (magnet &&
            hasFriction &&
            frameDuration > 0 &&
            props.friction >= 0 &&
            !track.isSlideScrolling &&
            !props.freemode) {
            track.target = damp(track.target, track.current + magnet.diff, props.friction * props.lerp, frameDuration, 0.000001);
        }
        // Render slides
        this.slides.forEach((slide) => slide.render());
        // Emit Calbacks
        this.callbacks.emit('update', undefined);
    }
    /** Update slides values */
    _updateSlidesCoords() {
        const { slides, track } = this;
        const { centered: isCentered } = this.props;
        const offset = isCentered ? this._domSize / 2 - this.firstSlideSize / 2 : 0;
        slides.forEach((slide) => {
            const { staticCoord, size } = slide;
            if (!track.canLoop) {
                slide.setCoord(staticCoord + offset - track.current);
                return;
            }
            if (isCentered) {
                slide.setCoord(loop(staticCoord + offset - track.current, -track.max / 2 + offset, track.max / 2 + offset));
                return;
            }
            slide.setCoord(loop(staticCoord - track.current, -size, track.max - size));
        });
    }
    /** Get first slide size */
    get firstSlideSize() {
        return this.slides[0].size;
    }
    /** Update slides progress */
    _updateSlidesProgress() {
        const { slides, domSize } = this;
        slides.forEach((slide) => {
            const { coord, size } = slide;
            if (this.props.centered) {
                const center = domSize / 2 - size / 2;
                slide.setProgress(scoped(coord, center, center - size));
                return;
            }
            slide.setProgress(scoped(coord, 0, -size));
        });
    }
    /** Get nearest magnet */
    get magnet() {
        const current = this.track.loopedCurrent;
        return this.getNearestMagnet(current);
    }
    /** Get nearest magnet to the current position */
    getNearestMagnet(coord) {
        // todo: search only in nearby slides
        const magnets = this.slides.flatMap((slide) => slide.magnets.map((magnet) => ({ slide, magnet, index: slide.index })));
        if (magnets.length === 0) {
            return undefined;
        }
        const closestMagnet = magnets.reduce((p, c) => Math.abs(c.magnet - coord) < Math.abs(p.magnet - coord) ? c : p);
        return Object.assign(Object.assign({}, closestMagnet), { diff: closestMagnet.magnet - coord });
    }
    /** Cancel sticky behavior */
    cancelTransition() {
        var _a;
        (_a = this._timeline) === null || _a === void 0 ? void 0 : _a.destroy();
        this._timeline = undefined;
    }
    /** Stick to the nearest magnet */
    stick() {
        const { magnet } = this;
        if (this.track.isSlideScrolling || !magnet) {
            return;
        }
        this.toCoord(this.track.current + magnet.diff);
    }
    /** Go to a definite coordinate */
    toCoord(coordinate, options) {
        var _a, _b;
        if (this.isEmpty) {
            return false;
        }
        this.cancelTransition();
        const { track, props, callbacks } = this;
        const start = track.current;
        const end = coordinate;
        const diff = Math.abs(end - start);
        const durationProp = (_a = options === null || options === void 0 ? void 0 : options.duration) !== null && _a !== void 0 ? _a : props.duration;
        let duration = typeof durationProp === 'number' ? durationProp : durationProp(diff);
        if (diff === 0) {
            duration = 0;
        }
        const easing = (_b = options === null || options === void 0 ? void 0 : options.easing) !== null && _b !== void 0 ? _b : props.easing;
        const tm = new Timeline({ duration, easing });
        this._timeline = tm;
        tm.on('start', () => {
            var _a;
            callbacks.emit('timelineStart', undefined);
            (_a = options === null || options === void 0 ? void 0 : options.onStart) === null || _a === void 0 ? void 0 : _a.call(options);
        });
        tm.on('update', (data) => {
            var _a;
            track.current = lerp(start, end, data.eased);
            track.target = track.current;
            if (data.progress === 1) {
                this._targetIndex = undefined;
            }
            this.render();
            callbacks.emit('timelineUpdate', data);
            (_a = options === null || options === void 0 ? void 0 : options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, data);
        });
        tm.on('end', () => {
            var _a;
            tm.destroy();
            callbacks.emit('timelineEnd', undefined);
            (_a = options === null || options === void 0 ? void 0 : options.onEnd) === null || _a === void 0 ? void 0 : _a.call(options);
            this._timeline = undefined;
        });
        tm.on('destroy', () => {
            this._targetIndex = undefined;
        });
        tm.play();
        return true;
    }
    /** Go to a slide by index */
    toSlide(targetIndex, _a = {}) {
        var _b, _c;
        var { direction = null } = _a, options = __rest(_a, ["direction"]);
        const { isEmpty, activeIndex, slides, track, props } = this;
        const { current, max, loopCount } = track;
        if (isEmpty) {
            return false;
        }
        const index = loop(targetIndex, 0, this.slides.length);
        // Stick if the same slide
        if (index === activeIndex) {
            this.stick();
            return false;
        }
        this._targetIndex = index;
        const slideMagnets = slides[index].magnets;
        let targetStaticMagnet = slideMagnets[0];
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
        const targetMagnet = targetStaticMagnet + loopCount * max;
        const targetMagnetMin = targetMagnet - max;
        const targetMagnetMax = targetMagnet + max;
        const allMagnets = [targetMagnetMin, targetMagnet, targetMagnetMax];
        if (typeof direction === 'string') {
            const magnets = allMagnets.filter((magnet) => direction === 'next' ? magnet >= current : magnet <= current);
            const magnet = closest(current, magnets);
            return this.toCoord(magnet, options);
        }
        const magnet = closest(current, allMagnets);
        return this.toCoord(magnet, options);
    }
    /** Go to next slide */
    next(_a = {}) {
        var { skip = 1 } = _a, options = __rest(_a, ["skip"]);
        const { props, slides, activeIndex } = this;
        const index = props.loop
            ? loop(activeIndex + skip, 0, slides.length)
            : Math.min(activeIndex + skip, slides.length - 1);
        return this.toSlide(index, Object.assign(Object.assign({}, options), { direction: 'next' }));
    }
    /** Go to previous slide */
    prev(_a = {}) {
        var { skip = 1 } = _a, options = __rest(_a, ["skip"]);
        const { props, slides, activeIndex } = this;
        const index = props.loop
            ? loop(activeIndex - skip, 0, slides.length)
            : Math.max(activeIndex - skip, 0);
        return this.toSlide(index, Object.assign(Object.assign({}, options), { direction: 'prev' }));
    }
    /**
     * Destroys the component and clears all timeouts and resources.
     */
    _destroy() {
        super._destroy();
        this._resizeHandler.remove();
        this.cancelTransition();
        this._raf.destroy();
        this._slides.forEach((slide) => slide.detach());
    }
}
//# sourceMappingURL=index.js.map