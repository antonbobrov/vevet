import { Snap } from '..';
export declare class SnapWheel {
    protected _snap: Snap;
    /** Listeners to destruct */
    protected _destructor: () => void;
    /** Detects if wheel event is started */
    protected _hasStarted: boolean;
    /** Debounce wheel end event */
    protected _debounceEnd?: NodeJS.Timeout;
    /** Deltas history */
    protected _deltas: number[];
    /** Last time wheel event was fired */
    protected _lastWheelTime: number;
    constructor(_snap: Snap);
    /** Destroy wheel listeners */
    protected _destroy(): void;
    /** Snap component */
    protected get snap(): Snap<import("..").ISnapCallbacksMap, import("..").ISnapStaticProps, import("..").ISnapMutableProps>;
    /** Get absolute deltas */
    protected get absDeltas(): number[];
    /** Get last wheel time */
    protected get lastWheelTime(): number;
    /**
     * Handles wheel events
     */
    protected _handleWheel(event: WheelEvent): void;
    /** Handle wheel start */
    protected _handleStart(delta: number): void;
    /** Handle wheel move */
    protected _handleMove(delta: number, event: WheelEvent): void;
    /** Handle `followWheel=true` */
    protected _handleFollow(delta: number): void;
    /** Handle `followWheel=false` */
    protected _handleNoFollow(delta: number): void;
    /** Detect if wheel should be throttled */
    protected _detectNoFollowThrottle(): boolean;
    /** Handle wheel end */
    protected _handleEnd(): void;
    /** Save delta */
    protected _addDelta(delta: number): void;
    /** Detect if touchpad */
    protected get isTouchPad(): boolean;
    /** Detects if deltas are stable */
    protected get isStableDelta(): boolean;
    /** Detects if the latest delta is small */
    protected get isSmallDelta(): boolean;
    /** Detect if delta is gaining its value */
    protected get isGainingDelta(): boolean;
    /** Get average value in an array */
    protected _getAverage(array: number[]): number;
}
//# sourceMappingURL=index.d.ts.map