import { Module } from '../../base';
import { TRequiredProps } from '../../internal/requiredProps';
import { ISwipeCallbacksMap, ISwipeVec2, ISwipeMatrix, ISwipeCoords, ISwipeMutableProps, ISwipeStaticProps, ISwipeVelocity } from './types';
import { Pointers } from '../Pointers';
import { Timeline } from '../Timeline';
export * from './types';
/**
 * Manages swipe interactions:
 * - Tracks movement and detects direction
 * - Emits events on start, move, and end
 * - Supports inertia-based movement
 *
 * Notes:
 * - Does not transform elements, only computes coordinates.
 * - Does not persist state after swipe completion.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Swipe)
 *
 * @group Components
 */
export declare class Swipe<CallbacksMap extends ISwipeCallbacksMap = ISwipeCallbacksMap, StaticProps extends ISwipeStaticProps = ISwipeStaticProps, MutableProps extends ISwipeMutableProps = ISwipeMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /**
     * Returns default static properties.
     */
    _getStatic(): TRequiredProps<StaticProps>;
    /**
     * Returns default mutable properties.
     */
    _getMutable(): TRequiredProps<MutableProps>;
    /** Pointer event manager */
    protected _pointers: Pointers;
    /** If swiping has started */
    protected _isSwiping: boolean;
    /** If swiping has been aborted */
    protected _isAborted: boolean;
    /** Indicates if a swipe is active */
    get isSwiping(): boolean;
    /** Initial swipe coordinates (internal use) */
    protected _startCoord: ISwipeVec2 | undefined;
    /** Swipe start time */
    protected _startTime: number | undefined;
    /** Swipe tracking data */
    protected _coords: ISwipeCoords;
    /** Returns current swipe coordinates */
    get coords(): ISwipeCoords;
    /** Event target element */
    get container(): HTMLElement | SVGElement;
    /** Velocity tracking */
    protected _velocities: ISwipeVelocity[];
    /** Inertia animation */
    protected _inertia?: Timeline;
    /** Indicates if inertia is active */
    get hasInertia(): boolean;
    /** Cursor styles */
    protected _cursorStyles: HTMLStyleElement;
    constructor(props?: StaticProps & MutableProps);
    /** Handles property updates */
    protected _handleProps(): void;
    /** Applies touch-action and cursor styles */
    protected _setInlineStyles(): void;
    /** Handles `touchstart` events */
    protected _handleTouchStart(event: TouchEvent): void;
    /** Prevents edge swipes if enabled */
    protected _preventEdgeSwipe(event: TouchEvent): void;
    /** Handles swipe start and tracking */
    protected _handlePointersStart(): void;
    /** Handles `touchmove` event */
    protected _handleTouchMove(event: TouchEvent): void;
    /** Handles `mousemove` event */
    protected _handleMouseMove(event: MouseEvent): void;
    /** Parses pointer coordinates relative to the container */
    protected _decodeCoords(event: MouseEvent | TouchEvent): ISwipeMatrix;
    /** Handles move events */
    protected _handleMove(matrix: ISwipeMatrix, type: 'touch' | 'mouse'): void;
    /** Handles move events */
    protected _move({ x, y, angle }: ISwipeMatrix): void;
    /** Handles swipe end */
    protected _handleEnd(): void;
    /** Reset swipe states */
    protected _reset(): void;
    /** Returns current velocity */
    protected get velocity(): ISwipeMatrix;
    /** Apply inertia-based movement */
    protected _endWithInertia(): void;
    /** Destroy inertia animation */
    cancelInertia(): void;
    /** Start coordinate */
    get start(): ISwipeMatrix;
    /** Previous coordinate */
    get prev(): ISwipeMatrix;
    /** Current coordinate */
    get current(): ISwipeMatrix;
    /** Difference between start and current coordinates */
    get diff(): ISwipeMatrix;
    /** Difference between start and previous coordinates */
    get step(): ISwipeMatrix;
    /** Accumulated movement */
    get accum(): ISwipeVec2;
    /**
     * Destroys the component
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map