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
   * If disabled, then slider will be animated only when you stop scrolling the wheel.
   * @default true
   */
  followWheel?: boolean;
}
