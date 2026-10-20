import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module/types';
import { TEasing, TEasingType, TSpring } from '@/utils/math';

import { IPointersCallbacksMap, IPointersStaticProps } from '../Pointers/types';
import { TRafEase } from '../Raf/types';

import {
  ISwipeAxes,
  ISwipeCoords,
  ISwipeState,
  ISwipeVec2,
  ISwipeVec3,
} from './global';

export interface ISwipeStaticProps extends IModuleStaticProps {
  /** Event listener container. */
  container: HTMLElement | SVGElement;

  /**
   * An element that triggers the swipe start.
   * Calculations remain relative to the container regardless of this element.
   */
  thumb?: HTMLElement | SVGElement | null;

  /**
   * Determines which mouse buttons trigger events.
   * - 0: Main button pressed, usually the left button or the un-initialized state
   * - 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
   * - 2: Secondary button pressed, usually the right button
   * - 3: Fourth button, typically the Browser Back button
   * - 4: Fifth button, typically the Browser Forward button
   *
   * See [MouseEvent.button](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button).
   *
   * @default [0]
   */
  buttons?: IPointersStaticProps['buttons'];

  /**
   * Required pointer count to activate swiping.
   * @default 1
   */
  pointers?: IPointersStaticProps['minPointers'];

  /**
   * Disable user selection on drag.
   * @default true
   */
  disableUserSelect?: boolean;
}

export interface ISwipeMutableProps extends IModuleMutableProps {
  /**
   * Enables or disables swipe events.
   * @default true
   */
  enabled?: boolean;

  /**
   * Calculates coordinates relative to the container.
   * @default false
   */
  relative?: boolean;

  /**
   * Primary swiping axis.
   * @default null
   */
  axis?: null | 'x' | 'y';

  /**
   * Multiplier applied to pointer `step` when accumulating `rawMovement`.
   * @default 1
   */
  ratio?: number;

  /**
   * Shows "grab" and "grabbing" cursors during interaction.
   * @default false
   */
  grabCursor?: boolean;

  /**
   * Returns `true` to abort before the swipe starts (after threshold / axis checks).
   * @default `() => false`
   */
  willAbort?: (props: ISwipeCanMoveArg) => boolean;

  /**
   * Minimum swipe distance (px) to trigger swipe start.
   * @default 5
   */
  threshold?: number;

  /**
   * Minimum hold duration (ms) before the swipe can activate (`start`).
   * @default 0
   */
  minTime?: number;

  /**
   * Minimum swipe distance (px) for directional callbacks.
   * @default 50
   */
  directionThreshold?: number;

  /**
   * Prevents edge swiping (iOS swipe-back gesture).
   * @default false
   */
  preventEdgeSwipe?: boolean;

  /**
   * Edge swipe threshold (px) from the left/right edge.
   * @default 20
   */
  edgeSwipeThreshold?: number;

  /**
   * Prevents `touchmove` event.
   * @default true
   */
  preventTouchMove?: boolean;

  /**
   * Requires Ctrl key for swipe (mouse only).
   * @default false
   */
  requireCtrlKey?: boolean;

  /**
   * Movement limits per axis in movement space. Unset axis is unbounded.
   * Values are normalized to `[min, max]` per axis.
   * @default null
   */
  bounds?: null | ((coords: ISwipeCoords) => ISwipeAxes | null);

  /**
   * Max rubber-band stretch past `bounds` while dragging
   * (px for x/y, degrees for `angle`).
   * @default 50
   */
  overscroll?: number | (() => number);

  /**
   * Whether {@link Swipe.releaseRubber} is allowed.
   * @default () => true
   */
  canRubber?: () => boolean;

  /**
   * Snap targets per axis in movement space.
   * Redirects inertia distance and rubber settle toward the nearest target.
   * @default null
   */
  snap?: null | (() => ISwipeAxes | null);

  /**
   * Recalculate `bounds` while inertia is running.
   * @default true
   */
  boundsOnInertia?: boolean;

  /**
   * Duration (ms) of {@link Swipe.releaseRubber} (snap settle or exceeds cancel)
   * when release inertia does not run.
   * @default 250
   */
  rubberDuration?: number;

  /**
   * Ease for {@link Swipe.releaseRubber} (`TEasing` or spring).
   * @default EaseOutCubic
   */
  rubberEase?: TEasing | TSpring;

  /**
   * Enables release inertia after gesture end (RAF velocity decay).
   * @default false
   */
  inertia?: boolean;

  /**
   * Freeflow velocity damp strength per frame (higher = stops sooner).
   * @default 0.05
   */
  inertiaEase?: number;

  /**
   * Ease for inertia overscroll bounce back inside `bounds`
   * (`number` damp or spring).
   * @default 0.3
   */
  inertiaRubberEase?: TRafEase;

  /**
   * Multiplier applied to release velocity.
   * @default 1
   */
  inertiaRatio?: number;

  /**
   * Minimum release speed to start inertia (px/s for x/y, deg/s for `angle`).
   * @default 1
   */
  inertiaThreshold?: number;

  /**
   * Max release velocity per axis (coord/ms for x/y, deg/ms for `angle`).
   * Falsy axis value disables inertia on that axis.
   * @default { x: 7, y: 7, angle: 3 }
   */
  inertiaMaxVelocity?: ISwipeVec3;

  /**
   * Modifies predicted freeflow distance when inertia starts.
   * When set (or when snap redirects the end), inertia uses distance mode
   * instead of integrating velocity. Snap still preferred per axis afterward.
   * @default null
   */
  modifyInertiaDistance?: null | ((distance: ISwipeVec3) => ISwipeVec3 | null);

  // ── deprecated ───────────────────────────────────────────────────────

  /**
   * @deprecated Use {@link overscroll}.
   */
  overflow?: number | (() => number);

  /**
   * @deprecated Use {@link canRubber}.
   */
  allowRubber?: () => boolean;

  /**
   * @deprecated Use {@link canRubber}.
   */
  canBounce?: () => boolean;

  /**
   * @deprecated Unused — nearest snap is always used when `snap` is set.
   */
  snapRadius?: number | null;

  /**
   * @deprecated Use {@link boundsOnInertia}.
   */
  recalculateBoundsOnInertia?: boolean;

  /**
   * @deprecated Use {@link rubberDuration}.
   */
  bounceDuration?: number;

  /**
   * @deprecated Use {@link rubberEase}.
   */
  easeRubber?: TEasing | TSpring;

  /**
   * @deprecated Use {@link inertiaEase}.
   */
  inertiaDecay?: number;

  /**
   * @deprecated Use {@link inertiaRubberEase}.
   */
  easeOverflow?: TRafEase;

  /**
   * @deprecated Use {@link inertiaRubberEase}.
   */
  inertiaBounceEase?: TRafEase;

  /**
   * @deprecated Use {@link inertiaMaxVelocity}.
   */
  maxVelocity?: ISwipeVec3;

  /**
   * @deprecated Use {@link modifyInertiaDistance}.
   */
  inertiaDistance?: null | ((distance: ISwipeVec3) => ISwipeVec3 | null);

  /**
   * @deprecated Use {@link modifyInertiaDistance}.
   */
  inertiaDistanceModifier?:
    | null
    | ((distance: ISwipeVec3) => ISwipeVec3 | null);

  /**
   * @deprecated Timelined inertia is not supported anymore.
   */
  inertiaDuration?: (distance: number) => number;

  /**
   * @deprecated Timelined inertia is not supported anymore.
   */
  inertiaEasing?: TEasingType;

  /**
   * @deprecated Timelined inertia is not supported anymore.
   */
  velocityModifier?: false | ((velocity: ISwipeState) => ISwipeState);

  /**
   * @deprecated Timelined inertia is not supported anymore.
   */
  inertiaDistanceThreshold?: number;
}

export interface ISwipeCallbacksMap
  extends
    IModuleCallbacksMap<ISwipeMutableProps>,
    Pick<IPointersCallbacksMap, 'pointerdown' | 'pointermove' | 'pointerup'> {
  /** Swipe start event. */
  start: ISwipeCoords;

  /** Swipe move event. */
  move: ISwipeCoords;

  /** Swipe end event. */
  end: ISwipeCoords;

  /** Swipe from bottom to top. */
  toTop: undefined;

  /** Swipe from top to bottom. */
  toBottom: undefined;

  /** Swipe from left to right. */
  toRight: undefined;

  /** Swipe from right to left. */
  toLeft: undefined;

  /** Triggered on `touchstart` listener. Triggered before any action related to this event is processed. */
  touchstart: TouchEvent;

  /** Triggered on `touchmove` listener. Triggered before any action related to this event is processed. */
  touchmove: TouchEvent;

  /** Triggered on `mousemove` listener. Triggered before any action related to this event is processed. */
  mousemove: MouseEvent;

  /** Triggered when swipe is aborted. */
  abort: undefined;

  /** Triggered on edge swipe preventing. */
  preventEdgeSwipe: undefined;

  /** Triggered when release inertia starts. */
  inertiaStart: undefined;

  /** Triggered each inertia frame (before `move`). */
  inertia: undefined;

  /** Triggered when release inertia finishes. */
  inertiaEnd: undefined;

  /** Triggered when inertia fails to start (momentum below threshold). */
  inertiaFail: undefined;

  /** Triggered when release inertia is cancelled. */
  inertiaCancel: undefined;
}

/** Arguments for {@link ISwipeMutableProps.willAbort}. */
export interface ISwipeCanMoveArg {
  /** Input device. */
  type: 'touch' | 'mouse';
  /** Current pointer sample. */
  state: ISwipeState;
  /** Pointer position when the gesture began. */
  start: ISwipeVec2;
  /** Offset from `start` to `state` (pointer space). */
  diff: ISwipeVec2;
}
