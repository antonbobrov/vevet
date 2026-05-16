import { TEasingType } from 'easing-progress';

import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';

import { IPointersCallbacksMap } from '../Pointers';

import {
  ISwipeCoords,
  ISwipeBounds,
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
   * Duration of the bounce-back timeline when inertia is off and `diff` is out of bounds.
   * @default 250
   */
  bounceDuration?: number;

  /**
   * Rubber-band overflow past bounds (px or degrees, same units as the axis).
   * @default () => 50
   */
  overflow?: () => number;

  /**
   * Enables smooth inertia.
   * @default false
   */
  inertia?: boolean;

  /**
   * Inertia animation mode.
   * - `exponential` — per-frame velocity decay (default)
   * - `timeline` — eased timeline driven by release speed
   * @default 'exponential'
   */
  inertiaType?: 'exponential' | 'timeline';

  /**
   * Inertia decay per frame. The higher the value, the faster the inertia will end.
   * Applicable for exponential-based inertia only.
   * @default 0.025
   */
  inertiaDecay?: number;

  /**
   * Easing factor for inertia bounce back into bounds (per frame, FPS-independent).
   * Applicable for exponential-based inertia only.
   * @default 0.1
   */
  inertiaBounceEase?: number;

  /**
   * Inertia strength.
   * @default 1
   */
  inertiaRatio?: number;

  /**
   * Minimum pointer speed to start inertia.
   * @default 1
   */
  inertiaThreshold?: number;

  /**
   * Max release velocity per axis (coordinate units / ms for x/y, degrees / ms for angle).
   * Falsy axis value clamps that axis to `0` (no inertia on the axis).
   * Applicable for exponential-based inertia only.
   * @default { x: 7, y: 7, angle: 3 }
   */
  maxVelocity?: ISwipeVec3;

  /**
   * Returns movement bounds for `diff` (rubber-band, exponential inertia bounce,
   * timeline amplitude clamp when `velocityModifier` is not set).
   * @default null
   */
  bakeBounds?: null | (() => ISwipeBounds | null);

  /**
   * Allow bounce back animation when released position is out of bounds.
   * @default () => true
   */
  releaseBounce?: () => boolean;

  /**
   * Inertia duration. Applicable for timeline-based inertia only.
   * @default `(distance) => clamp(distance, 500, 2000)`
   */
  inertiaDuration?: (distance: number) => number;

  /**
   * Easing function for inertia. Applicable for timeline-based inertia only.
   * @default EaseOutCubic
   */
  inertiaEasing?: TEasingType;

  /**
   * Velocity modifier. Used to define distance bounds of timeline-based inertia (bakeBounds will be ignored).
   * @default false
   */
  velocityModifier?: false | ((velocity: ISwipeVec3) => ISwipeVec3);

  /**
   * The prop is deprecated and is not used anymore. Use `inertiaThreshold` instead.
   * @deprecated
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

export interface ISwipeCanMoveArg {
  type: 'touch' | 'mouse';
  state: ISwipeState;
  start: ISwipeVec2;
  diff: ISwipeVec2;
}
