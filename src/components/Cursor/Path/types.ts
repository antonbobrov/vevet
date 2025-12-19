export interface ICursorPathVec2 {
  x: number;
  y: number;
}

/**
 * Represents the cursor's point on a path.
 */
export interface ICursorPathPoint extends ICursorPathVec2 {
  length: number;
}
