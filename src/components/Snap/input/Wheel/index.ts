import { initVevet } from '@/global/initVevet';
import { isNumber } from '@/internal/isNumber';
import { onlyFinite } from '@/internal/onlyFinite';
import { ModulePart } from '@/shared/ModulePart';
import { addEventListener, clamp, normalizeWheel } from '@/utils';

import { Snap } from '../..';
import { WHEEL_DEBOUNCE } from '../../constants';

const deltasCount = 6;

/**
 * Mouse wheel input with follow and discrete navigation modes.
 *
 * @internal
 */
export class SnapWheel extends ModulePart<Snap> {
  private _hasStarted = false;

  private _debounce?: NodeJS.Timeout;

  private _deltas: number[] = [];

  private _lastWheelTime = 0;

  constructor(parent: Snap) {
    super(parent);

    const listener = addEventListener(parent.eventsEmitter, 'wheel', (event) =>
      this._handleWheel(event),
    );

    this.onDestroy(() => {
      listener();

      if (this._debounce) {
        clearTimeout(this._debounce);
      }
    });
  }

  private get absDeltas() {
    return this._deltas.map((d) => Math.abs(d));
  }

  get isWheeling() {
    return this._hasStarted;
  }

  private _handleWheel(event: WheelEvent) {
    const { props, axis } = this.parent;

    if (!props.wheel) {
      return;
    }

    event.preventDefault();

    const wheelData = normalizeWheel(event);
    const wheelAxis = props.wheelAxis === 'auto' ? axis : props.wheelAxis;
    const delta = wheelAxis === 'x' ? wheelData.pixelX : wheelData.pixelY;

    this._handleStart(delta);
    this._handleMove(delta, event);

    if (this._debounce) {
      clearTimeout(this._debounce);
    }

    this._debounce = setTimeout(() => this._handleEnd(), WHEEL_DEBOUNCE);
  }

  private _handleStart(delta: number) {
    if (this._hasStarted || Math.abs(delta) < 2) {
      return;
    }

    this._hasStarted = true;

    this.callbacks.emit('wheelStart', undefined);
  }

  private _handleMove(delta: number, event: WheelEvent) {
    if (!this._hasStarted) {
      return;
    }

    this._addDelta(delta);

    if (this.props.followWheel) {
      this._handleFollow(delta);
    } else {
      this._handleNoFollow(delta);
    }

    this.callbacks.emit('wheel', event);
  }

  private _handleFollow(delta: number) {
    const { parent } = this;
    const { props, target } = parent;

    parent.cancelTransition();
    parent.setTarget(target + delta * props.wheelSpeed);
    parent.clampTarget();
  }

  /** Discrete slide steps; may switch to follow mode for oversized slides. */
  private _handleNoFollow(deltaProp: number) {
    const { isTouchPad, isGainingDelta, parent } = this;
    const { props, activeSlide, canLoop } = parent;
    const delta = deltaProp * props.wheelSpeed;

    if (this._detectNoFollowThrottle()) {
      return;
    }

    let shouldFollow = false;
    let isThrottled = true;

    if (!shouldFollow) {
      if (parent.isSlideScrolling) {
        if (activeSlide.coord === 0) {
          if (delta > 0) {
            shouldFollow = true;
          }
        } else if (
          activeSlide.coord ===
          parent.containerSize - activeSlide.size
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

    if (isThrottled) {
      if (
        !isTouchPad ||
        (isTouchPad && (isGainingDelta || this.absDeltas.length === 1))
      ) {
        const direction = Math.sign(delta);

        if (shouldFollow) {
          parent.cancelTransition();

          parent.setTarget(parent.target + direction);
          parent.clampTarget();

          if (!isTouchPad) {
            parent.$_track.current = parent.target;
          }
        } else if (direction === 1) {
          if (!canLoop && parent.activeIndex === parent.slides.length - 1) {
            if (!props.rewind) {
              return;
            }
          }

          this._lastWheelTime = +new Date();

          parent.next();
        } else {
          if (!canLoop && parent.activeIndex === 0) {
            if (!props.rewind) {
              return;
            }
          }

          this._lastWheelTime = +new Date();

          parent.prev();
        }
      }

      return;
    }

    if (shouldFollow) {
      parent.cancelTransition();

      const deltaWithSpeed = delta;

      const start = Math.min(...activeSlide.magnets);
      const end = Math.max(...activeSlide.magnets);

      const loopedTarget = parent.loopCoord(parent.target);

      const clampedLoopedTarget = clamp(
        loopedTarget + deltaWithSpeed,
        start,
        end,
      );

      parent.$_track.target =
        parent.target + clampedLoopedTarget - loopedTarget;

      parent.clampTarget();
    }
  }

  private _detectNoFollowThrottle() {
    const { isTouchPad } = this;
    const { wheelThrottle } = this.props;
    const { scrollableSlides, isTransitioning } = this.parent;

    const timeDiff = +new Date() - this._lastWheelTime;

    if (isNumber(wheelThrottle)) {
      return timeDiff < wheelThrottle;
    }

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

  private _handleEnd() {
    if (!this._hasStarted) {
      return;
    }

    const { props, parent } = this;
    const { activeSlide, isSlideScrolling, isTransitioning } = this.parent;

    const lastThreeDeltas = this._deltas.slice(-3).reduce((a, b) => a + b, 0);

    this._deltas = [];
    this._hasStarted = false;

    if (!props.freemode || props.freemode === 'sticky') {
      if (props.followWheel && props.stickOnWheelEnd) {
        const slideThreshold = onlyFinite(
          Math.abs(props.stickOnWheelEndThreshold) / activeSlide.size,
        );

        if (
          activeSlide.progress > slideThreshold &&
          !isSlideScrolling &&
          lastThreeDeltas > 0
        ) {
          parent.next();
        } else if (
          activeSlide.progress < -slideThreshold &&
          !isSlideScrolling &&
          lastThreeDeltas < 0
        ) {
          parent.prev();
        } else {
          parent.stick();
        }
      } else if (!props.followWheel && !isTransitioning) {
        parent.stick();
      }
    }

    this.callbacks.emit('wheelEnd', undefined);
  }

  private _addDelta(delta: number) {
    if (this._deltas.length >= deltasCount) {
      this._deltas.shift();
    }

    this._deltas.push(delta);
  }

  // Heuristics to distinguish touchpad momentum from mouse wheel clicks
  private get isTouchPad() {
    return !this.isStableDelta || this.isSmallDelta;
  }

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

  private get isSmallDelta() {
    const deltas = this.absDeltas;

    if (deltas.length === 0) {
      return true;
    }

    const last = deltas[deltas.length - 1];

    return last < 50;
  }

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

  private _getAverage(array: number[]) {
    return array.length ? array.reduce((a, b) => a + b, 0) / array.length : 0;
  }
}
