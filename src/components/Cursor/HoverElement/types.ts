/**
 * Options for {@link Cursor.attachHover}.
 */
export interface ICursorHoverElementProps {
  /** Hoverable DOM element (also receives sticky transforms when `sticky` is on) */
  element: Element;

  /**
   * Element that emits hover events. Defaults to `element`.
   * @default null
   */
  emitter?: Element | null;

  /** Cursor type id to activate on hover (see {@link Cursor.attachCursor}) */
  type?: string;

  /**
   * Debounce for `mouseenter` before treating as hovered, in milliseconds.
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
   * Extra padding added to cursor width/height on hover.
   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 0
   */
  padding?: number | string;

  /**
   * Move the hovered element with the pointer (sticky parallax).
   * @default false
   */
  sticky?: boolean;

  /**
   * Lerp factor for sticky motion. Defaults to the cursor `lerp`.
   * @default this.props.lerp
   */
  stickyLerp?: number;

  /**
   * Pull-back friction while hovering. Higher values resist pointer offset more.
   * Applied continuously toward the element's origin during hover.
   *
   * @default 0
   */
  stickyFriction?: number;

  /**
   * Max sticky offset. Number, CSS length, `'auto'` (element size), or per-axis object.
   * @default 'auto'
   */
  stickyAmplitude?:
    | TCursorHoverElementStickyAmplitude
    | TCursorHoverElementStickyAmplitudeObject;
}

/** Single-axis sticky amplitude: pixels, CSS unit string, or element size. */
export type TCursorHoverElementStickyAmplitude =
  | number
  | 'auto'
  | (string & {});

/** Per-axis sticky amplitude. */
export type TCursorHoverElementStickyAmplitudeObject = {
  x: TCursorHoverElementStickyAmplitude;
  y: TCursorHoverElementStickyAmplitude;
};
