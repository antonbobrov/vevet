import { Module } from '@/base';
import { TRequiredProps } from '@/internal/requiredProps';
import {
  ISwipeCallbacksMap,
  ISwipeVec2,
  ISwipeMatrix,
  ISwipeCoords,
  ISwipeMutableProps,
  ISwipeStaticProps,
  ISwipeVelocity,
} from './types';
import { Pointers } from '../Pointers';
import { addEventListener, clamp, EaseOutCubic } from '@/utils';
import { initVevet } from '@/global/initVevet';
import { Timeline } from '../Timeline';
import { cursorStyles } from './styles';

export * from './types';

/**
 * Manages swipe interactions:
 * - Tracks movement and detects direction
 * - Emits events on start, move, and end
 * - Supports inertia-based movement
 *
 * Notes:
 * - Does not transform elements, only computes coordinates.
 * - Does not persist state after swipe completion.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Swipe)
 *
 * @group Components
 */
export class Swipe<
  CallbacksMap extends ISwipeCallbacksMap = ISwipeCallbacksMap,
  StaticProps extends ISwipeStaticProps = ISwipeStaticProps,
  MutableProps extends ISwipeMutableProps = ISwipeMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /**
   * Returns default static properties.
   */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      buttons: [0],
      pointers: 1,
      disableUserSelect: true,
    } as TRequiredProps<StaticProps>;
  }

  /**
   * Returns default mutable properties.
   */
  public _getMutable(): TRequiredProps<MutableProps> {
    return {
      ...super._getMutable(),
      enabled: true,
      relative: false,
      axis: null,
      grabCursor: false,
      willAbort: () => false,
      threshold: 5,
      minTime: 0,
      directionThreshold: 50,
      preventEdgeSwipe: true,
      edgeSwipeThreshold: 20,
      preventTouchMove: true,
      requireCtrlKey: false,
      inertia: false,
      inertiaDuration: (distance) => clamp(distance, 350, 1000),
      inertiaEasing: EaseOutCubic,
      inertiaRatio: 0.5,
    } as TRequiredProps<MutableProps>;
  }

  /** Pointer event manager */
  protected _pointers: Pointers;

  /** If swiping has started */
  protected _isSwiping = false;

  /** If swiping has been aborted */
  protected _isAborted = false;

  /** Indicates if a swipe is active */
  get isSwiping() {
    return this._isSwiping;
  }

  /** Initial swipe coordinates (internal use) */
  protected _startCoord: ISwipeVec2 | undefined;

  /** Swipe start time */
  protected _startTime: number | undefined;

  /** Swipe tracking data */
  protected _coords: ISwipeCoords;

  /** Returns current swipe coordinates */
  get coords() {
    return this._coords;
  }

  /** Event target element */
  get container() {
    return this.props.container;
  }

  /** Velocity tracking */
  protected _velocities: ISwipeVelocity[];

  /** Inertia animation */
  protected _inertia?: Timeline;

  /** Indicates if inertia is active */
  get hasInertia() {
    return !!this._inertia;
  }

  /** Cursor styles */
  protected _cursorStyles: HTMLStyleElement;

  constructor(props?: StaticProps & MutableProps) {
    super(props);

    const { container, buttons, pointers } = this.props;

    // set default data
    this._coords = {
      timestamp: 0,
      start: { x: 0, y: 0, angle: 0 },
      prev: { x: 0, y: 0, angle: 0 },
      current: { x: 0, y: 0, angle: 0 },
      diff: { x: 0, y: 0, angle: 0 },
      step: { x: 0, y: 0, angle: 0 },
      accum: { x: 0, y: 0 },
    };

    this._velocities = [];

    this._cursorStyles = cursorStyles?.cloneNode(true) as HTMLStyleElement;

    // create pointers
    this._pointers = new Pointers({
      container,
      buttons,
      minPointers: pointers,
      maxPointers: pointers,
      enabled: this.props.enabled,
      disableUserSelect: this.props.disableUserSelect,
    });

    // add pointer events
    this._pointers.on('start', () => this._handlePointersStart());

    // add listeners

    const touchstart = addEventListener(
      container,
      'touchstart',
      (event) => this._handleTouchStart(event),
      { passive: false },
    );

    this.onDestroy(() => touchstart());

    // apply styles
    this._setInlineStyles();
  }

  /** Handles property updates */
  protected _handleProps() {
    super._handleProps();

    this._pointers.updateProps({ enabled: this.props.enabled });

    this._setInlineStyles();
  }

  /** Applies touch-action and cursor styles */
  protected _setInlineStyles() {
    const { container, axis } = this.props;

    const cursor = this.props.grabCursor ? 'grab' : '';

    let touchAction = 'none';
    if (axis === 'x') {
      touchAction = 'pan-y';
    } else if (axis === 'y') {
      touchAction = 'pan-x';
    }

    container.style.cursor = cursor;
    container.style.touchAction = touchAction;
  }

  /** Handles `touchstart` events */
  protected _handleTouchStart(event: TouchEvent) {
    if (!this.props.enabled) {
      return;
    }

    this.callbacks.emit('touchstart', event);

    this._preventEdgeSwipe(event);
  }

  /** Prevents edge swipes if enabled */
  protected _preventEdgeSwipe(event: TouchEvent) {
    if (!this.props.preventEdgeSwipe) {
      return;
    }

    const threshold = this.props.edgeSwipeThreshold;
    const x = event.targetTouches[0].pageX;

    if (
      event.cancelable &&
      (x <= threshold || x >= initVevet().width - threshold)
    ) {
      event.preventDefault();

      this.callbacks.emit('preventEdgeSwipe', undefined);
    }
  }

  /** Handles swipe start and tracking */
  protected _handlePointersStart() {
    // track touchmove
    const touchmove = addEventListener(
      window,
      'touchmove',
      this._handleTouchMove.bind(this),
      { passive: false },
    );

    // track movement of the first pointer only
    const mousemove = addEventListener(
      window,
      'mousemove',
      this._handleMouseMove.bind(this),
    );

    // track end of pointers
    const end = this._pointers.on('end', () => {
      this._handleEnd();
      end();
      touchmove();
      mousemove();
    });

    // destroy
    this.onDestroy(() => {
      end();
      touchmove();
      mousemove();
    });
  }

  /** Handles `touchmove` event */
  protected _handleTouchMove(event: TouchEvent) {
    this.callbacks.emit('touchmove', event);

    if (this._isSwiping && this.props.preventTouchMove && event.cancelable) {
      event.preventDefault();
    }

    this._handleMove(this._decodeCoords(event), 'touch');
  }

  /** Handles `mousemove` event */
  protected _handleMouseMove(event: MouseEvent) {
    if (this.props.requireCtrlKey && !event.ctrlKey) {
      return;
    }

    this.callbacks.emit('mousemove', event);

    this._handleMove(this._decodeCoords(event), 'mouse');
  }

  /** Parses pointer coordinates relative to the container */
  protected _decodeCoords(event: MouseEvent | TouchEvent): ISwipeMatrix {
    const { props } = this;

    const clientX =
      'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY =
      'touches' in event ? event.touches[0].clientY : event.clientY;

    let x = clientX;
    let y = clientY;

    let centerX = initVevet().width / 2;
    let centerY = initVevet().height / 2;

    if (props.relative) {
      const bounding = props.container.getBoundingClientRect();

      x = clientX - bounding.left;
      y = clientY - bounding.top;
      centerX = bounding.left + bounding.width / 2;
      centerY = bounding.top + bounding.height / 2;
    }

    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    const angle = (angleRad * 180) / Math.PI;

    return { x, y, angle };
  }

  /** Handles move events */
  protected _handleMove(matrix: ISwipeMatrix, type: 'touch' | 'mouse') {
    const data = this._coords;

    if (this._isAborted) {
      return;
    }

    if (!this._startCoord) {
      this._startCoord = { ...matrix };
    }

    if (!this._startTime) {
      this._startTime = +Date.now();
    }

    // check if can start
    if (!this._isSwiping) {
      const { threshold, minTime, axis, willAbort } = this.props;
      const diff = {
        x: matrix.x - this._startCoord.x,
        y: matrix.y - this._startCoord.y,
      };

      // check threshold
      if (Math.sqrt(diff.x ** 2 + diff.y ** 2) < threshold) {
        return;
      }

      // check time
      if (+new Date() - this._startTime < minTime) {
        return;
      }

      // check axis
      if (axis) {
        const rawAngle =
          (Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * 180) / Math.PI;

        const normalizedAngle = axis === 'x' ? rawAngle : 90 - rawAngle;

        if (normalizedAngle > 45) {
          this._reset();
          this._isAborted = true;

          this.callbacks.emit('abort', undefined);

          return;
        }
      }

      // check if should abort
      if (willAbort({ type, matrix, start: this._startCoord, diff })) {
        this._reset();
        this._isAborted = true;

        this.callbacks.emit('abort', undefined);

        return;
      }
    }

    // start
    if (!this._isSwiping) {
      this.cancelInertia();

      this._isSwiping = true;
      this._startCoord = { ...matrix };

      data.timestamp = performance.now();
      data.start = { ...this._startCoord, angle: matrix.angle };
      data.prev = { ...this._startCoord, angle: matrix.angle };
      data.current = { ...this._startCoord, angle: matrix.angle };
      data.diff = { x: 0, y: 0, angle: 0 };
      data.step = { x: 0, y: 0, angle: 0 };
      data.accum = { x: 0, y: 0 };

      // emit callbacks
      this.callbacks.emit('start', this._coords);

      // apply cursor
      if (this.props.grabCursor && this._cursorStyles) {
        initVevet().body.append(this._cursorStyles);
      }
    }

    // move
    this._move(matrix);
  }

  /** Handles move events */
  protected _move({ x, y, angle }: ISwipeMatrix) {
    const coords = this._coords;

    // prepare data
    const start = { ...coords.start };
    const prev = { ...coords.current };
    const current = { x, y, angle };

    // update coords

    coords.timestamp = performance.now();
    coords.prev = prev;
    coords.current = current;

    let angleDelta = coords.current.angle - coords.prev.angle;
    if (angleDelta > 180) {
      angleDelta -= 360;
    } else if (angleDelta < -180) {
      angleDelta += 360;
    }

    coords.step = {
      x: current.x - prev.x,
      y: current.y - prev.y,
      angle: angleDelta,
    };

    coords.diff = {
      x: current.x - start.x,
      y: current.y - start.y,
      angle: coords.diff.angle + coords.step.angle,
    };

    coords.accum = {
      x: coords.accum.x + Math.abs(coords.step.x),
      y: coords.accum.y + Math.abs(coords.step.y),
    };

    // update velocity
    this._velocities.push({ ...coords.current, timestamp: coords.timestamp });

    // trigger callbacks
    this.callbacks.emit('move', this._coords);
  }

  /** Handles swipe end */
  protected _handleEnd() {
    // reset
    this._startTime = undefined;
    this._isAborted = false;

    // check swiping
    if (!this.isSwiping) {
      return;
    }

    // reset
    this._reset();

    // end with inertia
    if (this.props.inertia) {
      this._endWithInertia();
    }

    // reset cursor
    this._cursorStyles.remove();

    // calculate direction
    const { x: diffX, y: diffY } = this._coords.diff;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    const { directionThreshold } = this.props;
    const endAxis = absDiffX > absDiffY ? 'x' : 'y';

    if (endAxis === 'x' && absDiffX > directionThreshold) {
      if (diffX > 0) {
        this.callbacks.emit('toRight', undefined);
      } else if (diffX < 0) {
        this.callbacks.emit('toLeft', undefined);
      }
    }

    if (endAxis === 'y' && absDiffY > directionThreshold) {
      if (diffY > 0) {
        this.callbacks.emit('toBottom', undefined);
      } else if (diffY < 0) {
        this.callbacks.emit('toTop', undefined);
      }
    }

    // end callback
    this.callbacks.emit('end', this._coords);
  }

  /** Reset swipe states */
  protected _reset() {
    this._startCoord = undefined;
    this._isSwiping = false;
  }

  /** Apply inertia-based movement */
  protected _endWithInertia() {
    const { velocity } = this;
    if (!velocity) {
      return;
    }

    const { inertiaDuration, inertiaEasing } = this.props;
    const { x: xDistance, y: yDistance, angle: angleDistance } = velocity;

    const distance = Math.max(Math.abs(xDistance), Math.abs(yDistance));
    const duration = inertiaDuration(distance);

    const startMatrix = { ...this.coords.current };

    this._inertia = new Timeline({ duration, easing: inertiaEasing });

    this._inertia.on('start', () => {
      this.callbacks.emit('inertiaStart', undefined);
    });

    this._inertia.on('update', ({ eased }) => {
      this._move({
        x: startMatrix.x + xDistance * eased,
        y: startMatrix.y + yDistance * eased,
        angle: startMatrix.angle + angleDistance * eased,
      });

      this.callbacks.emit('inertia', undefined);
    });

    this._inertia.on('end', () => {
      this.cancelInertia();

      this.callbacks.emit('inertiaEnd', undefined);
    });

    setTimeout(() => {
      this._inertia?.play();
    }, 0);
  }

  /** Destroy inertia animation */
  public cancelInertia() {
    this._inertia?.destroy();
    this._inertia = undefined;
  }

  /** Returns current velocity */
  protected get velocity() {
    if (this._velocities.length < 2) {
      return undefined;
    }

    const ratio = 1000 * this.props.inertiaRatio;
    const minimumVelocity = 0.02;

    const current = this._velocities.pop()!;
    const last = this._velocities.pop()!;

    const now = performance.now();
    const timeDiff = current.timestamp - last.timestamp;

    const velocityX = (current.x - last.x) / timeDiff / 2;
    const velocityY = (current.y - last.y) / timeDiff / 2;
    const velocityAngle = (current.angle - last.angle) / timeDiff / 2;

    const hasXVelocity = Math.abs(velocityX) > minimumVelocity;
    const hasYVelocity = Math.abs(velocityY) > minimumVelocity;
    const hasAngleVelocity = Math.abs(velocityAngle) > minimumVelocity;

    const hasVelocityByTime = timeDiff < 150 && now - current.timestamp < 300;

    const hasVelocity =
      (hasXVelocity || hasYVelocity || hasAngleVelocity) && hasVelocityByTime;

    if (!hasVelocity) {
      return undefined;
    }

    return {
      x: hasXVelocity ? velocityX * ratio : 0,
      y: hasYVelocity ? velocityY * ratio : 0,
      angle: hasAngleVelocity ? velocityAngle * ratio : 0,
    };
  }

  /** Start coordinate */
  get start() {
    return this._coords.start;
  }

  /** Previous coordinate */
  get prev() {
    return this._coords.prev;
  }

  /** Current coordinate */
  get current() {
    return this._coords.current;
  }

  /** Difference between start and current coordinates */
  get diff() {
    return this._coords.diff;
  }

  /** Difference between start and previous coordinates */
  get step() {
    return this._coords.step;
  }

  /** Accumulated movement */
  get accum() {
    return this._coords.accum;
  }

  /**
   * Destroys the component
   */
  protected _destroy() {
    super._destroy();

    this._pointers.destroy();
    this._inertia?.destroy();
    this._cursorStyles.remove();
  }
}
