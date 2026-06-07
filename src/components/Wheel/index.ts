import normalizeWheel from 'normalize-wheel';

import { Module, TModuleOnCallbacksProps } from '@/base';
import { initVevet } from '@/global/initVevet';
import { isNumber } from '@/internal/isNumber';
import { TRequiredProps } from '@/internal/requiredProps';
import { addEventListener } from '@/utils';

import { MUTABLE_PROPS, GET_STATIC_PROPS } from './props';
import {
  IWheelCallbacksMap,
  IWheelMutableProps,
  IWheelStaticProps,
} from './types';

export * from './types';

type TC = IWheelCallbacksMap;
type TS = IWheelStaticProps;
type TM = IWheelMutableProps;

const DELTAS_COUNT = 6; // todo?

/**
 * todo
 *
 * [Documentation](https://vevetjs.com/docs/Wheel)
 *
 * @group Components
 */
export class SplitText extends Module<TC, TS, TM> {
  /** Get default static properties. */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...GET_STATIC_PROPS() };
  }

  /** Get default mutable properties. */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Detects if wheel event is started */
  private _started = false;

  /** Debounce wheel end event */
  private _debounceEnd?: NodeJS.Timeout;

  /** Deltas history */
  private _deltas: number[] = [];

  /** Last time wheel event was fired */
  private _lastTime = 0;

  constructor(
    props?: TS & TM & TModuleOnCallbacksProps<TC, SplitText>,
    onCallbacks?: TModuleOnCallbacksProps<TC, SplitText>,
  ) {
    super(props, onCallbacks as any);

    const listener = addEventListener(this.container, 'wheel', (event) =>
      this._handleWheel(event),
    );

    this.onDestroy(() => {
      listener();

      if (this._debounceEnd) {
        clearTimeout(this._debounceEnd);
      }
    });
  }

  /** Wheel events container */
  get container() {
    return this.props.container;
  }

  /** todo */
  get isWheeling() {
    return this._started;
  }

  /** Detect if touchpad */
  get isTouchPad() {
    return !this.isStableDelta || this.isSmallDelta;
  }

  /** Detects if deltas are stable */
  get isStableDelta() {
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
  get isSmallDelta() {
    const deltas = this.absDeltas;

    if (deltas.length === 0) {
      return true;
    }

    const last = deltas[deltas.length - 1];

    return last < 50;
  }

  /** Detect if delta is gaining its value */
  get isGainingDelta() {
    const vevet = initVevet();
    const deltas = this.absDeltas;
    const precision = vevet.osName.includes('window') ? 1.5 : 1.2;

    if (deltas.length < DELTAS_COUNT) {
      return false;
    }

    const lastDeltas = deltas.slice(-DELTAS_COUNT);

    const half1 = lastDeltas.slice(0, Math.floor(lastDeltas.length / 2));
    const half2 = lastDeltas.slice(Math.floor(lastDeltas.length / 2));

    const avg1 = this._getAverage(half1);
    const avg2 = this._getAverage(half2);

    const isGaining = avg2 > avg1 * precision;

    return isGaining;
  }

  /** Get absolute deltas */
  private get absDeltas() {
    return this._deltas.map((d) => Math.abs(d));
  }

  /**
   * Handles wheel events
   */
  private _handleWheel(event: WheelEvent) {
    const { props } = this;

    if (!props.enabled) {
      return;
    }

    event.preventDefault();

    // Get delta
    const wheelData = normalizeWheel(event);
    const delta = props.axis === 'x' ? wheelData.pixelX : wheelData.pixelY;

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
    if (this._started || Math.abs(delta) < 2) {
      return;
    }

    this._started = true;

    this.callbacks.emit('start', undefined);
  }

  /** Handle wheel move */
  private _handleMove(delta: number, event: WheelEvent) {
    if (!this._started) {
      return;
    }

    // Save delta
    this._addDelta(delta);

    // Handle wheel logic
    if (this.props.follow) {
      this._handleFollow(event);
    } else {
      this._handleNoFollow(event);
    }
  }

  /** Handle `followWheel=true` */
  private _handleFollow(event: WheelEvent) {
    this.callbacks.emit('wheel', event);
  }

  /** Handle `followWheel=false` */
  private _handleNoFollow(event: WheelEvent) {
    if (this._detectNoFollowThrottle()) {
      return;
    }

    // Detect if need to throttle or follow

    const { isTouchPad, isGainingDelta, absDeltas } = this;

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
        (isTouchPad && (isGainingDelta || absDeltas.length === 1))
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
          if (!props.loop && this.activeIndex === this.slides.length - 1) {
            if (!props.rewind) {
              return;
            }
          }

          this._lastWheelTime = +new Date();

          this.next();
        } else {
          if (!props.loop && this.activeIndex === 0) {
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
  }

  /** Detect if wheel should be throttled */
  private _detectNoFollowThrottle() {
    const { isTouchPad } = this;
    const { throttle } = this.props;

    const timeDiff = +new Date() - this._lastTime;

    // NUMBER

    if (isNumber(throttle)) {
      return timeDiff < throttle;
    }

    // AUTO

    if (isTouchPad) {
      return isTransitioning;
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

  /** Get average value in an array */
  private _getAverage(array: number[]) {
    return array.length ? array.reduce((a, b) => a + b, 0) / array.length : 0;
  }
}
