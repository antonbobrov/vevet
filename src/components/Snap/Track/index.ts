import { clamp, inRange, lerp, loop, scoped } from '@/utils/math';
import { Snap } from '..';
import { toPixels } from '@/utils';

export class SnapTrack {
  constructor(protected snap: Snap) {}

  /** The current track value */
  protected _current = 0;

  /** The target track value */
  protected _target = 0;

  /** Gets the current track value. */
  get current() {
    return this._current;
  }

  /** Sets the current track value */
  set current(value: number) {
    this._current = value;
  }

  /** Gets the target track value. */
  get target() {
    return this._target;
  }

  /** Sets the target track value */
  set target(value: number) {
    this._target = value;
  }

  /** Set a value to current & target value instantly */
  public set(value: number) {
    this.current = value;
    this.target = value;
  }

  /** If can loop */
  get canLoop() {
    return this.snap.props.loop && this.snap.slides.length > 1;
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

  /** Loop a coordinate if can loop */
  public loopCoord(coord: number) {
    return this.canLoop ? loop(coord, this.min, this.max) : coord;
  }

  /** Interpolate the current track value */
  public lerp(factor: number) {
    let { target } = this;
    const { snap, min, max } = this;

    // Edge space & resistance

    if (!snap.props.loop) {
      const { domSize, props } = snap;
      const edgeSpace = (1 - props.edgeFriction) * domSize;

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
    const fastThreshold = 5;

    if (rest < fastThreshold) {
      const fastProgress = 1 - rest / fastThreshold;
      const additionalFactor = (1 - factor) / 3;
      factor += additionalFactor * fastProgress;
    }

    this.current = lerp(this.current, target, factor, 0.000001);
  }

  /** Whether the track is interpolated */
  get isInterpolated() {
    return this.current === this.target;
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
  public iterateTarget(delta: number) {
    const { snap } = this;

    this.target += delta;

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    snap._raf.play();
  }

  /** Clamp target value between min and max values */
  public clampTarget() {
    const { snap } = this;

    if (!this.canLoop) {
      this.target = clamp(this.target, this.min, this.max);
    }

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    snap._raf.play();
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
