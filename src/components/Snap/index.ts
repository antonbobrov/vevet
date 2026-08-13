import { Module } from '@/base/Module';
import { TModuleProps } from '@/base/Module/types';
import { noopIfDestroyed, TRequiredProps, isUndefined } from '@/internal';
import { IOnResize, onResize, damp, toPixels, inRange, clamp } from '@/utils';

import { SnapAnimation } from './engine/Animation';
import { ISnapTransitionArg } from './engine/Animation/types';
import { SnapNavigator } from './engine/Navigator';
import { SnapTrack } from './engine/Track';
import { ISnapNexPrevArg, ISnapToSlideArg } from './global';
import { SnapIdle } from './input/Idle';
import { SnapInterval } from './input/Interval';
import { SnapKeyboard } from './input/Keyboard';
import { SnapSwipe } from './input/Swipe';
import { SnapWheel } from './input/Wheel';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { SnapSlide } from './slide';
import { SnapSlides } from './slides';
import {
  ISnapCallbacksMap,
  ISnapMutableProps,
  ISnapStaticProps,
} from './types';

type TC = ISnapCallbacksMap;
type TS = ISnapStaticProps;
type TM = ISnapMutableProps;

/**
 * Low-level carousel handler for slide progress, snapping, and interaction.
 *
 * - Collects slides, computes magnets, and drives transforms via {@link render}
 * - Interpolates track values with {@link Raf}; programmatic moves use {@link Timeline}
 * - Input: swipe, wheel, keyboard scroll lock, and autoplay interval
 * - Does not apply layout or styles — position slides in an `update` callback
 *
 * [Documentation](https://vevetjs.com/docs/Snap)
 *
 * @group Components
 */
export class Snap extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Index of the slide currently aligned to the track magnet. */
  private _activeIndex: number;

  /** Slide collection, reflow, and render orchestration. */
  private _slides: SnapSlides;

  /** Track state: current, target, impulse, min/max, loop. */
  private _track: SnapTrack;

  /** Magnet lookup and programmatic navigation (`next`, `prev`, `toSlide`). */
  private _nav: SnapNavigator;

  /** RAF interpolation and Timeline transitions (`toCoord`). */
  private _animation: SnapAnimation;

  /** Swipe / drag input. */
  private _swipe: SnapSwipe;

  /** Mouse wheel input. */
  private _wheel: SnapWheel;

  /** Idle detection and `idle` callback debounce. */
  private _idle: SnapIdle;

  /** Cached container size when `containerSize` is `'auto'`. */
  private _containerSize = 0;

  /** Slides larger than the container (inner scroll within a slide). */
  private _scrollableSlides: SnapSlide[] = [];

  /** Container resize observer. */
  private _resizer: IOnResize;

  constructor(props: TModuleProps<TC, TS, TM, Snap>) {
    super(props);

    const { container, activeIndex } = this.props;

    this._activeIndex = activeIndex;

    this._slides = new SnapSlides();

    this._resizer = onResize({
      element: container,
      viewportTarget: 'width',
      callback: this._handleResize.bind(this),
      name: this.name,
    });

    this._track = new SnapTrack(this);

    this._slides.collect(this);

    this._nav = new SnapNavigator(this);

    this._animation = new SnapAnimation(this, {
      onRender: this.render.bind(this),
      getCurrent: () => this._track.current,
      setCurrent: (val) => (this._track.current = val),
      getTarget: () => this._track.target,
      setTarget: (val) => (this._track.target = val),
      getImpulse: () => this._track.impulseRef,
      onTmReset: () => this._nav.resetTargetIndex(),
    });

    this._wheel = new SnapWheel(this);
    this._swipe = new SnapSwipe(this);
    this._idle = new SnapIdle(this);

    new SnapKeyboard(this);
    new SnapInterval(this);

    this._resizer.debounceResize();
  }

  protected _handleProps(diff: Partial<TM>) {
    if ('slides' in diff) {
      this._slides.collect(this);
    }

    this._resizer.resize();
    super._handleProps(diff);
  }

  get container() {
    return this.props.container;
  }

  get eventsEmitter() {
    return this.props.eventsEmitter ?? this.container;
  }

  get containerSize() {
    const { containerSize } = this.props;

    if (containerSize === 'auto') {
      return this._containerSize;
    }

    return toPixels(containerSize);
  }

  /**
   * @deprecated
   */
  get domSize() {
    return this.containerSize;
  }

  get slides() {
    return this._slides.all;
  }

  get firstSlide() {
    return this._slides.getFirstSlide();
  }

  get lastSlide() {
    return this._slides.getLastSlide();
  }

  /** Slides larger than the container (supports inner scroll within a slide). */
  get scrollableSlides() {
    return this._scrollableSlides;
  }

  get activeIndex() {
    return this._activeIndex;
  }

  get activeSlide() {
    return this._slides.at(this._activeIndex);
  }

  get isEmpty() {
    return this._slides.isEmpty;
  }

  get axis() {
    return this.props.direction === 'horizontal' ? 'x' : 'y';
  }

  /** @internal */
  get $_track() {
    return this._track;
  }

  /** @internal */
  get $_animation() {
    return this._animation;
  }

  get isTransitioning() {
    return this._animation.transitioning;
  }

  get isSwiping() {
    return this._swipe.isSwiping;
  }

  get isWheeling() {
    return this._wheel.isWheeling;
  }

  /**
   * @deprecated
   */
  get hasInteria() {
    return this._swipe.hasInertia;
  }

  get hasInertia() {
    return this._swipe.hasInertia;
  }

  get isInterpolating() {
    return this._animation.interpolating;
  }

  /** @deprecated */
  get influence() {
    return this._track.impulse;
  }

  get impulse() {
    return this._track.impulse;
  }

  get current() {
    return this._track.current;
  }

  get target() {
    return this._track.target;
  }

  get canLoop() {
    return this._track.canLoop;
  }

  get loopedCurrent() {
    return this._track.loopedCurrent;
  }

  get loopCount() {
    return this._track.loopCount;
  }

  get min() {
    return this._track.min;
  }

  get max() {
    return this._track.max;
  }

  /** `0…1` when not looping; unbounded when `loop` is enabled. */
  get progress() {
    return this._track.progress;
  }

  get isStart() {
    return this._track.isStart;
  }

  get isEnd() {
    return this._track.isEnd;
  }

  get origin() {
    if (this.props.centered) {
      return 'center';
    }

    return this.props.origin;
  }

  public set(value: number) {
    this._track.set(value);
  }

  public loopCoord(coord: number) {
    return this._track.loopCoord(coord);
  }

  public clampTarget() {
    if (!this.canLoop) {
      this._track.target = clamp(this.target, this.min, this.max);
    }

    this._animation.awake();
  }

  public iterateTarget(delta: number) {
    this.setTarget(this._track.target + delta);
  }

  public setTarget(value: number) {
    this._track.target = value;
    this._animation.awake();
  }

  public cancelTransition() {
    this._animation.cancelTransition();
  }

  /** True when an oversized active slide is scrolled inside the container. */
  get isSlideScrolling() {
    const { containerSize } = this;

    return this.scrollableSlides.some(({ size, coord }) =>
      inRange(coord, containerSize - size, 0),
    );
  }

  get firstSlideSize() {
    return this._slides.getFirstSlide().size;
  }

  /** Not swiping, wheeling, interpolating, or transitioning. */
  get isIdle() {
    return this._idle.isIdle;
  }

  @noopIfDestroyed
  public resize(isManual = true) {
    if (isManual) {
      this._resizer.resize();
    } else {
      this._resizer.debounceResize();
    }
  }

  private _handleResize() {
    const { container } = this.props;

    if (this.props.stickOnResize) {
      this._animation.cancelTransition();
    }

    this._containerSize =
      this.axis === 'x' ? container.offsetWidth : container.offsetHeight;

    this._reflow();

    this._emit('resize', undefined);
  }

  private _reflow() {
    const { props, containerSize } = this;
    const track = this._track;

    this._slides.reflow(toPixels(props.gap));

    this._scrollableSlides = this.slides.filter(
      (slide) => slide.size > containerSize,
    );

    const activeSlide = this._slides.at(this.activeIndex);
    if (props.stickOnResize && activeSlide) {
      this.clampTarget();
      track.set(activeSlide.magnets[0]);
    }

    this._emit('reflow', undefined);

    this.render();
  }

  @noopIfDestroyed
  public render(frameDuration = 0) {
    const { _swipe: swipe, props } = this;
    const track = this._track;

    this.slides.forEach((slide) =>
      slide.$_update(this._track.current, this._track.offset),
    );

    const { magnet } = this._nav;

    // Emit activeSlide when the nearest magnet changes (respects programmatic targetIndex)
    if (
      magnet &&
      magnet.slide.index !== this._activeIndex &&
      (isUndefined(this._nav.targetIndex) ||
        magnet.slide.index === this._nav.targetIndex)
    ) {
      this._activeIndex = magnet.slide.index;
      this._nav.resetTargetIndex();
      this._emit('activeSlide', this.activeSlide);
    }

    const hasFriction =
      (swipe.isSwiping && swipe.allowFriction) || !swipe.isSwiping;

    // Pull target toward the nearest magnet while swiping (unless freemode / oversized slide)
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

    this._slides.render();

    this._emit('update', undefined);
  }

  public getNearestMagnet(coord: number) {
    return this._nav.getNearestMagnet(coord);
  }

  public stick() {
    return this._nav.stick();
  }

  @noopIfDestroyed
  public toCoord(coordinate: number, options?: ISnapTransitionArg) {
    return this._animation.toCoord(coordinate, options);
  }

  public toSlide(targetIndex: number, data?: ISnapToSlideArg) {
    return this._nav.toSlide(targetIndex, data);
  }

  public next(data?: ISnapNexPrevArg) {
    return this._nav.next(data);
  }

  public prev(data?: ISnapNexPrevArg) {
    return this._nav.prev(data);
  }

  /**
   * Releases resize observers, animation loop, slides (parallax, slide resize),
   * and input handlers (swipe, wheel, interval, keyboard).
   */
  protected _destroy() {
    super._destroy();

    this._resizer.remove();
    this._animation.destroy();
    this._slides.detachAll();
  }
}
