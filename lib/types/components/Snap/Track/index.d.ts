import { Snap } from '..';
export declare class SnapTrack {
    protected snap: Snap;
    constructor(snap: Snap);
    /** The current track value */
    protected _current: number;
    /** The target track value */
    protected _target: number;
    /** Gets the current track value. */
    get current(): number;
    /** Sets the current track value */
    set current(value: number);
    /** Gets the target track value. */
    get target(): number;
    /** Sets the target track value */
    set target(value: number);
    /** Set a value to current & target value instantly */
    set(value: number): void;
    /** If can loop */
    get canLoop(): boolean;
    /** Get looped current value */
    get loopedCurrent(): number;
    /** Get track offset */
    get offset(): number;
    /** Get loop count */
    get loopCount(): number;
    /** Loop a coordinate if can loop */
    loopCoord(coord: number): number;
    /** Interpolate the current track value */
    lerp(factor: number): void;
    /** Whether the track is interpolated */
    get isInterpolated(): boolean;
    /** Get minimum track value */
    get min(): number;
    /** Get maximum track value */
    get max(): number;
    /** Get track progress. From 0 to 1 if not loop. From -Infinity to Infinity if loop */
    get progress(): number;
    /** Iterate track target value */
    iterateTarget(delta: number): void;
    /** Clamp target value between min and max values */
    clampTarget(): void;
    /** If the start has been reached */
    get isStart(): boolean;
    /** If the end has been reached */
    get isEnd(): boolean;
    /** Check if the active slide is larger than the container and is being scrolled */
    get isSlideScrolling(): boolean;
}
//# sourceMappingURL=index.d.ts.map