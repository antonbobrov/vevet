export interface ISnapWheelProps {
  /**
   * Enable or disable mouse wheel events for progress control
   * @default false
   */
  wheel?: boolean;

  /**
   * Speed factor for mouse wheel movements
   * @default 1
   */
  wheelSpeed?: number;

  /**
   * Wheel axis
   * @default 'auto'
   */
  wheelAxis?: 'x' | 'y' | 'auto';

  /**
   * If `false`, disables smooth, continuous scrolling behavior from the mouse wheel
   * and instead updates the snap position in discrete steps (like pagination).
   * @default true
   */
  followWheel?: boolean;

  /**
   * Throttle wheel events, value in milliseconds.
   * Works only if `followWheel` is disabled.
   *
   * - `auto` - value based on transition duration
   * - `number - value in milliseconds
   *
   * @default `auto`
   */
  wheelThrottle?: number | 'auto';

  /**
   * Minimum distance in pixels to trigger snap update. Works only if `followWheel` is disabled.
   * @default 100
   */
  wheelNoFollowThreshold?: number;

  /**
   * Enable snapping on wheel stop. Works with `followWheel` enabled.
   * @default true
   */
  stickOnWheelEnd?: boolean;
}
