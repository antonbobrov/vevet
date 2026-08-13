import { isNumber, ModulePart, now, onlyFinite } from '@/internal';

import { Snap } from '../..';

import { SnapWheelEvents } from './Events';
import { SnapWheelThrottler } from './Throttler';

/**
 * Mouse wheel input with follow and discrete navigation modes.
 *
 * @internal
 */
export class SnapWheel extends ModulePart<Snap> {
  private _events: SnapWheelEvents;

  private _throttler: SnapWheelThrottler;

  private _lastTime = 0;

  constructor(parent: Snap) {
    super(parent);

    this._events = new SnapWheelEvents(parent.eventsEmitter, {
      getEnabled: () => parent.props.wheel,
      getAxis: this._getAxis.bind(this),
      onStart: this._start.bind(this),
      onMove: this._move.bind(this),
      onEnd: this._end.bind(this),
    });

    this._throttler = new SnapWheelThrottler(() => this._events.deltas);

    this.onDestroy(() => {
      this._throttler.destroy();
      this._events.destroy();
    });
  }

  get isWheeling() {
    return this._events.isWheeling;
  }

  private _getAxis() {
    const { axis, props } = this.parent;

    return props.wheelAxis === 'auto' ? axis : props.wheelAxis;
  }

  private _start() {
    this.callbacks.emit('wheelStart', undefined);
  }

  private _move(evt: WheelEvent, delta: number) {
    if (this.props.followWheel) {
      this.callbacks.emit('wheel', evt);
      this._follow(delta);

      return;
    }

    const can = this._checkNoFollow(delta, evt.deltaMode);
    if (can) {
      this.callbacks.emit('wheel', evt);
      this._noFollow(delta);
    }
  }

  private _end() {
    this.callbacks.emit('wheelEnd', undefined);

    if (this.props.followWheel) {
      this._endFollow();
    } else {
      this._endNoFollow();
    }
  }

  private _follow(delta: number) {
    const { parent } = this;
    const { props, target } = parent;

    parent.cancelTransition();
    parent.setTarget(target + delta * props.wheelSpeed);
    parent.clampTarget();
  }

  private _noFollow(delta: number) {
    if (delta > 0) {
      this.parent.next();
    } else {
      this.parent.prev();
    }
  }

  private _checkNoFollow(delta: number, deltaMode: number) {
    const { parent } = this;
    const { wheelThrottle } = this.props;

    const timeDiff = now() - this._lastTime;

    if (isNumber(wheelThrottle)) {
      if (timeDiff < wheelThrottle) {
        return false;
      }
    } else {
      if (parent.isTransitioning) {
        return false;
      }
    }

    const isThrottled = !this._throttler.test(delta, deltaMode);
    if (isThrottled) {
      return false;
    }

    this._lastTime = now();

    return true;
  }

  private _endFollow() {
    const { parent, props } = this;
    const { stickOnWheelEnd, stickOnWheelEndThreshold, freemode } = props;
    const { activeSlide, isSlideScrolling } = parent;

    if (!stickOnWheelEnd || freemode === true) {
      return;
    }

    const slideThreshold = onlyFinite(
      Math.abs(stickOnWheelEndThreshold) / activeSlide.size,
    );

    const lastThreeDeltas = this._events.deltas.slice(-3);
    const totalDeltas = lastThreeDeltas.reduce((a, b) => a + b, 0);

    if (
      activeSlide.progress > slideThreshold &&
      !isSlideScrolling &&
      totalDeltas > 0
    ) {
      parent.next();
    } else if (
      activeSlide.progress < -slideThreshold &&
      !isSlideScrolling &&
      totalDeltas < 0
    ) {
      parent.prev();
    } else {
      parent.stick();
    }
  }

  private _endNoFollow() {
    if (!this.parent.isTransitioning) {
      this.parent.stick();
    }
  }
}
