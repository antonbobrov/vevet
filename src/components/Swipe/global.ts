/** 2D vector in swipe coordinate space. */
export interface ISwipeVec2 {
  x: number;
  y: number;
}

/** 3D vector with rotation (`angle` in degrees). */
export interface ISwipeVec3 extends ISwipeVec2 {
  angle: number;
}

/** @deprecated Use {@link ISwipeVec3}. */
export interface ISwipeMatrix extends ISwipeVec3 {}

/** Pointer sample: position plus `time` (ms, `performance.now()`). */
export interface ISwipeState extends ISwipeVec3 {
  time: number;
}

/**
 * Snapshot exposed on swipe callbacks and accessors.
 *
 * Pointer space: `start`, `prev`, `current`, `diff`, `step`, `accum`.
 * Movement space: `movement` (after bounds rubber and snap; use for transforms).
 */
export interface ISwipeCoords {
  /** Last event timestamp (ms). */
  timestamp: number;
  /** Pointer position at swipe start. */
  start: ISwipeState;
  /** Previous pointer position. */
  prev: ISwipeState;
  /** Current pointer position. */
  current: ISwipeState;
  /** Offset from `start` to `current` (angle is accumulated). */
  diff: ISwipeState;
  /** Offset from `prev` to `current`. */
  step: ISwipeState;
  /** Absolute path length since swipe start (`|step|` per axis). */
  accum: ISwipeVec3;
  /** Total displacement in movement space (rubber + snap applied). */
  movement: ISwipeVec3;
  /** Movement on the previous frame (movement space, after rubber and snap). */
  prevMovement: ISwipeVec3;
  /** Current scaling modifier */
  scale: number;
}

/**
 * Optional numeric values per swipe axis (`x`, `y`, `angle`).
 *
 * - `bounds`: each array is normalized to `[min, max]` movement limits.
 * - `snap`: each array lists snap targets in movement space.
 */
export interface ISwipeAxes {
  x?: number[];
  y?: number[];
  angle?: number[];
}
