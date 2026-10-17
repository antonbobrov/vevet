import { Raf } from '@/components/Raf';
import { TRafEase } from '@/components/Raf/types';

import type { CursorHoverElement } from '.';

/** @internal Wiring for {@link CursorHoverElement}. */
export interface ICursorHoverElementData {
  settings: ICursorHoverElementProps;
  raf: Raf;
  onEnter: (element: CursorHoverElement) => void;
  onLeave: (element: CursorHoverElement) => void;
}

/**
 * Options for {@link Cursor.attachHover}.
 */
export interface ICursorHoverElementProps {
  /** Hoverable DOM element (also receives sticky transforms when `sticky` is on) */
  element: Element;

  /**
   * Element that emits hover events.
   * @default the {@link element} itself
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
   * Ease for sticky offset interpolation (`number` damp or spring).
   * @default Cursor {@link ICursorMutableProps.ease} / `lerp`
   */
  ease?: TRafEase;

  /**
   * @deprecated Use {@link ease} instead.
   */
  stickyLerp?: number;

  /**
   * Sticky pull-back toward the origin while friction is active (`0`–`1`).
   * Higher values snap back faster. `0` disables friction.
   * @default 0
   */
  friction?: number;

  /**
   * @deprecated Use {@link friction} instead.
   */
  stickyFriction?: number;

  /**
   * Sticky parallax amplitude (uniform or per axis).
   * `'auto'` uses the hovered element size on that axis.
   * @default 'auto'
   */
  amp?:
    | TCursorHoverElementStickyAmplitude
    | TCursorHoverElementStickyAmplitudeObject;

  /**
   * @deprecated Use {@link amp} instead.
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
