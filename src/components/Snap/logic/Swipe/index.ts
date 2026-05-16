import {
  ISwipeBounds,
  ISwipeCoords,
  ISwipeVec3,
  Swipe,
} from '@/components/Swipe';

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
      bakeBounds: this._getBounds.bind(this),
      velocityModifier: this._handleVelocityModifier.bind(this),
      overflow: this._getOverflow.bind(this),
      releaseBounce: () => !snap.isTransitioning,
      inertiaThreshold: 5,
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

  /** Check if swipe has inertia */
  get hasIntertia() {
    return this.swipe.hasInertia;
  }

  /** Checks if resistance is allowed */
  get allowFriction() {
    return !this.isShort && this.props.swipeFriction;
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
    if (!this.props.shortSwipes) {
      return false;
    }

    const diff = +new Date() - this._startTime;

    return diff <= this.props.shortSwipesDuration;
  }

  /** Swipe difference between start and current coordinates */
  private get diff() {
    const { diff } = this.swipe;

    const initialDiff = diff[this.axis];

    return initialDiff / Math.abs(this.props.swipeSpeed);
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
      ratio: this.axis === 'angle' ? 1 : props.swipeSpeed,
      inertiaDuration: props.swipeInertiaDuration,
      inertiaRatio: props.swipeInertiaRatio,
      inertiaType:
        this.freemode === 'sticky'
          ? ('timeline' as const)
          : ('exponential' as const),
    };
  }

  private get freemode() {
    const props = this.props;

    if (props.freemode === 'sticky' && props.swipeAxis === 'angle') {
      return true;
    }

    return props.freemode;
  }

  /** Handles swipe `start` event */
  private _handleSwipeStart(coords: ISwipeCoords) {
    const { snap, props } = this;

    this._startIndex = snap.activeIndex;
    this._startTime = +new Date();

    // disable pointer events
    snap.eventsEmitter.style.pointerEvents = 'none';

    // cancel sticky behavior
    if (props.followSwipe) {
      snap.cancelTransition();
    }

    // Emit callbacks
    snap.callbacks.emit('swipeStart', coords);
  }

  /** Handles swipe `move` event */
  private _handleSwipeMove(coords: ISwipeCoords) {
    const { snap, track, axis, props } = this;
    const { callbacks } = snap;

    if (!props.followSwipe) {
      return;
    }

    // Normalize swipe delta
    let swipeDelta = coords.step[axis];
    if (axis === 'angle') {
      const trackLength = snap.max - snap.min;
      swipeDelta = trackLength * (swipeDelta / 360);
    }

    const delta = swipeDelta * -1;

    // Update track target
    track.updateTarget(track.target + delta);

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

  /** End swipe action */
  private _end() {
    const { snap, swipe, track, props, freemode } = this;

    swipe.updateProps({ inertia: false });

    track.target = track.current;

    if (freemode) {
      if (freemode === 'sticky' && this.isShort && !snap.isSlideScrolling) {
        this._endShort();
      } else {
        swipe.updateProps({ inertia: true });
      }

      return;
    }

    if (snap.isSlideScrolling && props.followSwipe) {
      swipe.updateProps({ inertia: true });

      return;
    }

    if (!props.followSwipe) {
      this._endNoFollow();

      return;
    }

    if (this.isShort) {
      this._endShort();

      return;
    }

    snap.stick();
  }

  /** End short swipe */
  private _endShort() {
    const { diff, snap, props } = this;

    if (Math.abs(diff) < props.shortSwipesThreshold) {
      snap.stick();

      return;
    }

    const normalizedDiff = Math.sign(diff);

    if (this._startIndex !== snap.activeIndex) {
      if (normalizedDiff < 0 && snap.activeSlide.progress > 0) {
        snap.next();
      } else if (normalizedDiff > 0 && snap.activeSlide.progress < 0) {
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

  /** Get swipe bounds */
  private _getBounds(): ISwipeBounds | null {
    const { snap, track, props, freemode } = this;
    const { coord: slideCoord, size: slideSize } = snap.activeSlide;

    if (!props.followSwipe) {
      return null;
    }

    const defaults = {
      x: [-Infinity, Infinity],
      y: [-Infinity, Infinity],
      [this.axis]: [-(track.min - track.current), -(track.max - track.current)],
    };

    if (freemode) {
      if (track.canLoop) {
        return null;
      }

      return { ...defaults };
    }

    // Update target coordinate
    track.target = track.current;

    // Scrolling slides

    if (!freemode && snap.isSlideScrolling) {
      return {
        ...defaults,
        [this.axis]: [snap.containerSize - slideSize - slideCoord, -slideCoord],
      };
    }

    return { ...defaults };
  }

  /** Modify swipe velocity for timeline-based inertia */
  private _handleVelocityModifier(source: ISwipeVec3) {
    const { snap, track } = this;

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

  /** Handles swipe inertia start */
  private _handleSwipeInertiaStart() {
    this.snap.callbacks.emit('swipeInertiaStart', undefined);
  }

  /** Handles swipe inertia end */
  private _handleSwipeInertiaEnd() {
    this.snap.callbacks.emit('swipeInertiaEnd', undefined);
  }

  /** Get swipe overflow */
  private _getOverflow() {
    const { props, snap } = this;

    return (1 - props.edgeFriction) * snap.containerSize;
  }

  /** Handles swipe inertia fail */
  private _handleSwipeInertiaFail() {
    const { snap, freemode } = this;

    if (freemode === 'sticky' && !snap.isSlideScrolling) {
      if (this.isShort) {
        this._endShort();
      } else {
        snap.stick();
      }
    } else {
      this.snap.render();
    }

    this.snap.callbacks.emit('swipeInertiaFail', undefined);
  }

  /** Handles swipe inertia cancel */
  private _handleSwipeInertiaCancel() {
    this.snap.callbacks.emit('swipeInertiaCancel', undefined);
  }
}
