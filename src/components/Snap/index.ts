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

import { SnapKeyboard } from './logic/Keyboard';
import { SnapSlide } from './logic/Slide';
import { SnapSwipe } from './logic/Swipe';
import { SnapTrack } from './logic/Track';
import { SnapWheel } from './logic/Wheel';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
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

  /** Swipe events */
  private _swipe: SnapSwipe;

  /** Snap Track */
  private _track: SnapTrack;

  /** Container size */
  private _containerSize = 0;

  /** All slides */
  private _slides: SnapSlide[] = [];

  /** Scrollable slides (which size is larger than the container) */
  private _scrollableSlides: SnapSlide[] = [];

  /** Resize handler */
  private _resizer: IOnResize;

  /** Active slide index */
  private _activeIndex: number;

  /**
   * Target slide index.
   * For internal use only
   */
  public $_targetIndex?: number;

  constructor(props: TS & TM, onCallbacks?: TModuleOnCallbacksProps<TC, Snap>) {
    super(props, onCallbacks as any);

    const { container, activeIndex } = this.props;

    // set vars
    this._activeIndex = activeIndex;

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

    // add wheel listener
    new SnapWheel(this as any);

    // add swipe
    this._swipe = new SnapSwipe(this as any);

    // add track
    this._track = new SnapTrack(this as any);

    // add keyboard
    new SnapKeyboard(this as any);
  }

  /** Handles properties change */
  protected _handleProps() {
    // attach slides
    this._fetchSlides();

    // resize immediately
    this._resizer.resize();

    // update props
    super._handleProps();
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

  /** If transition in progress */
  get isTransitioning() {
    return this._track.isTransitioning;
  }

  /** If swipe in progress */
  get isSwiping() {
    return !!this._swipe.isSwiping;
  }

  /** Gets the interpolation influence */
  get influence() {
    return this._track.influence;
  }

  /** Gets the current track value. */
  get current() {
    return this._track.current;
  }

  /** Gets the target track value. */
  get target() {
    return this._track.target;
  }

  /** Detect if can loop */
  get canLoop() {
    return this._track.canLoop;
  }

  /** Get looped current value */
  get loopedCurrent() {
    return this._track.loopedCurrent;
  }

  /** Get loop count */
  get loopCount() {
    return this._track.loopCount;
  }

  /** Sets track to current & target value instantly */
  public set(value: number) {
    this._track.set(value);
  }

  /** Loop a coordinate if can loop */
  public loopCoord(coord: number) {
    return this._track.loopCoord(coord);
  }

  /** Get minimum track value */
  get min() {
    return this._track.min;
  }

  /** Get maximum track value */
  get max() {
    return this._track.max;
  }

  /** Get track progress. From 0 to 1 if not loop. From -Infinity to Infinity if loop */
  get progress() {
    return this.current / this.max;
  }

  /** If the start has been reached */
  get isStart() {
    return this._track.isStart;
  }

  /** If the end has been reached */
  get isEnd() {
    return this._track.isEnd;
  }

  /** Clamp target value between min and max values */
  public clampTarget() {
    this._track.clampTarget();
  }

  /** Iterate track target value */
  public iterateTarget(delta: number) {
    this._track.iterateTarget(delta);
  }

  /** Cancel slide transition */
  public cancelTransition() {
    this._track.cancelTransition();
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
    return this.slides[0].size;
  }

  /** Update slides list and attach them */
  private _fetchSlides() {
    const { props } = this;

    this._slides.forEach((slide) => slide.$_detach());

    const children = props.slides
      ? props.slides
      : Array.from(props.container.children);

    this._slides = children.map((item) => {
      if (item instanceof SnapSlide) {
        return item;
      }

      return new SnapSlide(item as any);
    });

    this._slides.forEach((slide, index) => slide.$_attach(this as any, index));
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
    this._track.cancelTransition();

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
    const { slides, props } = this;

    if (this.isEmpty) {
      return;
    }

    // Reset scrollable slides
    this._scrollableSlides = [];

    // Calculate static values
    slides.reduce((prev, slide) => {
      slide.$_setStaticCoord(prev);

      if (slide.size > this.containerSize) {
        this._scrollableSlides.push(slide);
      }

      return prev + slide.size + toPixels(props.gap);
    }, 0);

    // Reset to active slide
    const slide = slides.find(({ index }) => index === this.activeIndex);
    if (props.stickOnResize && slide) {
      this._track.clampTarget();
      this._track.set(slide.magnets[0]);
    }

    // Emit callbacks
    this.callbacks.emit('reflow', undefined);

    // Render after resize
    this.render();
  }

  /** Render slides */
  @noopIfDestroyed
  public render(frameDuration = 0) {
    if (this.isEmpty) {
      return;
    }

    const { _swipe: swipe, _track: track, props } = this;

    // Update values
    this._updateSlidesCoords();
    this._updateSlideProgress();

    // Get magnet after slide coordinates are updated
    const { magnet } = this;

    // Active index change
    if (
      magnet &&
      magnet.slide.index !== this._activeIndex &&
      (isUndefined(this.$_targetIndex) ||
        magnet.slide.index === this.$_targetIndex)
    ) {
      this._activeIndex = magnet.slide.index;
      this.$_targetIndex = undefined;
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
    this.slides.forEach((slide) => slide.$_render());

    // Emit Calbacks
    this.callbacks.emit('update', undefined);
  }

  /** Update slides values */
  private _updateSlidesCoords() {
    const { slides, props, containerSize, firstSlideSize } = this;

    const offset = props.centered ? containerSize / 2 - firstSlideSize / 2 : 0;

    slides.forEach((slide) => slide.$_updateCoords(offset));
  }

  /** Update slides progress */
  private _updateSlideProgress() {
    this.slides.forEach((slide) => slide.$_updateProgress());
  }

  /** Get nearest magnet */
  private get magnet(): ISnapMagnet | undefined {
    const current = this._track.loopedCurrent;

    return this.getNearestMagnet(current);
  }

  /** Get nearest magnet to the current position */
  public getNearestMagnet(coord: number): ISnapMagnet | undefined {
    const magnets = this.slides.flatMap((slide) =>
      slide.magnets.map((magnet) => ({ slide, magnet, index: slide.index })),
    );

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
    const { magnet, isSlideScrolling } = this;

    if (isSlideScrolling || !magnet) {
      return;
    }

    this.toCoord(this._track.current + magnet.diff);
  }

  /** Go to a definite coordinate */
  @noopIfDestroyed
  public toCoord(coordinate: number, options?: ISnapTransitionArg) {
    return this._track.toCoord(coordinate, options);
  }

  /** Go to a slide by index */
  public toSlide(
    targetIndex: number,
    { direction = null, ...options }: ISnapToSlideArg = {},
  ) {
    const { isEmpty, activeIndex, slides, _track: track, props } = this;
    const { current, max, loopCount } = track;

    if (isEmpty || this.isDestroyed) {
      return false;
    }

    const index = loop(targetIndex, 0, this.slides.length);

    // Stick if the same slide

    if (index === activeIndex) {
      this.stick();

      return false;
    }

    this.$_targetIndex = index;
    const slideMagnets = slides[index].magnets;
    let targetStaticMagnet = slideMagnets[0];

    if (props.centered) {
      if (direction === 'prev') {
        targetStaticMagnet = slideMagnets[2] ?? slideMagnets[0];
      } else if (direction === 'next') {
        targetStaticMagnet = slideMagnets[1] ?? slideMagnets[0];
      }
    } else {
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
    const { props, slides, activeIndex } = this;
    const { length } = slides;

    let index = loop(activeIndex + skip, 0, length);

    if (!props.loop) {
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
    const { props, slides, activeIndex } = this;

    let index = loop(activeIndex - skip, 0, slides.length);

    if (!props.loop) {
      index = props.rewind
        ? loop(activeIndex - skip, 0, slides.length)
        : Math.max(activeIndex - skip, 0);
    }

    return this.toSlide(index, { ...options, direction: 'prev' });
  }

  /**
   * Destroys the component and clears all timeouts and resources.
   */
  protected _destroy() {
    super._destroy();

    this._resizer.remove();

    this._slides.forEach((slide) => slide.$_detach());
  }
}
