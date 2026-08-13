import { Swipe } from '@/components/Swipe';
import { ISwipeCoords, ISwipeVec3 } from '@/components/Swipe/global';
import { ISwipeMutableProps } from '@/components/Swipe/types';
import { ModulePart } from '@/internal';

import { Snap } from '../..';

/**
 * Swipe / drag input wired to track target and navigation.
 *
 * @internal
 */
export class SnapSwipe extends ModulePart<Snap> {
  private _swipe: Swipe;

  private _startIndex: number;

  private _startTime: number;

  constructor(parent: Snap) {
    super(parent);

    this._startIndex = parent.activeIndex;
    this._startTime = 0;

    const swipe = new Swipe({
      container: parent.eventsEmitter,
      inertia: false,
      inertiaThreshold: 3,
      recalculateBoundsOnInertia: false,
      preventEdgeSwipe: false,
      overflow: () => parent.containerSize * (1 - parent.props.edgeFriction),
      canBounce: () => !parent.isTransitioning,
      bounds: this._getBounds.bind(this),
      inertiaDistanceModifier: this._modifyInertiaDistance.bind(this),
      ...this.swipeProps,
    });
    this._swipe = swipe;

    this.onDestroy(() => swipe.destroy());

    swipe.on('start', (data) => this._handleStart(data));
    swipe.on('move', (data) => this._handleMove(data));
    swipe.on('end', (data) => this._handleEnd(data));
    swipe.on('inertiaStart', () => this._handleInertiaStart());
    swipe.on('inertiaEnd', () => this._handleInertiaEnd());
    swipe.on('inertiaFail', () => this._handleInertiaFail());
    swipe.on('inertiaCancel', () => this._handleInertiaCancel());

    this.callbacks.on('props', () => swipe.updateProps(this.swipeProps), {
      protected: true,
    });
  }

  private get swipeProps(): ISwipeMutableProps {
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

  private get eventsEmitterParent() {
    return this.parent.eventsEmitter.parentElement;
  }

  private get axis() {
    const { props, axis } = this.parent;

    return props.swipeAxis === 'auto' ? axis : props.swipeAxis;
  }

  private get isShort() {
    const { props } = this;

    if (!props.shortSwipes) {
      return false;
    }

    const diff = +new Date() - this._startTime;

    return diff <= props.shortSwipesDuration;
  }

  private get diff() {
    const initialDiff = this._swipe.diff[this.axis];

    return initialDiff * Math.sign(this.props.swipeSpeed);
  }

  private get isStickyFreemode() {
    return this.props.freemode === 'sticky' && this.axis !== 'angle';
  }

  get isSwiping() {
    return this._swipe.isSwiping;
  }

  get hasInertia() {
    return this._swipe.hasInertia;
  }

  get allowFriction() {
    return !this.isShort && this.props.swipeFriction;
  }

  private _getBounds() {
    const { isSlideScrolling, canLoop, $_track: track } = this.parent;

    if (!this.props.freemode && isSlideScrolling) {
      const { activeSlide, containerSize } = this.parent;
      const { staticCoord, size } = activeSlide;

      const loopOffset = Math.abs(track.max - track.min) * track.loopCount;

      return {
        [this.axis]: [
          -staticCoord - track.offset - loopOffset,
          -staticCoord - (size - containerSize) - loopOffset - track.offset,
        ],
      };
    }

    if (canLoop) {
      return null;
    }

    return { [this.axis]: [-track.min, -track.max] };
  }

  /** Snap sticky freemode inertia to the nearest magnet. */
  private _modifyInertiaDistance(dist: ISwipeVec3) {
    const { $_track: track } = this.parent;

    const loopedTarget = track.loopCoord(track.target);
    const virtualCoord = loopedTarget - dist[this.axis];
    const magnet = this.parent.getNearestMagnet(virtualCoord);

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

  private _handleStart(coords: ISwipeCoords) {
    const { parent, eventsEmitterParent, props } = this;
    const { $_track: track } = parent;

    this._startIndex = parent.activeIndex;
    this._startTime = +new Date();

    parent.eventsEmitter.style.pointerEvents = 'none';

    if (eventsEmitterParent && props.grabCursor) {
      eventsEmitterParent.style.cursor = 'grabbing';
    }

    if (this.props.followSwipe) {
      this.parent.cancelTransition();
    }

    this._swipe.setMovement({ x: -track.target, y: -track.target });

    this.callbacks.emit('swipeStart', coords);
  }

  private _handleMove(coords: ISwipeCoords) {
    const { parent, axis, props } = this;
    const { $_track: track } = parent;

    if (!props.followSwipe) {
      return;
    }

    let swipeDelta = coords.prevMovement[axis] - coords.movement[axis];

    if (axis === 'angle') {
      const trackLength = track.max - track.min;
      swipeDelta = trackLength * (swipeDelta / 360);

      parent.setTarget(track.target + swipeDelta);
    } else {
      parent.setTarget(track.target + swipeDelta);
    }

    this.callbacks.emit('swipe', coords);
  }

  private _handleEnd(coords: ISwipeCoords) {
    const { eventsEmitterParent, props } = this;

    this._end();

    this.parent.eventsEmitter.style.pointerEvents = '';

    if (eventsEmitterParent && props.grabCursor) {
      eventsEmitterParent.style.cursor = '';
    }

    this.callbacks.emit('swipeEnd', coords);
  }

  private _handleInertiaStart() {
    this.callbacks.emit('swipeInertiaStart', undefined);
  }

  private _handleInertiaEnd() {
    this.callbacks.emit('swipeInertiaEnd', undefined);
  }

  private _handleInertiaFail() {
    this.callbacks.emit('swipeInertiaFail', undefined);

    if (this.isStickyFreemode) {
      this.parent.stick();
    }
  }

  private _handleInertiaCancel() {
    this.callbacks.emit('swipeInertiaCancel', undefined);

    const { parent } = this;

    if (
      this.isStickyFreemode &&
      !parent.isSlideScrolling &&
      !parent.isTransitioning
    ) {
      parent.stick();
    }
  }

  private _end() {
    const { parent, props, _swipe: swipe } = this;

    swipe.updateProps({ inertia: false });

    if (!props.followSwipe) {
      this._endNoFollow();

      return;
    }

    if (props.freemode) {
      if (this.isStickyFreemode && this.isShort && !parent.isSlideScrolling) {
        this._endShort();

        return;
      }

      swipe.updateProps({ inertia: true });

      return;
    }

    if (parent.isSlideScrolling) {
      swipe.updateProps({ inertia: true });

      return;
    }

    swipe.updateProps({ inertia: false });

    if (this.isShort) {
      this._endShort();

      return;
    }

    parent.stick();
  }

  private _endNoFollow() {
    const { diff, parent } = this;

    if (Math.abs(diff) < 20) {
      parent.stick();

      return;
    }

    if (diff < 0) {
      parent.next();
    } else {
      parent.prev();
    }
  }

  private _endShort() {
    const { parent, diff } = this;
    const { activeIndex, props, activeSlide } = parent;

    if (Math.abs(diff) < props.shortSwipesThreshold) {
      parent.stick();

      return;
    }

    const normalizedDiff = Math.sign(diff);

    if (this._startIndex !== activeIndex) {
      if (normalizedDiff < 0 && activeSlide.progress > 0) {
        parent.next();
      } else if (normalizedDiff > 0 && activeSlide.progress < 0) {
        parent.prev();
      } else {
        parent.stick();
      }

      return;
    }

    if (normalizedDiff < 0) {
      parent.next();
    } else {
      parent.prev();
    }
  }
}
