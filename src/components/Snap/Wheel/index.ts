import { addEventListener, clamp, normalizeWheel } from '@/utils';
import { Snap } from '..';
import { initVevet } from '@/global/initVevet';
import { isNumber } from '@/internal/isNumber';

const deltasCount = 6;

export class SnapWheel {
  /** Listeners to destruct */
  protected _destructor: () => void;

  /** Detects if wheel event is started */
  protected _hasStarted = false;

  /** Debounce wheel end event */
  protected _debounceEnd?: NodeJS.Timeout;

  /** Deltas history */
  protected _deltas: number[] = [];

  /** Last time wheel event was fired */
  protected _lastWheelTime = 0;

  constructor(protected _snap: Snap) {
    _snap.on('destroy', () => this._destroy(), { protected: true });

    this._destructor = addEventListener(_snap.eventsEmitter, 'wheel', (event) =>
      this._handleWheel(event),
    );
  }

  /** Destroy wheel listeners */
  protected _destroy() {
    this._destructor();

    if (this._debounceEnd) {
      clearTimeout(this._debounceEnd);
    }
  }

  /** Snap component */
  protected get snap() {
    return this._snap;
  }

  /** Get absolute deltas */
  protected get absDeltas() {
    return this._deltas.map((d) => Math.abs(d));
  }

  /** Get last wheel time */
  protected get lastWheelTime() {
    return this._lastWheelTime;
  }

  /**
   * Handles wheel events
   */
  protected _handleWheel(event: WheelEvent) {
    const { snap } = this;
    const { props } = snap;

    if (!props.wheel) {
      return;
    }

    event.preventDefault();

    // Get delta
    const wheelData = normalizeWheel(event);
    const wheelAxis = props.wheelAxis === 'auto' ? snap.axis : props.wheelAxis;
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
  protected _handleStart(delta: number) {
    if (this._hasStarted || Math.abs(delta) < 2) {
      return;
    }

    this._hasStarted = true;

    this.snap.callbacks.emit('wheelStart', undefined);
  }

  /** Handle wheel move */
  protected _handleMove(delta: number, event: WheelEvent) {
    if (!this._hasStarted) {
      return;
    }

    const { snap } = this;
    const { props } = snap;

    // Save delta
    this._addDelta(delta);

    // Move callback
    snap.callbacks.emit('wheel', event);

    // Handle wheel logic
    if (props.followWheel) {
      this._handleFollow(delta);
    } else {
      this._handleNoFollow(delta);
    }
  }

  /** Handle `followWheel=true` */
  protected _handleFollow(delta: number) {
    const { snap } = this;

    // Cancel snap transition
    snap.cancelTransition();

    // Update track target
    snap.track.iterateTarget(delta * snap.props.wheelSpeed);
    snap.track.clampTarget();
  }

  /** Handle `followWheel=false` */
  protected _handleNoFollow(delta: number) {
    // vars
    const { snap, isTouchPad, isGainingDelta } = this;
    const { track, activeSlide, domSize } = snap;

    // Detect wheel throttling
    if (this._detectNoFollowThrottle()) {
      return;
    }

    // Detect if need to throttle or follow

    let shouldFollow = false;
    let isThrottled = true;

    if (!shouldFollow) {
      if (track.isSlideScrolling) {
        if (activeSlide.coord === 0) {
          if (delta > 0) {
            shouldFollow = true;
          }
        } else if (activeSlide.coord === domSize - activeSlide.size) {
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
          snap.cancelTransition();

          track.iterateTarget(direction);
          track.clampTarget();

          if (!isTouchPad) {
            track.current = track.target;
          }
        } else if (direction === 1) {
          if (!snap.props.loop && snap.activeIndex === snap.slides.length - 1) {
            return;
          }

          this._lastWheelTime = +new Date();

          snap.next();
        } else {
          if (!snap.props.loop && snap.activeIndex === 0) {
            return;
          }

          this._lastWheelTime = +new Date();

          snap.prev();
        }
      }

      return;
    }

    // Follow wheel

    if (shouldFollow) {
      snap.cancelTransition();

      const deltaWithSpeed = delta * snap.props.wheelSpeed;

      const start = Math.min(...activeSlide.magnets);
      const end = Math.max(...activeSlide.magnets);

      const loopedTarget = track.loopCoord(track.target);

      const clampedLoopedTarget = clamp(
        loopedTarget + deltaWithSpeed,
        start,
        end,
      );

      track.target += clampedLoopedTarget - loopedTarget;
      track.clampTarget();
    }
  }

  /** Detect if wheel should be throttled */
  protected _detectNoFollowThrottle() {
    const { isTouchPad, snap } = this;
    const { wheelThrottle } = snap.props;
    const timeDiff = +new Date() - this._lastWheelTime;

    // NUMBER

    if (isNumber(wheelThrottle)) {
      return timeDiff < wheelThrottle;
    }

    // AUTO

    if (isTouchPad) {
      return this.snap.isTransitioning;
    }

    const visibleScrollableSlides = snap.scrollableSlides.filter(
      (slide) => slide.isVisible,
    );

    if (visibleScrollableSlides.length && snap.isTransitioning) {
      return true;
    }

    if (timeDiff < 500) {
      return true;
    }

    return false;
  }

  /** Handle wheel end */
  protected _handleEnd() {
    if (!this._hasStarted) {
      return;
    }

    const { snap } = this;
    const { props, activeSlide, track } = snap;

    const lastThreeDeltas = this._deltas.slice(-3).reduce((a, b) => a + b, 0);

    // Reset states

    this._deltas = [];
    this._hasStarted = false;

    // Stick to the nearest magnet

    if (!props.freemode || props.freemode === 'sticky') {
      if (props.followWheel && props.stickOnWheelEnd) {
        // Classic stick when scrolling stops

        const slideThreshold =
          Math.abs(props.stickOnWheelEndThreshold) / activeSlide.size;

        if (
          activeSlide.progress > slideThreshold &&
          !track.isSlideScrolling &&
          lastThreeDeltas > 0
        ) {
          snap.next();
        } else if (
          activeSlide.progress < -slideThreshold &&
          !track.isSlideScrolling &&
          lastThreeDeltas < 0
        ) {
          snap.prev();
        } else {
          snap.stick();
        }
      } else if (!props.followWheel && !snap.isTransitioning) {
        // Stick if something goes wrong when followWheel is disabled
        snap.stick();
      }
    }

    snap.callbacks.emit('wheelEnd', undefined);
  }

  /** Save delta */
  protected _addDelta(delta: number) {
    if (this._deltas.length >= deltasCount) {
      this._deltas.shift();
    }

    this._deltas.push(delta);
  }

  /** Detect if touchpad */
  protected get isTouchPad() {
    return !this.isStableDelta || this.isSmallDelta;
  }

  /** Detects if deltas are stable */
  protected get isStableDelta() {
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
  protected get isSmallDelta() {
    const deltas = this.absDeltas;

    if (deltas.length === 0) {
      return true;
    }

    const last = deltas[deltas.length - 1];

    return last < 50;
  }

  /** Detect if delta is gaining its value */
  protected get isGainingDelta() {
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
  protected _getAverage(array: number[]) {
    return array.length ? array.reduce((a, b) => a + b, 0) / array.length : 0;
  }
}
