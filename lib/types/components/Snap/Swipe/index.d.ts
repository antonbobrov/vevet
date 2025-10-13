import { Snap } from '..';
import { ISwipeCoords, ISwipeMatrix, Swipe } from '../../../components/Swipe';
export declare class SnapSwipe {
    protected snap: Snap;
    /** Swipe events */
    protected _swipe: Swipe;
    /** Active index on swipe start */
    protected _startIndex: number;
    /** Swipe start time */
    protected _startTime: number;
    constructor(snap: Snap);
    /** Axis name depending on swipe direction */
    get axis(): "x" | "y";
    /** Check if swiping in action */
    get isSwiping(): boolean;
    /** Check if inertia is active */
    get hasInertia(): boolean;
    /** Detect if swipe is short */
    get isShort(): boolean;
    /** Checks if resistance is allowed */
    get allowFriction(): boolean;
    /** Swipe difference between start and current coordinates */
    protected get diff(): number;
    protected _handleVelocityModifier(source: ISwipeMatrix): ISwipeMatrix;
    /**
     * Handles swipe `start` event.
     */
    protected _handleSwipeStart(coords: ISwipeCoords): void;
    /**
     * Handles swipe `move` event.
     */
    protected _handleSwipeMove(coords: ISwipeCoords): void;
    /** Handles swipe `end` event */
    protected _handleSwipeEnd(coords: ISwipeCoords): void;
    /** Handles swipe inertia start */
    protected _handleSwipeInertiaStart(): void;
    /** Handles swipe inertia end */
    protected _handleSwipeInertiaEnd(): void;
    /** Handles swipe inertia fail */
    protected _handleSwipeInertiaFail(): void;
    /** Handles swipe inertia cancel */
    protected _handleSwipeInertiaCancel(): void;
    /** End swipe action */
    protected _end(): void;
    /** End short swipe */
    protected _endShort(): void;
    /** End action when `followSwipe` is disabled */
    protected _endNoFollow(): void;
    /** Destroy swipe */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map