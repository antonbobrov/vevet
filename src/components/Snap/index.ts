import { Module, TModuleOnCallbacksProps } from '@/base';
import { Timeline } from '../Timeline';
import {
  ISnapCallbacksMap,
  ISnapMagnet,
  ISnapMutableProps,
  ISnapNexPrevArg,
  ISnapStaticProps,
  ISnapToSlideArg,
  ISnapTransitionArg,
} from './types';
import { TRequiredProps } from '@/internal/requiredProps';
import {
  IOnResize,
  onResize,
  scoped,
  loop,
  EaseOutCubic,
  damp,
  lerp,
  toPixels,
  closest,
  clamp,
} from '@/utils';
import { SnapSlide } from './slide/Slide';
import { SnapWheel } from './logic/Wheel';
import { SnapSwipe } from './logic/Swipe';
import { SnapTrack } from './logic/Track';
import { SnapKeyboard } from './logic/Keyboard';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { isUndefined } from '@/internal/isUndefined';
import { isNumber } from '@/internal/isNumber';
import { isString } from '@/internal/isString';
import { initVevet } from '@/global/initVevet';

export * from './types';
export * from './slide/Slide';

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
export class Snap<
  C extends ISnapCallbacksMap = ISnapCallbacksMap,
  S extends ISnapStaticProps = ISnapStaticProps,
  M extends ISnapMutableProps = ISnapMutableProps,
> extends Module<C, S, M> {
  /** Retrieves the default static properties. */
  public _getStatic(): TRequiredProps<S> {
    return {
      ...super._getStatic(),
      eventsEmitter: null,
      activeIndex: 0,
    } as TRequiredProps<S>;
  }

  /** Retrieves the default mutable properties. */
  public _getMutable(): TRequiredProps<M> {
    return {
      ...super._getMutable(),
      slides: false,
      slidesToScroll: 1,
      direction: 'horizontal',
      centered: false,
      loop: false,
      gap: 0,
      lerp: initVevet().mobile ? 1 : 0.2,
      freemode: false,
      rewind: false,
      stickOnResize: true,
      friction: 0,
      edgeFriction: 0.85,
      duration: 500,
      easing: EaseOutCubic,
      swipe: true,
      grabCursor: false,
      swipeSpeed: 1,
      swipeAxis: 'auto',
      followSwipe: true,
      shortSwipes: true,
      shortSwipesDuration: 300,
      shortSwipesThreshold: 30,
      swipeFriction: false,
      swipeThreshold: 5,
      swipeMinTime: 0,
      swipeInertiaDuration: (distance) => clamp(distance, 500, 2000),
      swipeInertiaRatio: 0.5,
      wheel: false,
      wheelSpeed: 1,
      wheelAxis: 'auto',
      followWheel: true,
      wheelThrottle: 'auto',
      stickOnWheelEnd: true,
      stickOnWheelEndThreshold: 30,
      slideSize: 'auto',
    } as TRequiredProps<M>;
  }

  /** Wheel events */
  protected _wheel: SnapWheel;

  /** Swipe events */
  protected _swipe: SnapSwipe;

  /** Snap Track */
  protected _track: SnapTrack;

  /** Snap keyboard */
  protected _keyboard: SnapKeyboard;

  /** Container size */
  protected _domSize = 0;

  /** All slides */
  protected _slides: SnapSlide[] = [];

  /** Scrollable slides (which size is larger than the container) */
  protected _scrollableSlides: SnapSlide[] = [];

  /** Timeline for smooth transitions */
  protected _timeline?: Timeline;

  /** Resize handler */
  protected _resizeHandler: IOnResize;

  /** Active slide index */
  protected _activeIndex: number;

  /** Target slide index */
  protected _targetIndex?: number;

  constructor(
    props?: S & M,
    onCallbacks?: TModuleOnCallbacksProps<C, Snap<C, S, M>>,
  ) {
    super(props, onCallbacks as any);

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

    // fetch slides
    this._fetchSlides();

    // add wheel listener
    this._wheel = new SnapWheel(this as any);

    // add swipe
    this._swipe = new SnapSwipe(this as any);

    // add track
    this._track = new SnapTrack(this as any);

    // add keyboard
    this._keyboard = new SnapKeyboard(this as any);
  }

  /** Handles properties change */
  protected _handleProps() {
    // attach slides
    this._fetchSlides();

    // resize instantly
    this._resizeHandler.resize();

    // update props
    super._handleProps();
  }

  /** Update slides list and attach them */
  protected _fetchSlides() {
    this._slides.forEach((slide) => slide.detach());

    const children = this.props.slides
      ? this.props.slides
      : Array.from(this.props.container.children);

    this._slides = children.map((item) => {
      if (item instanceof SnapSlide) {
        return item;
      }

      return new SnapSlide(item as any);
    });

    this._slides.forEach((slide, index) => slide.attach(this as any, index));
  }

  /** Request resize (handled with debounce timeout) */
  @noopIfDestroyed
  public resize(isManual = false) {
    if (isManual) {
      this._resizeHandler.resize();
    } else {
      this._resizeHandler.debounceResize();
    }
  }

  /** Resize the scene and reflow */
  protected _handleResize() {
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
    return this.props.eventsEmitter ?? this.container;
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
  protected _reflow() {
    const { slides, props } = this;

    if (slides.length === 0) {
      return;
    }

    // Reset scrollable slides
    this._scrollableSlides = [];

    // Calculate static values
    slides.reduce((prev, slide) => {
      slide.$_setStaticCoord(prev);

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

  /** Render slides */
  @noopIfDestroyed
  public render(frameDuration = 0) {
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
    if (
      magnet &&
      magnet.slide.index !== this._activeIndex &&
      (isUndefined(this._targetIndex) ||
        magnet.slide.index === this._targetIndex)
    ) {
      this._activeIndex = magnet.slide.index;
      this._targetIndex = undefined;
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
      !track.isSlideScrolling &&
      !props.freemode
    ) {
      track.$_target = damp(
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
  protected _updateSlidesCoords() {
    const { slides, track } = this;
    const { centered: isCentered } = this.props;

    const offset = isCentered ? this._domSize / 2 - this.firstSlideSize / 2 : 0;

    slides.forEach((slide) => {
      const { staticCoord, size } = slide;

      if (!track.canLoop) {
        slide.$_setCoord(staticCoord + offset - track.current);

        return;
      }

      if (isCentered) {
        slide.$_setCoord(
          loop(
            staticCoord + offset - track.current,
            -track.max / 2 + offset,
            track.max / 2 + offset,
          ),
        );

        return;
      }

      slide.$_setCoord(
        loop(staticCoord - track.current, -size, track.max - size),
      );
    });
  }

  /** Get first slide size */
  get firstSlideSize() {
    return this.slides[0].size;
  }

  /** Update slides progress */
  protected _updateSlidesProgress() {
    const { slides, domSize } = this;

    slides.forEach((slide) => {
      const { coord, size } = slide;

      if (this.props.centered) {
        const center = domSize / 2 - size / 2;
        slide.$_setProgress(scoped(coord, center, center - size));

        return;
      }

      slide.$_setProgress(scoped(coord, 0, -size));
    });
  }

  /** Get nearest magnet */
  protected get magnet(): ISnapMagnet | undefined {
    const current = this.track.loopedCurrent;

    return this.getNearestMagnet(current);
  }

  /** Get nearest magnet to the current position */
  public getNearestMagnet(coord: number): ISnapMagnet | undefined {
    // todo: search only in nearby slides

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

  /** Cancel sticky behavior */
  public cancelTransition() {
    this._timeline?.destroy();
    this._timeline = undefined;
  }

  /** Stick to the nearest magnet */
  @noopIfDestroyed
  public stick() {
    const { magnet } = this;

    if (this.track.isSlideScrolling || !magnet) {
      return;
    }

    this.toCoord(this.track.current + magnet.diff);
  }

  /** Go to a definite coordinate */
  public toCoord(coordinate: number, options?: ISnapTransitionArg) {
    if (this.isEmpty || this.isDestroyed) {
      return false;
    }

    this.cancelTransition();

    const { track, props, callbacks } = this;

    const start = track.current;
    const end = coordinate;
    const diff = Math.abs(end - start);

    const durationProp = options?.duration ?? props.duration;

    let duration = isNumber(durationProp) ? durationProp : durationProp(diff);
    if (diff === 0) {
      duration = 0;
    }

    const easing = options?.easing ?? props.easing;

    const tm = new Timeline({ duration, easing });

    this._timeline = tm;

    tm.on('start', () => {
      callbacks.emit('timelineStart', undefined);
      options?.onStart?.();
    });

    tm.on('update', (data) => {
      track.$_current = lerp(start, end, data.eased);
      track.$_target = track.current;
      track.$_influence = track.influence * (1 - data.progress);

      if (data.progress === 1) {
        this._targetIndex = undefined;
      }

      this.render();

      callbacks.emit('timelineUpdate', data);
      options?.onUpdate?.(data);
    });

    tm.on('end', () => {
      tm.destroy();

      callbacks.emit('timelineEnd', undefined);
      options?.onEnd?.();

      this._timeline = undefined;
    });

    tm.on('destroy', () => {
      this._targetIndex = undefined;
    });

    tm.play();

    return true;
  }

  /** Go to a slide by index */
  public toSlide(
    targetIndex: number,
    { direction = null, ...options }: ISnapToSlideArg = {},
  ) {
    const { isEmpty, activeIndex, slides, track, props } = this;
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

    this._targetIndex = index;
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

    let index = loop(activeIndex + skip, 0, slides.length);

    if (!props.loop) {
      index = props.rewind
        ? loop(activeIndex + skip, 0, slides.length)
        : Math.min(activeIndex + skip, slides.length - 1);
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

    this._resizeHandler.remove();

    this.cancelTransition();

    this._slides.forEach((slide) => slide.detach());
  }
}
