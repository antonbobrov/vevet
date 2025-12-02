import { Snap } from '..';
import { ISwipeCoords, ISwipeMatrix, Swipe } from '@/components/Swipe';
import { clamp } from '@/utils';

export class SnapSwipe {
  /** Swipe events */
  protected _swipe: Swipe;

  /** Active index on swipe start */
  protected _startIndex: number;

  /** Swipe start time */
  protected _startTime: number;

  constructor(protected snap: Snap) {
    snap.on('destroy', () => this._destroy(), { protected: true });

    const { props, activeIndex } = snap;

    this._startIndex = activeIndex;
    this._startTime = 0;

    this._swipe = new Swipe({
      container: snap.eventsEmitter,
      enabled: props.swipe,
      grabCursor: props.grabCursor,
      minTime: props.swipeMinTime,
      threshold: props.swipeThreshold,
      axis: this.axis,
      ratio: props.swipeSpeed,
      inertia: false,
      inertiaDuration: props.swipeInertiaDuration,
      inertiaRatio: props.swipeInertiaRatio,
      velocityModifier: this._handleVelocityModifier.bind(this),
      inertiaDistanceThreshold: 5,
    });

    this._swipe.on('start', (data) => this._handleSwipeStart(data));
    this._swipe.on('move', (data) => this._handleSwipeMove(data));
    this._swipe.on('end', (data) => this._handleSwipeEnd(data));
    this._swipe.on('inertiaStart', () => this._handleSwipeInertiaStart());
    this._swipe.on('inertiaEnd', () => this._handleSwipeInertiaEnd());
    this._swipe.on('inertiaFail', () => this._handleSwipeInertiaFail());
    this._swipe.on('inertiaCancel', () => this._handleSwipeInertiaCancel());

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
          ratio: props.swipeSpeed,
          inertiaDuration: snap.props.swipeInertiaDuration,
          inertiaRatio: snap.props.swipeInertiaRatio,
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

  /** Check if inertia is active */
  get hasInertia() {
    return this._swipe.hasInertia;
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

  protected _handleVelocityModifier(source: ISwipeMatrix) {
    const { props, track, activeSlide, domSize } = this.snap;
    const { coord, size: slideSize } = activeSlide;

    // Simple freemode

    if (props.freemode === true) {
      return source;
    }

    // Update target coordinate

    track.target = track.current;

    // Sticky freemode

    if (props.freemode === 'sticky' && !track.isSlideScrolling) {
      const virtualCoord = track.loopedCurrent - source[this.axis];

      const magnet = this.snap.getNearestMagnet(virtualCoord);

      if (!magnet) {
        return source;
      }

      const newVelocity = track.loopedCurrent - virtualCoord - magnet.diff;

      return {
        ...source,
        [this.axis]: newVelocity,
      };
    }

    // Freemode: false, when slides are scrolled

    const value = clamp(source[this.axis], -coord, domSize - slideSize - coord);
    const output = { ...source, [this.axis]: value };

    return output;
  }

  /**
   * Handles swipe `start` event.
   */
  protected _handleSwipeStart(coords: ISwipeCoords) {
    const { snap } = this;

    this._startIndex = snap.activeIndex;
    this._startTime = +new Date();

    // disable pointer events
    snap.eventsEmitter.style.pointerEvents = 'none';

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
    const { props, track, callbacks } = snap;
    const { followSwipe: shouldFollow } = props;

    if (!shouldFollow && !track.isSlideScrolling) {
      return;
    }

    // Normalize swipe delta
    const swipeDelta = this.axis === 'x' ? coords.step.x : coords.step.y;
    const delta = swipeDelta * -1;

    // Update track target
    track.iterateTarget(delta);

    // Clamp target if inertia is animating
    if (this._swipe.hasInertia) {
      track.clampTarget();
    }

    // Emit move callbacks
    callbacks.emit('swipe', coords);
  }

  /** Handles swipe `end` event */
  protected _handleSwipeEnd(coords: ISwipeCoords) {
    this._end();

    // Enable pointer events
    this.snap.eventsEmitter.style.pointerEvents = '';

    // Emit end callbacks
    this.snap.callbacks.emit('swipeEnd', coords);
  }

  /** Handles swipe inertia start */
  protected _handleSwipeInertiaStart() {
    this.snap.callbacks.emit('swipeInertiaStart', undefined);
  }

  /** Handles swipe inertia end */
  protected _handleSwipeInertiaEnd() {
    this.snap.callbacks.emit('swipeInertiaEnd', undefined);
  }

  /** Handles swipe inertia fail */
  protected _handleSwipeInertiaFail() {
    const { snap } = this;

    if (snap.props.freemode === 'sticky' && !snap.track.isSlideScrolling) {
      if (this.isShort) {
        this._endShort();
      } else {
        snap.stick();
      }
    }

    this.snap.callbacks.emit('swipeInertiaFail', undefined);
  }

  /** Handles swipe inertia cancel */
  protected _handleSwipeInertiaCancel() {
    this.snap.callbacks.emit('swipeInertiaCancel', undefined);
  }

  /** End swipe action */
  protected _end() {
    const { snap, _swipe: swipe } = this;
    const { props, track } = snap;

    // Handle freemode
    if (props.freemode) {
      this._swipe.updateProps({ inertia: true });

      // Clamp & stick if out of bounds
      if (
        !track.canLoop &&
        (track.target < track.min || track.target > track.max)
      ) {
        swipe.cancelInertia();
        snap.stick();
      }

      // End short swipe
      if (this.isShort && props.freemode === 'sticky') {
        this._swipe.updateProps({ inertia: false });
        swipe.cancelInertia();

        this._endShort();
      }

      return;
    }

    // Enable inertia if active slide is being scrolled
    if (track.isSlideScrolling) {
      this._swipe.updateProps({ inertia: true });

      return;
    }

    // Disable inertia
    this._swipe.updateProps({ inertia: false });

    // Return if followSwipe is disabled
    if (!props.followSwipe) {
      this._endNoFollow();

      return;
    }

    // Short swipe
    if (this.isShort) {
      this._endShort();

      return;
    }

    // Or just stick to the nearest slide
    snap.stick();
  }

  /** End short swipe */
  protected _endShort() {
    const { diff, snap } = this;
    const { props, activeSlide } = snap;

    if (Math.abs(diff) < props.shortSwipesThreshold) {
      snap.stick();

      return;
    }

    const normalizedDiff = Math.sign(diff);

    if (this._startIndex !== snap.activeIndex) {
      if (normalizedDiff < 0 && activeSlide.progress > 0) {
        snap.next();
      } else if (normalizedDiff > 0 && activeSlide.progress < 0) {
        snap.prev();
      } else {
        snap.stick();
      }

      return;
    }

    if (normalizedDiff < 0) {
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
