import { IPointersVec2 } from '../global';

export interface IPointersItem {
  /** Unique pointer identifier. */
  id: number;
  /** Index assigned to the pointer. */
  index: number;
  /** Coordinates at the start of the interaction. */
  start: IPointersVec2;
  /** Previous recorded coordinates. */
  prev: IPointersVec2;
  /** Current pointer coordinates. */
  current: IPointersVec2;
  /** Movement offset from the starting position. */
  diff: IPointersVec2;
  /** Movement offset from the previous position. */
  step: IPointersVec2;
  /** Total accumulated movement since start. */
  accum: IPointersVec2;
}
