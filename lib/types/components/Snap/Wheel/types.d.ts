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
     * - `auto` - automatic detection when `wheel` is enabled
     * - `number - value in milliseconds
     *
     * @default `auto`
     */
    wheelThrottle?: number | 'auto';
    /**
     * Enable snapping on wheel stop. Works with `followWheel` enabled.
     * @default true
     */
    stickOnWheelEnd?: boolean;
    /**
     * Snapping threshold for `stickOnWheelEnd`
     * @default 30
     */
    stickOnWheelEndThreshold?: number;
}
//# sourceMappingURL=types.d.ts.map