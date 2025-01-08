import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';

export interface IPointersStaticProps extends IModuleStaticProps {
  /**
   * The element that listens for pointer events.
   *
   * Ensure the element has the appropriate [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)
   * property to prevent conflicts with browser gestures.
   */
  container: HTMLElement | SVGElement;

  /**
   * Calculate coordinates relative to the container.
   * @default false
   */
  relative?: boolean;

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
   * Minimum number of active pointers required to trigger the "start" callback.
   * @default 1
   */
  minPointers?: number;

  /**
   * Maximum number of pointers that can be tracked simultaneously.
   * @default 5
   */
  maxPointers?: number;

  /**
   * Disable user selection on drag.
   * @default true
   */
  disableUserSelect?: boolean;
}

export interface IPointersMutableProps extends IModuleMutableProps {
  /**
   * Enables or disables pointer events.
   * @default true
   */
  enabled?: boolean;
}

export interface IPointersCallbacksMap extends IModuleCallbacksMap {
  /**
   * Fired when the required number of pointers is reached.
   */
  start: undefined;

  /**
   * Fired when a pointer is added.
   */
  pointerdown: { event: PointerEvent; pointer: IPointersItem };

  /**
   * Fired when a pointer moves.
   */
  pointermove: { event: PointerEvent; pointer: IPointersItem };

  /**
   * Fired when a pointer is removed.
   */
  pointerup: { pointer: IPointersItem };

  /**
   * Fired when pointer events are canceled.
   */
  end: undefined;
}

export interface IPointersVec2 {
  /** X-coordinate relative to the container. */
  x: number;
  /** Y-coordinate relative to the container. */
  y: number;
}

export interface IPointersItem {
  /** Unique pointer identifier. */
  id: number;
  /** Index assigned to the pointer. */
  index: number;
  /** Coordinates at the start of the interaction. */
  start: IPointersVec2;
  /** Previous recorded coordinates. */
  prev: IPointersVec2;
  /** Current pointer coordinates. */
  current: IPointersVec2;
  /** Movement offset from the starting position. */
  diff: IPointersVec2;
  /** Movement offset from the previous position. */
  step: IPointersVec2;
  /** Total accumulated movement since start. */
  accum: IPointersVec2;
}
