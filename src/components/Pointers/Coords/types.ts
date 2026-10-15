import { IPointersVec2 } from '../global';

export interface IPointersMove {
  /** Average of `current` positions. */
  center: IPointersVec2;
  /** Average of `prev` positions. */
  prevCenter: IPointersVec2;
  /** Center at the first `move` after `start`. */
  startCenter: IPointersVec2;
  /** Current span between pointers (px). */
  distance: number;
  /** Span on the previous `move`. */
  prevDistance: number;
  /** Span at the first `move` after `start`. */
  startDistance: number;
  /** Multiplier since gesture start: `distance / startDistance`. */
  scale: number;
  /** Previous multiplier since gesture start. */
  prevScale: number;
  /** Cumulative rotation since gesture start (deg). */
  angle: number;
  /** Previous cumulative rotation (deg). */
  prevAngle: number;
}
