import { ICursorVec2 } from '../global';

/** Point on the cursor path trail, including cumulative path length. */
export interface ICursorPathPoint extends ICursorVec2 {
  length: number;
}
