import { clamp, inRange, lerp, loop, scoped } from '@/utils/math';
import { toPixels } from '@/utils';
import { SnapLogic } from '../SnapLogic';
import { Snap } from '../..';
import { Raf } from '@/components/Raf';

export class SnapTrack extends SnapLogic {
  constructor(snap: Snap) {
    super(snap);

    // Create the animation frame
    this._raf = new Raf();
    this._raf.on('frame', () => this._handleRaf());
    this._raf.on('play', () => snap.callbacks.emit('rafPlay', undefined));
    this._raf.on('pause', () => snap.callbacks.emit('rafPause', undefined));

    // Destroy raf
    this.addDestructor(() => this._raf.destroy());
  }

  /** The animation frame */
  protected _raf: Raf;

  /** Interpolation influence */
  protected _influence = {
    current: 0,
    target: 0,
  };

  /** Gets the interpolation influence */
  get influence() {
    return this._influence.current;
  }

  /** Sets the interpolation influence */
  set $_influence(value: number) {
    this._influence.current = value;
    this._influence.target = value;
  }

  /** The current track value */
  protected _current = 0;

  /** The target track value */
  protected _target = 0;

  /** Gets the current track value. */
  get current() {
    return this._current;
  }

  /** Sets the current track value */
  set $_current(value: number) {
    this._current = value;
  }

  /** Gets the target track value. */
  get target() {
    return this._target;
  }

  /** Sets the target track value */
  set $_target(value: number) {
    const { domSize } = this.snap;
    const diff = value - this._target;

    this._target = value;

    this._influence.target += domSize ? diff / domSize : 0;
    this._influence.target = clamp(this._influence.target, -0.2, 0.2);
  }

  /** Set a value to current & target value instantly */
  public set(value: number) {
    this.$_current = value;
    this.$_target = value;
    this._influence.current = 0;
    this._influence.target = 0;
  }

  /** If can loop */
  get canLoop() {
    const { snap } = this;

    return snap.props.loop && snap.slides.length > 1;
  }

  /** Get looped current value */
  get loopedCurrent() {
    return this.loopCoord(this.current);
  }

  /** Get track offset */
  get offset() {
    const { snap } = this;

    return snap.props.centered ? snap.domSize / 2 - snap.firstSlideSize / 2 : 0;
  }

  /** Get loop count */
  get loopCount() {
    return Math.floor(this.current / this.max);
  }

  /** Handle RAF update, interpolate track values */
  protected _handleRaf() {
    const { snap } = this;

    if (snap.isTransitioning) {
      return;
    }

    // Interpolate track value
    this.$_lerp(this._raf.lerpFactor(snap.props.lerp));

    // Stop raf if target reached
    if (this.isInterpolated) {
      this._raf.pause();
    }

    // Render the scene
    snap.render(this._raf.duration);
  }

  /** Loop a coordinate if can loop */
  public loopCoord(coord: number) {
    return this.canLoop ? loop(coord, this.min, this.max) : coord;
  }

  /** Interpolate the current track value */
  public $_lerp(initialFactor: number) {
    const { snap, min, max } = this;
    let { target } = this;

    let lerpFactor = initialFactor;
    const influence = this._influence;

    // Edge space & resistance

    if (!snap.props.loop) {
      const { domSize } = snap;
      const edgeSpace = (1 - snap.props.edgeFriction) * domSize;

      if (target < min) {
        const edgeProgress = 1 - scoped(target, -domSize, min);
        target = min - edgeProgress * edgeSpace;
      } else if (target > max) {
        const edgeProgress = scoped(target, max, max + domSize);
        target = max + edgeProgress * edgeSpace;
      }

      target = clamp(target, min - edgeSpace, max + edgeSpace);
    }

    // Interpolate current value

    const rest = Math.abs(this.current - target);
    const fastThreshold = 3;

    if (rest < fastThreshold) {
      const fastProgress = 1 - rest / fastThreshold;
      const additionalFactor = (1 - lerpFactor) / 15;
      lerpFactor += additionalFactor * fastProgress;
    }

    this.$_current = lerp(this.current, target, lerpFactor, 0.000001);

    // Interpolate influence

    influence.target = lerp(influence.target, 0, initialFactor, 0.000001);

    influence.current = lerp(
      influence.current,
      influence.target,
      lerpFactor,
      0.000001,
    );
  }

  /** Whether the track is interpolated */
  protected get isInterpolated() {
    return this.current === this.target && this._influence.current === 0;
  }

  /** Get minimum track value */
  get min() {
    const { snap } = this;

    if (this.canLoop || snap.isEmpty) {
      return 0;
    }

    if (snap.props.centered) {
      const firstSlide = snap.slides[0];

      if (firstSlide.size > snap.domSize) {
        return snap.domSize / 2 - firstSlide.size / 2;
      }
    }

    return 0;
  }

  /** Get maximum track value */
  get max() {
    const { domSize, slides, isEmpty, props } = this.snap;
    const { canLoop } = this;

    if (isEmpty) {
      return 0;
    }

    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];
    const lastCoordWithSlide = lastSlide.staticCoord + lastSlide.size;

    let max = canLoop
      ? lastCoordWithSlide + toPixels(props.gap)
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
  }

  /** Get track progress. From 0 to 1 if not loop. From -Infinity to Infinity if loop */
  get progress() {
    return this.current / this.max;
  }

  /** Iterate track target value */
  public $_iterateTarget(delta: number) {
    this.$_target = this.target + delta;

    this._raf.play();
  }

  /** Clamp target value between min and max values */
  public clampTarget() {
    if (!this.canLoop) {
      this.$_target = clamp(this.target, this.min, this.max);
    }

    this._raf.play();
  }

  /** If the start has been reached */
  get isStart() {
    if (this.snap.props.loop) {
      return false;
    }

    return Math.floor(this.target) <= Math.floor(this.min);
  }

  /** If the end has been reached */
  get isEnd() {
    if (this.snap.props.loop) {
      return false;
    }

    return Math.floor(this.target) >= Math.floor(this.max);
  }

  /** Check if the active slide is larger than the container and is being scrolled */
  get isSlideScrolling() {
    const { snap } = this;
    const { domSize } = snap;

    return snap.scrollableSlides.some(({ size, coord }) =>
      inRange(coord, domSize - size, 0),
    );
  }
}
