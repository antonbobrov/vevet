import { Module } from '@/base';
import { Timeline } from '../Timeline';
import {
  ISnapCallbacksMap,
  ISnapMagnet,
  ISnapMutableProps,
  ISnapStaticProps,
} from './types';
import { TRequiredProps } from '@/internal/requiredProps';
import { Raf } from '../Raf';
import {
  IOnResize,
  onResize,
  scoped,
  loop,
  clamp,
  EaseOutCubic,
  damp,
  lerp,
  toPixels,
} from '@/utils';
import { SnapSlide } from './Slide';
import { SnapWheel } from './Wheel';
import { SnapSwipe } from './Swipe';
import { SnapTrack } from './Track';
import { SnapKeyboard } from './Keyboard';
import { initVevet } from '@/global/initVevet';

export * from './types';
export * from './Slide';

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
export class Snap<
  CallbacksMap extends ISnapCallbacksMap = ISnapCallbacksMap,
  StaticProps extends ISnapStaticProps = ISnapStaticProps,
  MutableProps extends ISnapMutableProps = ISnapMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /** Retrieves the default static properties. */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      activeIndex: 0,
    } as TRequiredProps<StaticProps>;
  }

  /** Retrieves the default mutable properties. */
  public _getMutable(): TRequiredProps<MutableProps> {
    return {
      ...super._getMutable(),
      slides: false,
      direction: 'horizontal',
      centered: false,
      loop: false,
      gap: 0,
      lerp: 0.2,
      freemode: false,
      stickOnResize: true,
      friction: 0.15,
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
      swipeLerp: initVevet().mobile ? 1 : 0.6,
      swipeThreshold: 5,
      swipeMinTime: 0,
      wheel: false,
      wheelSpeed: 1,
      wheelAxis: 'auto',
      followWheel: true,
    } as TRequiredProps<MutableProps>;
  }

  /** Animation frame for smooth animations */
  protected _raf: Raf;

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

  constructor(props?: StaticProps & MutableProps) {
    super(props);

    const { container, activeIndex } = this.props;

    // set vars
    this._activeIndex = activeIndex;

    // add resize event
    this._resizeHandler = onResize({
      element: container,
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
      slide.setStaticCoord(prev);

      if (slide.size > this.domSize) {
        this._scrollableSlides.push(slide);
      }

      return prev + slide.size + toPixels(props.gap);
    }, 0);

    // Reset to active slide
    const slide = slides.find(({ index }) => index === this.activeIndex);
    if (props.stickOnResize && slide) {
      this._track.clampTarget();
      this._track.set(slide.staticCoord);
    }

    // Emit callbacks
    this.callbacks.emit('reflow', undefined);

    // Render after resize
    this._render();
  }

  /** Handle RAF update, interpolate track values */
  protected _handleRaf() {
    if (this.isTransitioning) {
      return;
    }

    const { _track: track, props, _swipe: swipe } = this;

    // Get lerp factor
    const lerpFactor =
      swipe.isSwiping && props.swipeLerp ? props.swipeLerp : props.lerp;

    // Interpolate track value
    track.lerp(this._raf.lerpFactor(lerpFactor));

    // Stop raf if target reached
    if (track.isInterpolated) {
      this._raf.pause();
    }

    // Render the scene
    this._render(this._raf.duration);
  }

  /** Render slides logic */
  protected _render(frameDuration = 0) {
    if (this.isEmpty) {
      return;
    }

    const { _track: track, props } = this;

    // Update values
    this._updateSlidesCoords();
    this._updateSlidesProgress();

    // Get magnet after slide coordinates are updated
    const { magnet, _swipe: swipe } = this;

    if (!magnet) {
      return;
    }

    // Active index change
    if (magnet.slide.index !== this._activeIndex) {
      this._activeIndex = magnet.slide.index;
      this.callbacks.emit('activeSlide', this.activeSlide);
    }

    // Check if friction is allowed
    const canHaveFriction =
      (swipe.isSwiping && swipe.allowFriction) || !swipe.isSwiping;

    // Apply friction
    if (
      !track.isSlideScrolling &&
      !props.freemode &&
      canHaveFriction &&
      frameDuration > 0 &&
      props.friction >= 0
    ) {
      track.target = damp(
        track.target,
        track.current + magnet.magnetDiff,
        props.friction * props.lerp,
        frameDuration,
        0.000001,
      );
    }

    // Render slides
    this.slides.forEach((slide) => slide.render());

    // Emit Calbacks
    this.callbacks.emit('update', undefined);
  }

  /** Update slides values */
  protected _updateSlidesCoords() {
    const { slides, domSize, _track: track } = this;
    const { centered: isCentered } = this.props;

    slides.forEach((slide) => {
      const { staticCoord, size } = slide;
      const offset = isCentered ? domSize / 2 - slides[0].size / 2 : 0;

      if (!track.canLoop) {
        slide.setCoord(staticCoord + offset - track.current);

        return;
      }

      if (isCentered) {
        slide.setCoord(
          loop(
            staticCoord + offset - track.current,
            -track.max / 2 + offset,
            track.max / 2 + offset,
          ),
        );

        return;
      }

      slide.setCoord(
        loop(staticCoord - track.current, -size, track.max - size),
      );
    });
  }

  /** Update slides progress */
  protected _updateSlidesProgress() {
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

  /** Get slide magnets */
  protected get magnets(): ISnapMagnet[] {
    const { domSize, props, track } = this;

    const threshold = props.centered ? domSize / 2 : 0;

    const slideMagnets = this.slides.map((slide) => {
      const firstPoint = props.centered
        ? slide.coord + slide.size / 2
        : slide.coord;

      const points: number[] = [firstPoint];

      if (slide.size > domSize) {
        if (props.centered) {
          points.push(firstPoint + (domSize - slide.size) / 2);
          points.push(firstPoint - (domSize - slide.size) / 2);
        } else {
          points.push(firstPoint + slide.size - domSize);
        }
      }

      return points.map<ISnapMagnet>((point) => ({
        slide,
        magnetCoord: point,
        magnetDiff: point - threshold,
        staticMagnetCoord: point + this._track.current,
      }));
    });

    const flatMagnets = slideMagnets.flat();

    if (!track.canLoop && !props.centered) {
      flatMagnets.forEach((magnet) => {
        const oldStaticMagnetCoord = magnet.staticMagnetCoord;

        const newStaticMagnetCoord = clamp(
          magnet.staticMagnetCoord,
          0,
          this._track.max,
        );

        const diff = oldStaticMagnetCoord - newStaticMagnetCoord;

        magnet.staticMagnetCoord = newStaticMagnetCoord;
        magnet.magnetCoord -= diff;
        magnet.magnetDiff -= diff;
      });
    }

    return flatMagnets;
  }

  /** Get nearest magnet */
  protected get magnet(): ISnapMagnet | undefined {
    if (this.isEmpty) {
      return undefined;
    }

    const magnets = this.magnets.sort(
      (a, b) => Math.abs(a.magnetDiff) - Math.abs(b.magnetDiff),
    );

    return magnets[0];
  }

  /** Cancel sticky behavior */
  public cancelTransition() {
    this._timeline?.destroy();
    this._timeline = undefined;
  }

  /** Stick to the nearest magnet */
  public stick() {
    const { magnet } = this;
    if (this.track.isSlideScrolling || !magnet) {
      return;
    }

    this.toCoord(this._track.current + magnet.magnetDiff);
  }

  /** Go to a definite coordinate */
  public toCoord(coordinate: number, duration = this.props.duration) {
    if (this.isEmpty) {
      return;
    }

    this.cancelTransition();

    const start = this._track.current;
    const end = coordinate;
    const diff = Math.abs(end - start);

    const tm = new Timeline({
      duration: typeof duration === 'number' ? duration : duration(diff),
      easing: this.props.easing,
    });

    this._timeline = tm;

    tm.on('start', () => this.callbacks.emit('timelineStart', undefined));

    tm.on('update', (data) => {
      this._track.current = lerp(start, end, data.eased);
      this._track.target = this._track.current;

      this._render();
      this.callbacks.emit('timelineUpdate', data);
    });

    tm.on('end', () => {
      tm.destroy();
      this.callbacks.emit('timelineEnd', undefined);
      this._timeline = undefined;
    });

    tm.play();
  }

  /** Go to a slide by index */
  public toSlide(index: number, duration = this.props.duration) {
    if (index === this.activeIndex) {
      this.stick();

      return;
    }

    const magnet = this.magnets.find((data) => data.slide.index === index);

    if (!magnet) {
      return;
    }

    this.toCoord(this._track.current + magnet.magnetDiff, duration);
  }

  /** Go to next slide */
  public next(duration = this.props.duration) {
    const { props, slides, activeIndex } = this;

    const index = props.loop
      ? loop(activeIndex + 1, 0, slides.length)
      : Math.min(activeIndex + 1, slides.length - 1);

    this.toSlide(index, duration);
  }

  /** Go to previous slide */
  public prev(duration = this.props.duration) {
    const { props, slides, activeIndex } = this;

    const index = props.loop
      ? loop(activeIndex - 1, 0, slides.length)
      : Math.max(activeIndex - 1, 0);

    this.toSlide(index, duration);
  }

  /**
   * Destroys the component and clears all timeouts and resources.
   */
  protected _destroy() {
    super._destroy();

    this._resizeHandler.remove();

    this.cancelTransition();

    this._raf.destroy();

    this._slides.forEach((slide) => slide.detach());
  }
}
