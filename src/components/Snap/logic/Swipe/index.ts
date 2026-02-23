import { ISwipeCoords, ISwipeMatrix, Swipe } from '@/components/Swipe';
import { clamp } from '@/utils';

import { Snap } from '../..';
import { SnapLogic } from '../SnapLogic';

export class SnapSwipe extends SnapLogic {
  /** Swipe events */
  private swipe: Swipe;

  /** Active index on swipe start */
  private _startIndex: number;

  /** Swipe start time */
  private _startTime: number;

  constructor(snap: Snap) {
    super(snap);

    this._startIndex = snap.activeIndex;
    this._startTime = 0;

    const swipe = new Swipe({
      container: snap.eventsEmitter,
      inertia: false,
      velocityModifier: this._handleVelocityModifier.bind(this),
      inertiaDistanceThreshold: 5,
      ...this.swipeProps,
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
    snap.on('props', () => swipe.updateProps(this.swipeProps), {
      protected: true,
    });
  }

  /** Check if swiping in action */
  get isSwiping() {
    return this.swipe.isSwiping;
  }

  /** Snap track */
  private get track() {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    return this.snap._track;
  }

  /** Axis name depending on swipe direction */
  private get axis() {
    const { props, axis } = this.snap;

    return props.swipeAxis === 'auto' ? axis : props.swipeAxis;
  }

  /** Detect if swipe is short */
  private get isShort() {
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
  private get diff() {
    const { diff } = this.swipe;

    const initialDiff = diff[this.axis];

    return initialDiff / Math.abs(this.snap.props.swipeSpeed);
  }

  /** Get swipe properties */
  private get swipeProps() {
    const { props } = this.snap;

    return {
      enabled: props.swipe,
      grabCursor: props.grabCursor,
      minTime: props.swipeMinTime,
      threshold: props.swipeThreshold,
      axis: this.axis === 'angle' ? null : this.axis,
      relative: this.axis === 'angle',
      ratio: this.axis === 'angle' ? 1 : props.swipeSpeed,
      inertiaDuration: props.swipeInertiaDuration,
      inertiaRatio: props.swipeInertiaRatio,
    };
  }

  /** Modify swipe velocity */
  private _handleVelocityModifier(source: ISwipeMatrix) {
    const { snap, track } = this;
    const { coord: slideCoord, size: slideSize } = snap.activeSlide;

    // Simple freemode
    if (snap.props.freemode === true) {
      return source;
    }

    // Update target coordinate
    track.target = track.current;

    // Sticky freemode
    if (snap.props.freemode === 'sticky' && !snap.isSlideScrolling) {
      const virtualCoord = track.loopedCurrent - source[this.axis];
      const magnet = snap.getNearestMagnet(virtualCoord);

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
      -slideCoord,
      snap.containerSize - slideSize - slideCoord,
    );

    const output = { ...source, [this.axis]: value };

    return output;
  }

  /** Handles swipe `start` event */
  private _handleSwipeStart(coords: ISwipeCoords) {
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
  private _handleSwipeMove(coords: ISwipeCoords) {
    const { snap, track, swipe, axis } = this;
    const { props, callbacks } = snap;
    const { followSwipe: shouldFollow } = props;

    if (!shouldFollow && !snap.isSlideScrolling) {
      return;
    }

    // Normalize swipe delta
    let swipeDelta = coords.step[axis];
    if (axis === 'angle') {
      swipeDelta = (swipeDelta / 360) * snap.containerSize;
    }

    const delta = swipeDelta * -1;

    // Update track target
    track.iterateTarget(delta);

    // Clamp target if inertia is animating
    if (swipe.hasInertia) {
      track.clampTarget();
    }

    // Emit move callbacks
    callbacks.emit('swipe', coords);
  }

  /** Handles swipe `end` event */
  private _handleSwipeEnd(coords: ISwipeCoords) {
    this._end();

    // Enable pointer events
    this.snap.eventsEmitter.style.pointerEvents = '';

    // Emit end callbacks
    this.snap.callbacks.emit('swipeEnd', coords);
  }

  /** Handles swipe inertia start */
  private _handleSwipeInertiaStart() {
    this.snap.callbacks.emit('swipeInertiaStart', undefined);
  }

  /** Handles swipe inertia end */
  private _handleSwipeInertiaEnd() {
    this.snap.callbacks.emit('swipeInertiaEnd', undefined);
  }

  /** Handles swipe inertia fail */
  private _handleSwipeInertiaFail() {
    const { snap } = this;

    if (snap.props.freemode === 'sticky' && !snap.isSlideScrolling) {
      if (this.isShort) {
        this._endShort();
      } else {
        snap.stick();
      }
    }

    this.snap.callbacks.emit('swipeInertiaFail', undefined);
  }

  /** Handles swipe inertia cancel */
  private _handleSwipeInertiaCancel() {
    this.snap.callbacks.emit('swipeInertiaCancel', undefined);
  }

  /** End swipe action */
  private _end() {
    const { snap, swipe, track } = this;
    const { props } = snap;

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
    if (snap.isSlideScrolling) {
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
  private _endShort() {
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
  private _endNoFollow() {
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
