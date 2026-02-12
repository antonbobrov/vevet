export interface ISwipeVec2 {
  x: number;
  y: number;
}

export interface ISwipeMatrix extends ISwipeVec2 {
  angle: number;
}

export interface ISwipeCoords {
  /** Event timestamp. */
  timestamp: number;
  /** Start position. */
  start: ISwipeMatrix;
  /** Previous position. */
  prev: ISwipeMatrix;
  /** Current position. */
  current: ISwipeMatrix;
  /** Movement offset from start. */
  diff: ISwipeMatrix;
  /** Movement offset from previous position. */
  step: ISwipeMatrix;
  /** Total accumulated movement. */
  accum: ISwipeVec2;
}

export interface ISwipeVelocity extends ISwipeMatrix {
  timestamp: number;
}
