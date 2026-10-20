/** Unwrapped angle state for cumulative rotation. */
export interface ISwipeDecodeAngle {
  /** Last raw atan2 angle in degrees (−180…180). */
  raw: number;
  /** Cumulative unwrapped angle in degrees. */
  unwrapped: number;
}
