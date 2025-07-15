import { addEventListener, normalizeWheel } from '@/utils';
import { Snap } from '..';

export class SnapWheel {
  /** Listeners to destruct */
  protected _destructor: () => void;

  /** Detects if wheel event is started */
  protected _hasStarted = false;

  /** Debounce wheel end event */
  protected _debounceEnd?: NodeJS.Timeout;

  /** Accummulated wheel value for `followWheel=false` */
  protected _noFollowAccum = 0;

  /** Last time wheel event was fired */
  protected _lastNoFollowTime = 0;

  constructor(protected _snap: Snap) {
    _snap.on('destroy', () => this._destroy(), { protected: true });

    this._destructor = addEventListener(_snap.eventsEmitter, 'wheel', (event) =>
      this._handleWheel(event),
    );
  }

  /** Snap component */
  protected get snap() {
    return this._snap;
  }

  /**
   * Handles wheel events
   */
  protected _handleWheel(event: WheelEvent) {
    const { snap } = this;

    if (!snap.props.wheel) {
      return;
    }

    event.preventDefault();

    const { wheelAxis } = snap.props;

    // Start callback
    if (!this._hasStarted) {
      this._hasStarted = true;
      snap.callbacks.emit('wheelStart', undefined);
    }

    // Move callback
    snap.callbacks.emit('wheel', event);

    // Normalize wheel data
    const axis = wheelAxis === 'auto' ? snap.axis : wheelAxis;
    const wheelData = normalizeWheel(event);
    const wheelDelta = axis === 'x' ? wheelData.pixelX : wheelData.pixelY;
    const delta = wheelDelta * snap.props.wheelSpeed;

    // Update wheel target
    if (snap.props.followWheel) {
      this._handleFollow(delta);
    } else {
      this._handleNotFollow(delta);
    }

    // Debounce End
    if (this._debounceEnd) {
      clearTimeout(this._debounceEnd);
    }

    // End callback
    this._debounceEnd = setTimeout(() => this._handleEnd(), 100);
  }

  /** Handle `followWheel=true` */
  protected _handleFollow(delta: number) {
    const { snap } = this;

    // Cancel snap transition
    snap.cancelTransition();

    // Update track target
    snap.track.iterateTarget(delta);
    snap.track.clampTarget();
  }

  /** Handle `followWheel=false` */
  protected _handleNotFollow(delta: number) {
    const { snap } = this;
    const { props } = snap;

    // check wheel throttling by active transition
    if (props.wheelThrottle === 'auto' && snap.isTransitioning) {
      return;
    }

    // check wheel throttling by time
    const timeDiff = +new Date() - this._lastNoFollowTime;
    if (
      typeof props.wheelThrottle === 'number' &&
      timeDiff < props.wheelThrottle
    ) {
      return;
    }

    // scroll slide
    if (snap.track.isSlideScrolling) {
      this._handleFollow(delta);
      this._noFollowAccum = 0;

      return;
    }

    // check minumum wheel threshold
    if (Math.abs(delta) < 0.5) {
      return;
    }

    // accumulate wheel value
    this._noFollowAccum += Math.abs(delta);
    const direction = Math.sign(delta);

    // continue if accumulated value is more than threshold
    if (
      Math.abs(this._noFollowAccum) < Math.abs(props.wheelNoFollowThreshold)
    ) {
      return;
    }

    // detect transition direction
    if (direction === 1) {
      if (!snap.next()) {
        return;
      }
    } else if (!snap.prev()) {
      return;
    }

    // reset
    this._noFollowAccum = 0;
    this._lastNoFollowTime = +new Date();
  }

  /** Handle wheel end */
  protected _handleEnd() {
    const { snap } = this;
    const { props } = this.snap;

    this._hasStarted = false;
    this._noFollowAccum = 0;

    if (!props.freemode) {
      if (props.followWheel && props.stickOnWheelEnd) {
        snap.stick();
      } else if (!props.followWheel && !snap.isTransitioning) {
        snap.stick();
      }
    }

    snap.callbacks.emit('wheelEnd', undefined);
  }

  /** Destroy wheel listeners */
  protected _destroy() {
    this._destructor();

    if (this._debounceEnd) {
      clearTimeout(this._debounceEnd);
    }
  }
}
