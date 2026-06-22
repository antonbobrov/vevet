import { Module, TModuleOnCallbacksProps } from '@/base';
import { isString } from '@/internal/isString';
import { isUndefined } from '@/internal/isUndefined';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import {
  IOnResize,
  onResize,
  loop,
  damp,
  toPixels,
  closest,
  inRange,
} from '@/utils';

import { SnapIdle } from './logic/Idle';
import { SnapInterval } from './logic/Interval';
import { SnapKeyboard } from './logic/Keyboard';
import { SnapSlide } from './logic/Slide';
import { SnapSlides } from './logic/Slides';
import { SnapSwipe } from './logic/Swipe';
import { SnapWheel } from './logic/Wheel';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { SnapTrack } from './Track';
import {
  ISnapCallbacksMap,
  ISnapMagnet,
  ISnapMutableProps,
  ISnapNexPrevArg,
  ISnapStaticProps,
  ISnapToSlideArg,
  ISnapTransitionArg,
} from './types';

export * from './types';
export * from './logic/Slide';

type TC = ISnapCallbacksMap;
type TS = ISnapStaticProps;
type TM = ISnapMutableProps;

/**
 * Snap/Carousel handler.
 * This class manages sliding progress with options like swipe, wheel interactions, and smooth transitions.
 *
 * Please not that the class does not apply any styles to the slides, it only handles the logic.
 *
 * [Documentation](https://vevetjs.com/docs/Snap)
 *
 * @group Components
 */
export class Snap extends Module<TC, TS, TM> {
  /**
   * Returns the default static properties.
   */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /**
   * Returns the default mutable properties.
   */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Snap Track */
  private _track: SnapTrack;

  /** Swipe events */
  private _swipe: SnapSwipe;

  /** Wheel events */
  private _wheel: SnapWheel;

  /** Snap Idle Logic */
  private _idle: SnapIdle;

  /** Container size */
  private _containerSize = 0;

  /** Slides instance */
  private _slides: SnapSlides;

  /** Scrollable slides (which size is larger than the container) */
  private _scrollableSlides: SnapSlide[] = [];

  /** Resize handler */
  private _resizer: IOnResize;

  /** Active slide index */
  private _activeIndex: number;

  constructor(
    props: TS & TM & TModuleOnCallbacksProps<TC, Snap>,
    onCallbacks?: TModuleOnCallbacksProps<TC, Snap>,
  ) {
    super(props, onCallbacks as any);

    const { container, activeIndex } = this.props;

    // set vars
    this._activeIndex = activeIndex;

    // init slides
    this._slides = new SnapSlides();

    // add resize event
    this._resizer = onResize({
      element: container,
      viewportTarget: 'width',
      callback: () => this._handleResize(),
      name: this.name,
    });

    // initial resize
    this._resizer.debounceResize();

    // fetch slides
    this._fetchSlides();

    // add track
    this._track = new SnapTrack(this.props, {
      onRafPlay: () => this.callbacks.emit('rafPlay', undefined),
      onRafPause: () => this.callbacks.emit('rafPause', undefined),
      onRender: this.render.bind(this),
      containerSize: () => this.containerSize,
      firstSlideSize: () => this.firstSlideSize,
      origin: () => this.origin,
      onTimelineStart: () => this.callbacks.emit('timelineStart', undefined),
      onTimelineUpdate: (data) => this.callbacks.emit('timelineUpdate', data),
      onTimelineEnd: () => this.callbacks.emit('timelineEnd', undefined),
      getSlides: () => this._slides,
    });

    // add wheel listener
    this._wheel = new SnapWheel(this);

    // add swipe
    this._swipe = new SnapSwipe(this);

    // add keyboard
    new SnapKeyboard(this);

    // add interval
    new SnapInterval(
      this,
      () => this.prev(),
      () => this.next(),
    );

    // add idle logic
    this._idle = new SnapIdle(this);
  }

  /** Handles properties change */
  protected _handleProps(props: Partial<TM>) {
    // attach slides
    if ('slides' in props) {
      this._fetchSlides();
    }

    // resize immediately
    this._resizer.resize();

    // update props
    super._handleProps(props);
  }

  /** Get container */
  get container() {
    return this.props.container;
  }

  /** Get events emitter */
  get eventsEmitter() {
    return this.props.eventsEmitter ?? this.container;
  }

  /** Container size depending on direction (width or height) */
  get containerSize() {
    const { containerSize } = this.props;

    if (containerSize === 'auto') {
      return this._containerSize;
    }

    return toPixels(containerSize);
  }

  /**
   * Container size depending on direction (width or height)
   * @deprecated
   */
  get domSize() {
    return this.containerSize;
  }

  /** All slides */
  get slides() {
    return this._slides.all;
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
    return this._slides.at(this._activeIndex);
  }

  get isEmpty() {
    return this._slides.isEmpty;
  }

  /** Get axis name depending on direction */
  get axis() {
    return this.props.direction === 'horizontal' ? 'x' : 'y';
  }

  /** Get track */
  get $_track() {
    return this._track;
  }

  /** If transition in progress */
  get isTransitioning() {
    return this.$_track.isTransitioning;
  }

  /** If swipe in progress */
  get isSwiping() {
    return this._swipe.isSwiping;
  }

  /** If wheel events are active */
  get isWheeling() {
    return this._wheel.isWheeling;
  }

  /**
   * @deprecated
   */
  get hasInteria() {
    return this._swipe.hasInertia;
  }

  /** If swipe has inertia */
  get hasInertia() {
    return this._swipe.hasInertia;
  }

  /** If track values are interpolating */
  get isInterpolating() {
    return this.$_track.isInterpolating;
  }

  /** @deprecated */
  get influence() {
    return this.$_track.impulse;
  }

  /** Gets the interpolation impulse */
  get impulse() {
    return this.$_track.impulse;
  }

  /** Gets the current track value. */
  get current() {
    return this.$_track.current;
  }

  /** Gets the target track value. */
  get target() {
    return this.$_track.target;
  }

  /** Detect if can loop */
  get canLoop() {
    return this.$_track.canLoop;
  }

  /** Get looped current value */
  get loopedCurrent() {
    return this.$_track.loopedCurrent;
  }

  /** Get loop count */
  get loopCount() {
    return this.$_track.loopCount;
  }

  /** Get minimum track value */
  get min() {
    return this.$_track.min;
  }

  /** Get maximum track value */
  get max() {
    return this.$_track.max;
  }

  /** Get track progress. From 0 to 1 if not loop. From -Infinity to Infinity if loop */
  get progress() {
    return this.$_track.progress;
  }

  /** If the start has been reached */
  get isStart() {
    return this.$_track.isStart;
  }

  /** If the end has been reached */
  get isEnd() {
    return this.$_track.isEnd;
  }

  /** Slige magnet origin */
  get origin() {
    if (this.props.centered) {
      return 'center';
    }

    return this.props.origin;
  }

  /** Sets track to current & target value instantly */
  public set(value: number) {
    this.$_track.set(value);
  }

  /** Loop a coordinate if can loop */
  public loopCoord(coord: number) {
    return this.$_track.loopCoord(coord);
  }

  /** Clamp target value between min and max values */
  public clampTarget() {
    this.$_track.clampTarget();
  }

  /** Iterate track target value */
  public iterateTarget(delta: number) {
    this.$_track.updateTarget(this.$_track.target + delta);
  }

  /** Set track target value */
  public setTarget(value: number) {
    this.$_track.updateTarget(value);
  }

  /** Cancel slide transition */
  public cancelTransition() {
    this.$_track.cancelTransition();
  }

  /** Check if the active slide is larger than the container and is being scrolled */
  get isSlideScrolling() {
    const { containerSize } = this;

    return this.scrollableSlides.some(({ size, coord }) =>
      inRange(coord, containerSize - size, 0),
    );
  }

  /** Get first slide size */
  get firstSlideSize() {
    return this._slides.getFirstSlide().size;
  }

  /** If the scene is idle: not swiping, not interpolating, not transitioning */
  get isIdle() {
    return this._idle.isIdle;
  }

  /** Update slides list and attach them */
  private _fetchSlides() {
    this._slides.detachAll();
    this._slides.fetch(this.props.slides as any, this.container);
    this._slides.attachAll(this);
  }

  /** Request resize (handled with debounce timeout) */
  @noopIfDestroyed
  public resize(isManual = true) {
    if (isManual) {
      this._resizer.resize();
    } else {
      this._resizer.debounceResize();
    }
  }

  /** Resize the scene and reflow */
  private _handleResize() {
    const { container } = this.props;

    // cancel sticky behavior
    this.$_track.cancelTransition();

    // update container size
    this._containerSize =
      this.axis === 'x' ? container.offsetWidth : container.offsetHeight;

    // reflow
    this._reflow();

    // emit callbacks
    this.callbacks.emit('resize', undefined);
  }

  /** Reflow: update static values of slides */
  private _reflow() {
    const { props, containerSize } = this;
    const track = this.$_track;

    // Reflow slides
    this._slides.reflow(toPixels(props.gap));

    // Reset scrollable slides
    this._scrollableSlides = this.slides.filter(
      (slide) => slide.size > containerSize,
    );

    // Reset to active slide
    const activeSlide = this._slides.at(this.activeIndex);
    if (props.stickOnResize && activeSlide) {
      track.clampTarget();
      track.set(activeSlide.magnets[0]);
    }

    // Emit callbacks
    this.callbacks.emit('reflow', undefined);

    // Render after resize
    this.render();
  }

  /** Render slides */
  @noopIfDestroyed
  public render(frameDuration = 0) {
    const { _swipe: swipe, props } = this;
    const track = this.$_track;

    // Update values
    this.slides.forEach((slide) => slide.$_updateCoords(this.$_track.offset));
    this.slides.forEach((slide) => slide.$_updateProgress());

    // Get magnet after slide coordinates are updated
    const { magnet } = this;

    // Active index change
    if (
      magnet &&
      magnet.slide.index !== this._activeIndex &&
      (isUndefined(track.targetIndex) ||
        magnet.slide.index === track.targetIndex)
    ) {
      this._activeIndex = magnet.slide.index;
      track.setTargetIndex(undefined);

      this.callbacks.emit('activeSlide', this.activeSlide);
    }

    // Check if friction is allowed
    const hasFriction =
      (swipe.isSwiping && swipe.allowFriction) || !swipe.isSwiping;

    // Apply friction
    if (
      magnet &&
      hasFriction &&
      frameDuration > 0 &&
      props.friction >= 0 &&
      !this.isSlideScrolling &&
      !props.freemode
    ) {
      track.target = damp(
        track.target,
        track.current + magnet.diff,
        props.friction * props.lerp,
        frameDuration,
        0.000001,
      );
    }

    // Render slides
    this._slides.render();

    // Emit Calbacks
    this.callbacks.emit('update', undefined);
  }

  /** Get nearest magnet */
  private get magnet(): ISnapMagnet | undefined {
    const current = this._track.loopedCurrent;

    return this.getNearestMagnet(current);
  }

  /** Get nearest magnet to the current position */
  public getNearestMagnet(coord: number): ISnapMagnet | undefined {
    const withMagnets = this.slides.map((slide) =>
      slide.magnets.map((magnet) => ({
        slide,
        magnet,
        index: slide.index,
      })),
    );

    const magnets = withMagnets.flat();

    if (magnets.length === 0) {
      return undefined;
    }

    const closestMagnet = magnets.reduce((p, c) =>
      Math.abs(c.magnet - coord) < Math.abs(p.magnet - coord) ? c : p,
    );

    return { ...closestMagnet, diff: closestMagnet.magnet - coord };
  }

  /** Stick to the nearest magnet */
  public stick() {
    const { magnet } = this;

    if (this.isSlideScrolling || !magnet) {
      return false;
    }

    return this.toCoord(this.$_track.current + magnet.diff);
  }

  /** Go to a definite coordinate */
  @noopIfDestroyed
  public toCoord(coordinate: number, options?: ISnapTransitionArg) {
    return this.$_track.toCoord(coordinate, options);
  }

  /** Go to a slide by index */
  public toSlide(
    targetIndex: number,
    { direction = null, ...options }: ISnapToSlideArg = {},
  ) {
    const { activeIndex, origin, canLoop } = this;

    const track = this.$_track;
    const { current, max, loopCount } = this.$_track;

    if (this.isDestroyed) {
      return false;
    }

    const index = loop(targetIndex, 0, this._slides.length);

    // Return if the same slide
    if (index === activeIndex) {
      return false;
    }

    // Update target index
    track.setTargetIndex(index);

    // Detect magnet

    const slideMagnets = this._slides.at(index).magnets;
    let targetStaticMagnet = slideMagnets[0];

    if (origin === 'center') {
      if (direction === 'prev') {
        targetStaticMagnet = slideMagnets[2] ?? slideMagnets[0];
      } else if (direction === 'next') {
        targetStaticMagnet = slideMagnets[1] ?? slideMagnets[0];
      }
    } else if (origin === 'end') {
      targetStaticMagnet =
        direction === 'next'
          ? slideMagnets[slideMagnets.length - 1]
          : targetStaticMagnet;
    } else {
      targetStaticMagnet =
        direction === 'prev'
          ? slideMagnets[slideMagnets.length - 1]
          : targetStaticMagnet;
    }

    // Use static magnet when not looping

    if (!canLoop) {
      return this.toCoord(targetStaticMagnet, options);
    }

    // Or calculate closest magnet

    const targetMagnet = targetStaticMagnet + loopCount * max;
    const targetMagnetMin = targetMagnet - max;
    const targetMagnetMax = targetMagnet + max;
    const allMagnets = [targetMagnetMin, targetMagnet, targetMagnetMax];

    if (isString(direction)) {
      const magnets = allMagnets.filter((magnet) =>
        direction === 'next' ? magnet >= current : magnet <= current,
      );
      const magnet = closest(current, magnets);

      return this.toCoord(magnet, options);
    }

    const magnet = closest(current, allMagnets);

    return this.toCoord(magnet, options);
  }

  /** Go to next slide */
  public next({
    skip = this.props.slidesToScroll,
    ...options
  }: ISnapNexPrevArg = {}) {
    const { props, activeIndex, canLoop } = this;
    const { length } = this._slides;

    let index = loop(activeIndex + skip, 0, length);

    if (!canLoop) {
      index = props.rewind
        ? loop(activeIndex + skip, 0, length)
        : Math.min(activeIndex + skip, length - 1);
    }

    return this.toSlide(index, { ...options, direction: 'next' });
  }

  /** Go to previous slide */
  public prev({
    skip = this.props.slidesToScroll,
    ...options
  }: ISnapNexPrevArg = {}) {
    const { props, activeIndex, canLoop } = this;
    const { length } = this._slides;

    let index = loop(activeIndex - skip, 0, length);

    if (!canLoop) {
      index = props.rewind
        ? loop(activeIndex - skip, 0, length)
        : Math.max(activeIndex - skip, 0);
    }

    return this.toSlide(index, { ...options, direction: 'prev' });
  }

  /**
   * Destroys the component and clears all timeouts and resources.
   */
  protected _destroy() {
    super._destroy();

    this._track.destroy();
    this._resizer.remove();

    this._slides.detachAll();
  }
}
