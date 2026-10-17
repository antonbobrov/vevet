import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';

import { TRafEase } from '../Raf/types';

import { CursorHoverElement } from './HoverElement';
import { ICursorType } from './Type/types';

export type { ICursorType, CursorHoverElement };

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
   * Appends the custom cursor to the container. Use `false` if you need only cursor logic and interactions.
   * @default true
   */
  append?: boolean;

  /**
   * Motion mode: direct follow (`'default'`) or SVG path trail (`'path'`).
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
   * Base ease for Raf interpolation ({@link TRafEase}: damp `number` or spring).
   * Used when channel eases are `'auto'`.
   * When unset, falls back to {@link lerp}.
   */
  ease?: TRafEase;

  /**
   * @deprecated Use {@link ease} instead.
   * @default 0.2
   */
  lerp?: TRafEase;

  /**
   * Ease for cursor `x` / `y` (and path length when `behavior` is `'path'`).
   * `'auto'` uses {@link ease}. Path mode requires a numeric ease (non-number
   * falls back to `0.1` with a warning).
   * @default 'auto'
   */
  easeCoords?: TRafEase | 'auto';

  /**
   * Ease for cursor `width` / `height`.
   * `'auto'` uses {@link ease}.
   * @default 'auto'
   */
  easeSize?: TRafEase | 'auto';

  /**
   * Ease for cursor `angle`.
   * `'auto'` uses {@link ease}.
   * @default 'auto'
   */
  easeAngle?: TRafEase | 'auto';

  /**
   * Ease for cursor `velocity` (also used as friction when pulling velocity toward `0`).
   * `'auto'` uses {@link ease}.
   * @default 'auto'
   */
  easeVelocity?: TRafEase | 'auto';

  /**
   * Pauses the Raf loop when all named entries have settled within their `appx`.
   * @default true
   */
  autoStop?: boolean;
}

/**
 * Callback types for the custom cursor component.
 */
export interface ICursorCallbacksMap extends IModuleCallbacksMap<ICursorMutableProps> {
  /**
   * Triggered on each render to update the cursor's position.
   */
  render: undefined;

  /**
   * Triggered when an attached element is hovered.
   */
  hoverEnter: CursorHoverElement;

  /**
   * Triggered when an attached element is no longer hovered.
   */
  hoverLeave: CursorHoverElement;

  /**
   * Triggered when a cursor type is visible.
   */
  typeShow: ICursorType;

  /**
   * Triggered when a cursor type becomes invisible.
   */
  typeHide: ICursorType;

  /**
   * Triggered when no cursor type is applied.
   */
  noType: undefined;
}

/** Cursor target position, angle, and velocity (pre-smoothing). */
export interface ICursorTargetCoords {
  x: number;
  y: number;
  angle: number;
  velocity: number;
}

/** Smoothed cursor coordinates including size. */
export interface ICursorFullCoords extends ICursorTargetCoords {
  width: number;
  height: number;
}
