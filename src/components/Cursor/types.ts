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
}

export interface ICursorMutableProps extends IModuleMutableProps {
  /**
   * Enables or disables the custom cursor interactions.
   * @default true
   */
  enabled?: boolean;

  /**
   * The initial width of the custom cursor.
   * @default 50
   */
  width?: number;

  /**
   * The initial height of the custom cursor.
   * @default 50
   */
  height?: number;

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
 * Represents the cursor's point on a path.
 */
export interface ICursorPathPoint {
  x: number;
  y: number;
  length: number;
}

/**
 * Represents the cursor's position and size.
 */
export interface ICursorFullCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Information about the currently hovered element affecting cursor behavior.
 */
export interface ICursorHoveredElement {
  /**
   * The currently hovered element.
   */
  element: Element;

  /** Cursor type */
  type?: string;

  /**
   * Indicates whether the hover state snaps to the element center.
   */
  snap?: boolean;

  /**
   * Target width of the cursor while hovering over this element.
   * @default null
   */
  width?: null | number | 'auto';

  /**
   * Target height of the cursor while hovering over this element.
   * @default null
   */
  height?: null | number | 'auto';

  /**
   * Padding around the cursor while hovering over this element.
   */
  padding?: number;
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
