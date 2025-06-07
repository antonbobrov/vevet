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
  protected _accum = 0;

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
    if (snap.props.stickOnWheelEnd) {
      this._debounceEnd = setTimeout(() => this._handleEnd(), 100);
    }
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

    if (Math.abs(delta) < 10) {
      return;
    }

    if (snap.props.wheelThrottle === 'auto' && snap.isTransitioning) {
      return;
    }

    const timeDiff = +new Date() - this._lastNoFollowTime;

    if (
      typeof snap.props.wheelThrottle === 'number' &&
      timeDiff < snap.props.wheelThrottle
    ) {
      return;
    }

    this._accum += Math.abs(delta) / 2;
    const direction = Math.sign(delta);

    if (Math.abs(this._accum) < 100) {
      return;
    }

    if (direction === 1) {
      if (!snap.next()) {
        return;
      }
    } else if (!snap.prev()) {
      return;
    }

    this._accum = 0;
    this._lastNoFollowTime = +new Date();
  }

  /** Handle wheel end */
  protected _handleEnd() {
    const { snap } = this;
    const { freemode: isFreemode, followWheel: isFollow } = snap.props;

    this._hasStarted = false;
    this._accum = 0;

    if (!isFreemode && isFollow) {
      snap.stick();
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
