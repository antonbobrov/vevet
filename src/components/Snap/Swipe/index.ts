import { Snap } from '..';
import { ISwipeCoords, Swipe } from '@/components/Swipe';

export class SnapSwipe {
  /** Swipe events */
  protected _swipe: Swipe;

  /** Active index on swipe start */
  protected _startIndex: number;

  /** Swipe start time */
  protected _startTime: number;

  constructor(protected snap: Snap) {
    snap.on('destroy', () => this._destroy(), { protected: true });

    this._startIndex = snap.activeIndex;
    this._startTime = 0;

    this._swipe = new Swipe({
      container: snap.container,
      enabled: snap.props.swipe,
      grabCursor: snap.props.grabCursor,
      minTime: snap.props.swipeMinTime,
      threshold: snap.props.swipeThreshold,
      axis: this.axis,
      inertia: snap.props.freemode,
    });
    this._swipe.on('start', (data) => this._handleSwipeStart(data));
    this._swipe.on('move', (data) => this._handleSwipeMove(data));
    this._swipe.on('end', (data) => this._handleSwipeEnd(data));

    // on props change
    snap.on(
      'props',
      () => {
        this._swipe.updateProps({
          enabled: snap.props.swipe,
          grabCursor: snap.props.grabCursor,
          minTime: snap.props.swipeMinTime,
          threshold: snap.props.swipeThreshold,
          axis: this.axis,
          inertia: snap.props.freemode,
        });
      },
      { protected: true },
    );
  }

  /** Axis name depending on swipe direction */
  get axis() {
    const { snap } = this;

    return snap.props.swipeAxis === 'auto' ? snap.axis : snap.props.swipeAxis;
  }

  /** Check if swiping in action */
  get isSwiping() {
    return this._swipe.isSwiping;
  }

  /** Detect if swipe is short */
  get isShort() {
    const { props } = this.snap;

    if (!props.shortSwipes) {
      return false;
    }

    const diff = +new Date() - this._startTime;

    return diff <= props.shortSwipesDuration;
  }

  /** Checks if resistance is allowed */
  get allowFriction() {
    return !this.isShort && this.snap.props.swipeFriction;
  }

  /** Swipe difference between start and current coordinates */
  protected get diff() {
    return this.axis === 'x' ? this._swipe.diff.x : this._swipe.diff.y;
  }

  /**
   * Handles swipe `start` event.
   */
  protected _handleSwipeStart(coords: ISwipeCoords) {
    const { snap } = this;

    this._startIndex = snap.activeIndex;
    this._startTime = +new Date();

    // disable pointer events
    snap.container.style.pointerEvents = 'none';

    // cancel sticky behavior
    if (snap.props.followSwipe) {
      snap.cancelTransition();
    }

    // Emit callbacks
    snap.callbacks.emit('swipeStart', coords);
  }

  /**
   * Handles swipe `move` event.
   */
  protected _handleSwipeMove(coords: ISwipeCoords) {
    const { snap } = this;
    const { swipeSpeed, followSwipe: shouldFollow } = snap.props;

    if (!shouldFollow) {
      return;
    }

    // Normalize wheel data
    const swipeDelta = this.axis === 'x' ? coords.step.x : coords.step.y;
    const delta = swipeDelta * -swipeSpeed;

    // Update track target
    snap.track.iterateTarget(delta);

    // Clamp target if inertia active
    if (this._swipe.hasInertia) {
      snap.track.clampTarget();
    }

    // Emit move callbacks
    snap.callbacks.emit('swipe', coords);
  }

  /** Handles swipe `end` event */
  protected _handleSwipeEnd(coords: ISwipeCoords) {
    this._end();

    // Enable pointer events
    this.snap.container.style.pointerEvents = '';

    // Emit end callbacks
    this.snap.callbacks.emit('swipeEnd', coords);
  }

  /** End swipe action */
  protected _end() {
    const { snap, _swipe: swipe } = this;
    const { props, track } = snap;

    if (!props.followSwipe) {
      this._endNoFollow();

      return;
    }

    if (props.freemode) {
      if (
        !track.canLoop &&
        (track.target < track.min || track.target > track.max)
      ) {
        swipe.cancelInertia();
        snap.stick();
      }

      return;
    }

    if (snap.track.isSlideScrolling) {
      return;
    }

    if (this.isShort) {
      this._endShort();
    } else {
      snap.stick();
    }
  }

  /** End short swipe */
  protected _endShort() {
    const { diff, snap } = this;
    const { props, activeSlide } = snap;

    if (Math.abs(diff) < props.shortSwipesThreshold) {
      snap.stick();

      return;
    }

    if (this._startIndex !== snap.activeIndex) {
      if (Math.sign(diff) < 0 && activeSlide.progress > 0) {
        snap.next();
      } else if (Math.sign(diff) > 0 && activeSlide.progress < 0) {
        snap.prev();
      } else {
        snap.stick();
      }

      return;
    }

    if (Math.sign(diff) < 0) {
      snap.next();
    } else {
      snap.prev();
    }
  }

  /** End action when `followSwipe` is disabled */
  protected _endNoFollow() {
    const { diff, snap } = this;

    if (Math.abs(diff) < 20) {
      snap.stick();

      return;
    }

    if (diff < 0) {
      snap.next();
    } else {
      snap.prev();
    }
  }

  /** Destroy swipe */
  protected _destroy() {
    this._swipe.destroy();
  }
}
