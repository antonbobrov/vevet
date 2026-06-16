import { initVevet } from '@/global/initVevet';
import { isNumber } from '@/internal/isNumber';
import { onlyFinite } from '@/internal/onlyFinite';
import { addEventListener, clamp, normalizeWheel } from '@/utils';

import { SnapLogic } from '..';
import { Snap } from '../..';

const deltasCount = 6;

export class SnapWheel extends SnapLogic {
  /** Detects if wheel event is started */
  private _hasStarted = false;

  /** Debounce wheel end event */
  private _debounceEnd?: NodeJS.Timeout;

  /** Deltas history */
  private _deltas: number[] = [];

  /** Last time wheel event was fired */
  private _lastWheelTime = 0;

  constructor(ctx: Snap) {
    super(ctx);

    const listener = addEventListener(this.eventsEmitter, 'wheel', (event) =>
      this._handleWheel(event),
    );

    this.addDestructor(() => {
      listener();

      if (this._debounceEnd) {
        clearTimeout(this._debounceEnd);
      }
    });
  }

  get isWheeling() {
    return this._hasStarted;
  }

  /** Get absolute deltas */
  private get absDeltas() {
    return this._deltas.map((d) => Math.abs(d));
  }

  /**
   * Handles wheel events
   */
  private _handleWheel(event: WheelEvent) {
    const { props, snapAxis } = this;

    if (!props.wheel) {
      return;
    }

    event.preventDefault();

    // Get delta
    const wheelData = normalizeWheel(event);
    const wheelAxis = props.wheelAxis === 'auto' ? snapAxis : props.wheelAxis;
    const delta = wheelAxis === 'x' ? wheelData.pixelX : wheelData.pixelY;

    // Start
    this._handleStart(delta);

    // Start
    this._handleMove(delta, event);

    // Debounce End
    if (this._debounceEnd) {
      clearTimeout(this._debounceEnd);
    }

    // End callback
    this._debounceEnd = setTimeout(() => this._handleEnd(), 200);
  }

  /** Handle wheel start */
  private _handleStart(delta: number) {
    if (this._hasStarted || Math.abs(delta) < 2) {
      return;
    }

    this._hasStarted = true;

    this.callbacks.emit('wheelStart', undefined);
  }

  /** Handle wheel move */
  private _handleMove(delta: number, event: WheelEvent) {
    if (!this._hasStarted) {
      return;
    }

    // Save delta
    this._addDelta(delta);

    // Handle wheel logic
    if (this.props.followWheel) {
      this._handleFollow(delta);
    } else {
      this._handleNoFollow(delta);
    }

    // Move callback
    this.callbacks.emit('wheel', event);
  }

  /** Handle `followWheel=true` */
  private _handleFollow(delta: number) {
    const { track, props } = this;

    // Cancel snap transition
    track.cancelTransition();

    // Update track target
    track.updateTarget(track.target + delta * props.wheelSpeed);
    track.clampTarget();
  }

  /** Handle `followWheel=false` */
  private _handleNoFollow(deltaProp: number) {
    const { track, isTouchPad, isGainingDelta, props, activeSlide, canLoop } =
      this;
    const delta = deltaProp * props.wheelSpeed;

    // Detect wheel throttling
    if (this._detectNoFollowThrottle()) {
      return;
    }

    // Detect if need to throttle or follow

    let shouldFollow = false;
    let isThrottled = true;

    if (!shouldFollow) {
      if (this.isSlideScrolling) {
        if (activeSlide.coord === 0) {
          if (delta > 0) {
            shouldFollow = true;
          }
        } else if (
          activeSlide.coord ===
          this.containerSize - activeSlide.size
        ) {
          if (delta < 0) {
            shouldFollow = true;
          }
        } else {
          shouldFollow = true;
          isThrottled = false;
        }
      }
    }

    // Throttle

    if (isThrottled) {
      if (
        !isTouchPad ||
        (isTouchPad && (isGainingDelta || this.absDeltas.length === 1))
      ) {
        const direction = Math.sign(delta);

        if (shouldFollow) {
          track.cancelTransition();

          track.updateTarget(track.target + direction);
          track.clampTarget();

          if (!isTouchPad) {
            track.current = track.target;
          }
        } else if (direction === 1) {
          if (!canLoop && this.activeIndex === this.slides.length - 1) {
            if (!props.rewind) {
              return;
            }
          }

          this._lastWheelTime = +new Date();

          this.next();
        } else {
          if (!canLoop && this.activeIndex === 0) {
            if (!props.rewind) {
              return;
            }
          }

          this._lastWheelTime = +new Date();

          this.prev();
        }
      }

      return;
    }

    // Follow wheel

    if (shouldFollow) {
      track.cancelTransition();

      const deltaWithSpeed = delta;

      const start = Math.min(...activeSlide.magnets);
      const end = Math.max(...activeSlide.magnets);

      const loopedTarget = track.loopCoord(track.target);

      const clampedLoopedTarget = clamp(
        loopedTarget + deltaWithSpeed,
        start,
        end,
      );

      track.target = track.target + clampedLoopedTarget - loopedTarget;
      track.clampTarget();
    }
  }

  /** Detect if wheel should be throttled */
  private _detectNoFollowThrottle() {
    const { isTouchPad, scrollableSlides, isTransitioning } = this;
    const { wheelThrottle } = this.props;

    const timeDiff = +new Date() - this._lastWheelTime;

    // NUMBER

    if (isNumber(wheelThrottle)) {
      return timeDiff < wheelThrottle;
    }

    // AUTO

    if (isTouchPad) {
      return isTransitioning;
    }

    const visibleScrollableSlides = scrollableSlides.filter(
      (slide) => slide.isVisible,
    );

    if (visibleScrollableSlides.length && isTransitioning) {
      return true;
    }

    if (timeDiff < 500) {
      return true;
    }

    return false;
  }

  /** Handle wheel end */
  private _handleEnd() {
    if (!this._hasStarted) {
      return;
    }

    const { props, activeSlide, isSlideScrolling, isTransitioning } = this;

    const lastThreeDeltas = this._deltas.slice(-3).reduce((a, b) => a + b, 0);

    // Reset states

    this._deltas = [];
    this._hasStarted = false;

    // Stick to the nearest magnet

    if (!props.freemode || props.freemode === 'sticky') {
      if (props.followWheel && props.stickOnWheelEnd) {
        // Classic stick when scrolling stops

        const slideThreshold = onlyFinite(
          Math.abs(props.stickOnWheelEndThreshold) / activeSlide.size,
        );

        if (
          activeSlide.progress > slideThreshold &&
          !isSlideScrolling &&
          lastThreeDeltas > 0
        ) {
          this.next();
        } else if (
          activeSlide.progress < -slideThreshold &&
          !isSlideScrolling &&
          lastThreeDeltas < 0
        ) {
          this.prev();
        } else {
          this.stick();
        }
      } else if (!props.followWheel && !isTransitioning) {
        // Stick if something goes wrong when followWheel is disabled
        this.stick();
      }
    }

    this.callbacks.emit('wheelEnd', undefined);
  }

  /** Save delta */
  private _addDelta(delta: number) {
    if (this._deltas.length >= deltasCount) {
      this._deltas.shift();
    }

    this._deltas.push(delta);
  }

  /** Detect if touchpad */
  private get isTouchPad() {
    return !this.isStableDelta || this.isSmallDelta;
  }

  /** Detects if deltas are stable */
  private get isStableDelta() {
    const deltas = this.absDeltas;
    const precision = 0.8;

    // get difference between deltas
    const diffs = deltas.map((d, i) => {
      const prev = deltas[i - 1];
      if (!deltas[i - 1]) {
        return 0;
      }

      return d - prev;
    });

    const zeroDiffs = diffs.filter((d) => d === 0);

    return zeroDiffs.length > diffs.length * precision;
  }

  /** Detects if the latest delta is small */
  private get isSmallDelta() {
    const deltas = this.absDeltas;

    if (deltas.length === 0) {
      return true;
    }

    const last = deltas[deltas.length - 1];

    return last < 50;
  }

  /** Detect if delta is gaining its value */
  private get isGainingDelta() {
    const vevet = initVevet();
    const deltas = this.absDeltas;
    const precision = vevet.osName.includes('window') ? 1.5 : 1.2;

    if (deltas.length < deltasCount) {
      return false;
    }

    const lastDeltas = deltas.slice(-deltasCount);

    const half1 = lastDeltas.slice(0, Math.floor(lastDeltas.length / 2));
    const half2 = lastDeltas.slice(Math.floor(lastDeltas.length / 2));

    const avg1 = this._getAverage(half1);
    const avg2 = this._getAverage(half2);

    const isGaining = avg2 > avg1 * precision;

    return isGaining;
  }

  /** Get average value in an array */
  private _getAverage(array: number[]) {
    return array.length ? array.reduce((a, b) => a + b, 0) / array.length : 0;
  }
}
