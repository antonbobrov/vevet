export interface ISwipeVec2 {
  x: number;
  y: number;
}

export interface ISwipeVec3 extends ISwipeVec2 {
  angle: number;
}

/** @deprecated */
export interface ISwipeMatrix extends ISwipeVec3 {}

export interface ISwipeState extends ISwipeVec3 {
  time: number;
}

export interface ISwipeCoords {
  /** Start position. */
  start: ISwipeState;
  /** Previous position. */
  prev: ISwipeState;
  /** Current position. */
  current: ISwipeState;
  /** Movement offset from start. */
  diff: ISwipeState;
  /** Movement offset from previous position. */
  step: ISwipeState;
  /** Absolute path length since swipe start (`|step|` per axis). */
  accum: ISwipeVec3;
  /** Applied movement since instance init (after rubber, same space as `step`). */
  total: ISwipeVec3;
}

export interface ISwipeBounds {
  x?: number[];
  y?: number[];
  angle?: number[];
}
