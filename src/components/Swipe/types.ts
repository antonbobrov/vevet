import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';
import { TEasingType } from '@/utils/math/easing';

export interface ISwipeStaticProps extends IModuleStaticProps {
  /** Event listener container. */
  container: HTMLElement | SVGElement;

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
   * Swipe move ratio (multiplier).
   * @default 1
   */
  ratio?: number;

  /**
   * Shows "grab" and "grabbing" cursors during interaction.
   * @default false
   */
  grabCursor?: boolean;

  /**
   * Determines if swipe should be aborted.
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
   * Enables inertia animation.
   * @default false
   */
  inertia?: boolean;

  /**
   * Inertia duration.
   * @default `(distance) => clamp(distance, 500, 2000)`
   */
  inertiaDuration?: (distance: number) => number;

  /**
   * Easing function for inertia.
   * @default EaseOutCubic
   */
  inertiaEasing?: TEasingType;

  /**
   * Final velocity modifier.
   * @default false
   */
  velocityModifier?: false | ((velocity: ISwipeMatrix) => ISwipeMatrix);

  /**
   * Inertia strength.
   * @default 1
   */
  inertiaRatio?: number;

  /**
   * Minimum calculated distance to trigger inertia.
   * @default 50
   */
  inertiaDistanceThreshold?: number;
}

export interface ISwipeCallbacksMap extends IModuleCallbacksMap {
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

export interface ISwipeVec2 {
  x: number;
  y: number;
}

export interface ISwipeCanMoveArg {
  type: 'touch' | 'mouse';
  matrix: ISwipeMatrix;
  start: ISwipeVec2;
  diff: ISwipeVec2;
}

export interface ISwipeMatrix extends ISwipeVec2 {
  angle: number;
}

export interface ISwipeVelocity extends ISwipeMatrix {
  timestamp: number;
}

export interface ISwipeCoords {
  /** Event timestamp. */
  timestamp: number;
  /** Start position. */
  start: ISwipeMatrix;
  /** Previous position. */
  prev: ISwipeMatrix;
  /** Current position. */
  current: ISwipeMatrix;
  /** Movement offset from start. */
  diff: ISwipeMatrix;
  /** Movement offset from previous position. */
  step: ISwipeMatrix;
  /** Total accumulated movement. */
  accum: ISwipeVec2;
}
