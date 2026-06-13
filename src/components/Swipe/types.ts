import { TEasingType } from 'easing-progress';

import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';

import { IPointersCallbacksMap } from '../Pointers';

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
  buttons?: number[];

  /**
   * Required pointer count to activate swiping.
   * @default 1
   */
  pointers?: number;

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
   * Swipe movement scale.
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
   * Minimum duration (ms) to trigger swipe move.
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
   * @default true
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
   * Duration of the bounce-back timeline when movement exceeds `bounds` and inertia does not run.
   * @default 250
   */
  bounceDuration?: number;

  /**
   * Rubber-band distance past `bounds` (px for x/y, degrees for `angle`).
   * @default () => 50
   */
  overflow?: () => number;

  /**
   * Enables release inertia (RAF-based decay).
   * @default false
   */
  inertia?: boolean;

  /**
   * Inertia velocity decay per frame (higher = stops sooner).
   * @default 0.05
   */
  inertiaDecay?: number;

  /**
   * Easing factor for pulling inertia back inside `bounds` (per frame, FPS-independent).
   * @default 0.3
   */
  inertiaBounceEase?: number;

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
  maxVelocity?: ISwipeVec3;

  /**
   * Movement limits per axis. Unset axis is unbounded.
   * @default null
   */
  bounds?: null | ((coords: ISwipeCoords) => ISwipeAxes | null);

  /**
   * Enable bounds recalculation when inertia is active
   * @default true
   */
  recalculateBoundsOnInertia?: boolean;

  /**
   * Snap targets per axis in movement space.
   * @default null
   */
  snap?: null | (() => ISwipeAxes | null);

  /**
   * Determines whether the swipe is allowed to bounce back.
   * @default () => true
   */
  canBounce?: () => boolean;

  /**
   * Max distance to a snap target (same units as the axis). Falsy = no radius limit.
   * @default null
   */
  snapRadius?: number | null;

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

  /**
   * Inertia distance modifier. Called when inertia distance is predicted but not yet started.
   * @default null
   */
  inertiaDistanceModifier?:
    | null
    | ((distance: ISwipeVec3) => ISwipeVec3 | null);
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

  /** Triggered on inertia start. */
  inertiaStart: undefined;

  /** Triggered on inertia progress. */
  inertia: undefined;

  /** Triggered on inertia end. */
  inertiaEnd: undefined;

  /** Triggered when inertia fails to start because of lack of momentum. */
  inertiaFail: undefined;

  /** Triggered when inertia is cancelled. */
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
