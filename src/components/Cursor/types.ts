import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module';

export interface ICursorStaticProps extends IModuleStaticProps {
  /**
   * The container where the custom cursor is active.
   * Use `window` for full-window activation.
   * @default window
   */
  container?: Element | Window;

  /**
   * Hides the native cursor if set to `true`.
   * @default false
   */
  hideNative?: boolean;

  /**
   * Cursor behavior
   * @default 'default'
   */
  behavior?: 'default' | 'path';

  /**
   * Modifier for the cursor transform.
   * @default (coords) => `translate(${coords.x}px, ${coords.y}px)`
   */
  transformModifier?: (coords: ICursorFullCoords) => string;
}

export interface ICursorMutableProps extends IModuleMutableProps {
  /**
   * Enables or disables the custom cursor interactions.
   * @default true
   */
  enabled?: boolean;

  /**
   * The initial width of the custom cursor.
   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 50
   */
  width?: number | string;

  /**
   * The initial height of the custom cursor.
   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 50
   */
  height?: number | string;

  /**
   * Linear interpolation factor for smooth cursor movement.
   * The value must be between `0` and `1`, with higher values indicating faster movement.
   * @default 0.2
   */
  lerp?: number;

  /**
   * Stops rendering the cursor automatically when its coordinates and size
   * closely match the target values.
   * @default true
   */
  autoStop?: boolean;
}

/**
 * Callback types for the custom cursor component.
 */
export interface ICursorCallbacksMap extends IModuleCallbacksMap {
  /**
   * Triggered on each render to update the cursor's position.
   */
  render: undefined;
}

/**
 * Represents the cursor's target position, angle and velocity.
 */
export interface ICursorTargetCoords {
  x: number;
  y: number;
  angle: number;
  velocity: number;
}

/**
 * Represents the cursor's coordinates, angle and size.
 */
export interface ICursorFullCoords extends ICursorTargetCoords {
  width: number;
  height: number;
}

/**
 * Information about the currently hovered element affecting cursor behavior.
 */
export interface ICursorType {
  /**
   * The currently hovered element.
   */
  element: Element;

  /** Cursor type */
  type: string;
}
