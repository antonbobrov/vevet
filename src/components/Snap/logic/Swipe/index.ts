import { ISwipeCoords, ISwipeVec3, Swipe } from '@/components/Swipe';

import { SnapLogic } from '..';
import { Snap } from '../..';

export class SnapSwipe extends SnapLogic {
  /** Swipe events */
  private swipe: Swipe;

  /** Active index on swipe start */
  private _startIndex: number;

  /** Swipe start time */
  private _startTime: number;

  constructor(ctx: Snap) {
    super(ctx);

    this._startIndex = ctx.activeIndex;
    this._startTime = 0;

    const swipe = new Swipe({
      container: this.eventsEmitter,
      inertia: false,
      inertiaThreshold: 3,
      recalculateBoundsOnInertia: false,
      overflow: () => ctx.containerSize * (1 - ctx.props.edgeFriction),
      canBounce: () => !this.isTransitioning,
      bounds: this._getBounds.bind(this),
      inertiaDistanceModifier: this._modifyInertiaDistance.bind(this),
      ...this.swipeProps,
    });
    this.swipe = swipe;

    this.addDestructor(() => swipe.destroy());

    swipe.on('start', (data) => this._handleStart(data));
    swipe.on('move', (data) => this._handleMove(data));
    swipe.on('end', (data) => this._handleEnd(data));
    swipe.on('inertiaStart', () => this._handleInertiaStart());
    swipe.on('inertiaEnd', () => this._handleInertiaEnd());
    swipe.on('inertiaFail', () => this._handleInertiaFail());
    swipe.on('inertiaCancel', () => this._handleInertiaCancel());

    // handle props change
    this.callbacks.on('props', () => swipe.updateProps(this.swipeProps), {
      protected: true,
    });
  }

  /** Get swipe properties */
  private get swipeProps() {
    const { props } = this;

    return {
      enabled: props.swipe,
      grabCursor: props.grabCursor,
      minTime: props.swipeMinTime,
      threshold: props.swipeThreshold,
      axis: this.axis === 'angle' ? null : this.axis,
      relative: this.axis === 'angle',
      ratio: props.swipeSpeed,
      inertiaRatio: props.swipeInertiaRatio,
    };
  }

  /** Axis name depending on swipe direction */
  private get axis() {
    const { props, snapAxis } = this;

    return props.swipeAxis === 'auto' ? snapAxis : props.swipeAxis;
  }

  /** Detect if swipe is short */
  private get isShort() {
    const { props } = this;

    if (!props.shortSwipes) {
      return false;
    }

    const diff = +new Date() - this._startTime;

    return diff <= props.shortSwipesDuration;
  }

  /** Swipe difference between start and current coordinates */
  private get diff() {
    const initialDiff = this.swipe.diff[this.axis];

    return initialDiff * Math.sign(this.props.swipeSpeed);
  }

  /** Check if sticky freemode is enabled */
  private get isStickyFreemode() {
    return this.props.freemode === 'sticky' && this.axis !== 'angle';
  }

  /** Check if swiping in action */
  get isSwiping() {
    return this.swipe.isSwiping;
  }

  /** Check if swipe has inertia */
  get hasInertia() {
    return this.swipe.hasInertia;
  }

  /** Checks if resistance is allowed */
  get allowFriction() {
    return !this.isShort && this.props.swipeFriction;
  }

  /** Get swipe bounds */
  private _getBounds() {
    const { freemode, loop } = this.props;
    const { isSlideScrolling, track } = this;

    if (!freemode && isSlideScrolling) {
      const { activeSlide, containerSize, track } = this;
      const { staticCoord, size } = activeSlide;

      const loopOffset = Math.abs(track.max - track.min) * track.loopCount;

      return {
        [this.axis]: [
          -staticCoord - track.offset - loopOffset,
          -staticCoord - (size - containerSize) - loopOffset - track.offset,
        ],
      };
    }

    if (loop) {
      return null;
    }

    return { [this.axis]: [-track.min, -track.max] };
  }

  /** Modify inertia distance */
  private _modifyInertiaDistance(dist: ISwipeVec3) {
    const { track } = this;

    const loopedTarget = track.loopCoord(track.target);
    const virtualCoord = loopedTarget - dist[this.axis];
    const magnet = this.getNearestMagnet(virtualCoord);

    if (!this.isStickyFreemode) {
      return null;
    }

    if (
      !track.canLoop &&
      (track.target < track.min || track.target > track.max)
    ) {
      return null;
    }

    if (!magnet) {
      return null;
    }

    const diff = loopedTarget - virtualCoord - magnet.diff;

    return { ...dist, [this.axis]: diff, angle: 0 };
  }

  /** Handles swipe `start` event */
  private _handleStart(coords: ISwipeCoords) {
    const { eventsEmitter, props, activeIndex, callbacks } = this;

    this._startIndex = activeIndex;
    this._startTime = +new Date();

    // disable pointer events
    eventsEmitter.style.pointerEvents = 'none';

    // cancel sticky behavior
    if (props.followSwipe) {
      this.track.cancelTransition();
    }

    this.swipe.setMovement({ x: -this.track.target, y: -this.track.target });

    // Emit callbacks
    callbacks.emit('swipeStart', coords);
  }

  /** Handles swipe `move` event */
  private _handleMove(coords: ISwipeCoords) {
    const { track, axis, props, callbacks } = this;

    if (!props.followSwipe) {
      return;
    }

    let swipeDelta = coords.prevMovement[axis] - coords.movement[axis];

    if (axis === 'angle') {
      const trackLength = track.max - track.min;
      swipeDelta = trackLength * (swipeDelta / 360);

      track.updateTarget(track.target + swipeDelta);
    } else {
      track.updateTarget(track.target + swipeDelta);
    }

    // Emit move callbacks
    callbacks.emit('swipe', coords);
  }

  /** Handles swipe `end` event */
  private _handleEnd(coords: ISwipeCoords) {
    this._end();

    // Enable pointer events
    this.eventsEmitter.style.pointerEvents = '';

    // Emit end callbacks
    this.callbacks.emit('swipeEnd', coords);
  }

  /** Handles swipe inertia start */
  private _handleInertiaStart() {
    this.callbacks.emit('swipeInertiaStart', undefined);
  }

  /** Handles swipe inertia end */
  private _handleInertiaEnd() {
    this.callbacks.emit('swipeInertiaEnd', undefined);
  }

  /** Handles swipe inertia fail */
  private _handleInertiaFail() {
    this.callbacks.emit('swipeInertiaFail', undefined);

    if (this.isStickyFreemode) {
      this.stick();
    }
  }

  /** Handles swipe inertia cancel */
  private _handleInertiaCancel() {
    this.callbacks.emit('swipeInertiaCancel', undefined);
  }

  /** End swipe action */
  private _end() {
    const { swipe, props } = this;

    swipe.updateProps({ inertia: false });

    if (!props.followSwipe) {
      this._endNoFollow();

      return;
    }

    if (props.freemode) {
      if (this.isStickyFreemode && this.isShort && !this.isSlideScrolling) {
        this._endShort();

        return;
      }

      swipe.updateProps({ inertia: true });

      return;
    }

    if (this.isSlideScrolling) {
      swipe.updateProps({ inertia: true });

      return;
    }

    swipe.updateProps({ inertia: false });

    if (this.isShort) {
      this._endShort();

      return;
    }

    this.stick();
  }

  /** End action when `followSwipe` is disabled */
  private _endNoFollow() {
    const { diff } = this;

    if (Math.abs(diff) < 20) {
      this.stick();

      return;
    }

    if (diff < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  /** End short swipe */
  private _endShort() {
    const { diff, activeIndex, props, activeSlide } = this;

    if (Math.abs(diff) < props.shortSwipesThreshold) {
      this.stick();

      return;
    }

    const normalizedDiff = Math.sign(diff);

    if (this._startIndex !== activeIndex) {
      if (normalizedDiff < 0 && activeSlide.progress > 0) {
        this.next();
      } else if (normalizedDiff > 0 && activeSlide.progress < 0) {
        this.prev();
      } else {
        this.stick();
      }

      return;
    }

    if (normalizedDiff < 0) {
      this.next();
    } else {
      this.prev();
    }
  }
}
