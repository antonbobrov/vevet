/**
 * Information about the currently hovered element affecting cursor behavior.
 */
export interface ICursorHoverElementProps {
  /** Hoverable DOM element */
  element: Element;

  /**
   * Hover events emitter. If not provided, the element itself will be used
   * @default null
   */
  emitter?: Element | null;

  /** Cursor type to activate on hover */
  type?: string;

  /**
   * Debounce time for hover events, in milliseconds
   * @default 16
   */
  hoverDebounce?: number;

  /**
   * Snap cursor to the element center.
   * Does not work with `behavior: "path"`.
   * @default false
   */
  snap?: boolean;

  /**
   * Target cursor width on hover.
   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default null
   */
  width?: null | number | 'auto' | (string & {});

  /**
   * Target cursor height on hover.
   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default null
   */
  height?: null | number | 'auto' | (string & {});

  /**
   * Padding applied around the cursor.
   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 0
   */
  padding?: number | string;

  /**
   * Enable sticky behavior for the hovered element.
   * @default false
   */
  sticky?: boolean;

  /**
   * Linear interpolation factor for smooth sticky animation.
   * @default this.props.lerp
   */
  stickyLerp?: number;

  /**
   * Friction factor for smooth sticky animation.
   * Friction is applied during hover and will tend the element to its original position.
   * The higher value the more resistance is applied.
   *
   * @default 0
   */
  stickyFriction?: number;

  /**
   * Sticky animation amplitude.
   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 'auto'
   */
  stickyAmplitude?:
    | TCursorHoverElementStickyAmplitude
    | TCursorHoverElementStickyAmplitudeObject;
}

export type TCursorHoverElementStickyAmplitude =
  | number
  | 'auto'
  | (string & {});

export type TCursorHoverElementStickyAmplitudeObject = {
  x: TCursorHoverElementStickyAmplitude;
  y: TCursorHoverElementStickyAmplitude;
};

export type TCursorHoverElementStickyParallax = {
  current: number;
  target: number;
  prevTarget: null | number;
};
