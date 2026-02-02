import { ISwipeCoords, ISwipeMatrix, Swipe } from '@/components/Swipe';
import { clamp } from '@/utils';
import { SnapLogic } from '../SnapLogic';
import { Snap } from '../..';

export class SnapSwipe extends SnapLogic {
  /** Swipe events */
  protected swipe: Swipe;

  /** Active index on swipe start */
  protected _startIndex: number;

  /** Swipe start time */
  protected _startTime: number;

  constructor(snap: Snap) {
    super(snap);

    const { props, activeIndex } = snap;

    this._startIndex = activeIndex;
    this._startTime = 0;

    const swipe = new Swipe({
      container: snap.eventsEmitter,
      enabled: props.swipe,
      grabCursor: props.grabCursor,
      minTime: props.swipeMinTime,
      threshold: props.swipeThreshold,
      axis: this.axis === 'angle' ? null : this.axis,
      relative: this.axis === 'angle',
      ratio: props.swipeSpeed,
      inertia: false,
      inertiaDuration: props.swipeInertiaDuration,
      inertiaRatio: props.swipeInertiaRatio,
      velocityModifier: this._handleVelocityModifier.bind(this),
      inertiaDistanceThreshold: 5,
    });
    this.swipe = swipe;

    this.addDestructor(() => swipe.destroy());

    swipe.on('start', (data) => this._handleSwipeStart(data));
    swipe.on('move', (data) => this._handleSwipeMove(data));
    swipe.on('end', (data) => this._handleSwipeEnd(data));
    swipe.on('inertiaStart', () => this._handleSwipeInertiaStart());
    swipe.on('inertiaEnd', () => this._handleSwipeInertiaEnd());
    swipe.on('inertiaFail', () => this._handleSwipeInertiaFail());
    swipe.on('inertiaCancel', () => this._handleSwipeInertiaCancel());

    // handle props change
    snap.on(
      'props',
      () => {
        swipe.updateProps({
          enabled: snap.props.swipe,
          grabCursor: snap.props.grabCursor,
          minTime: snap.props.swipeMinTime,
          threshold: snap.props.swipeThreshold,
          axis: this.axis === 'angle' ? null : this.axis,
          relative: this.axis === 'angle',
          ratio: props.swipeSpeed,
          inertiaDuration: snap.props.swipeInertiaDuration,
          inertiaRatio: snap.props.swipeInertiaRatio,
        });
      },
      { protected: true },
    );
  }

  /** Axis name depending on swipe direction */
  protected get axis() {
    const { props, axis } = this.snap;

    return props.swipeAxis === 'auto' ? axis : props.swipeAxis;
  }

  /** Check if swiping in action */
  get isSwiping() {
    return this.swipe.isSwiping;
  }

  /** Check if inertia is active */
  protected get hasInertia() {
    return this.swipe.hasInertia;
  }

  /** Detect if swipe is short */
  protected get isShort() {
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
    const { diff } = this.swipe;

    const initialDiff = diff[this.axis];

    return initialDiff / Math.abs(this.snap.props.swipeSpeed);
  }

  /** Modify swipe velocity */
  protected _handleVelocityModifier(source: ISwipeMatrix) {
    const { props, track, activeSlide, containerSize } = this.snap;
    const { coord, size: slideSize } = activeSlide;

    // Simple freemode

    if (props.freemode === true) {
      return source;
    }

    // Update target coordinate

    track.$_target = track.current;

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

    const value = clamp(
      source[this.axis],
      -coord,
      containerSize - slideSize - coord,
    );

    const output = { ...source, [this.axis]: value };

    return output;
  }

  /** Handles swipe `start` event */
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

  /** Handles swipe `move` event */
  protected _handleSwipeMove(coords: ISwipeCoords) {
    const { snap, swipe, axis } = this;
    const { props, track, callbacks } = snap;
    const { followSwipe: shouldFollow } = props;

    if (!shouldFollow && !track.isSlideScrolling) {
      return;
    }

    // Normalize swipe delta
    let swipeDelta = coords.step[axis];
    if (axis === 'angle') {
      swipeDelta = (swipeDelta / 360) * snap.containerSize;
    }

    const delta = swipeDelta * -1;

    // Update track target
    track.$_iterateTarget(delta);

    // Clamp target if inertia is animating
    if (swipe.hasInertia) {
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
    const { snap, swipe } = this;
    const { props, track } = snap;

    // Handle freemode
    if (props.freemode) {
      swipe.updateProps({ inertia: true });

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
        swipe.updateProps({ inertia: false });
        swipe.cancelInertia();

        this._endShort();
      }

      return;
    }

    // Enable inertia if active slide is being scrolled
    if (track.isSlideScrolling) {
      swipe.updateProps({ inertia: true });

      return;
    }

    // Disable inertia
    swipe.updateProps({ inertia: false });

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
}
