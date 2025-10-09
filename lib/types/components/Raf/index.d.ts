import { TRequiredProps } from '../../internal/requiredProps';
import { Module } from '../../base/Module';
import { IRafCallbacksMap, IRafMutableProps, IRafStaticProps } from './types';
export * from './types';
/**
 * Manages an animation frame loop with configurable FPS and playback controls.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Raf)
 *
 * @group Components
 */
export declare class Raf<CallbacksMap extends IRafCallbacksMap = IRafCallbacksMap, StaticProps extends IRafStaticProps = IRafStaticProps, MutableProps extends IRafMutableProps = IRafMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /** Get default static properties */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Get default mutable properties */
    _getMutable(): TRequiredProps<MutableProps>;
    /** Indicates if the animation frame is currently running */
    protected _isPlaying: boolean;
    /** Playback state of the animation frame */
    get isPlaying(): boolean;
    /** Active requestAnimationFrame ID, or `null` if not running */
    protected _raf: number | null;
    /** Timestamp of the last frame */
    protected _lastTimestamp: null | number;
    /** Timestamp of the current frame */
    protected _timestamp: null | number;
    /** Timestamp of the current frame */
    get timestamp(): number;
    /** Current frame index */
    protected _index: number;
    /** Current frame index */
    get index(): number;
    /** Real-time FPS */
    protected _fps: number;
    /** Real-time FPS */
    get fps(): number;
    /** Duration of the last frame in ms */
    protected _duration: number;
    /** Duration of the last frame in ms */
    get duration(): number;
    /** Scaling coefficient based on a 60 FPS target */
    get fpsFactor(): number;
    constructor(props?: StaticProps & MutableProps);
    /** Handle property mutations */
    protected _handleProps(): void;
    /** Start the animation loop */
    play(): void;
    /** Internal method to start the loop */
    protected _play(): void;
    /** Pause the animation loop */
    pause(): void;
    /** Internal method to pause the loop */
    protected _pause(): void;
    /** Animation loop handler, calculates FPS, and triggers callbacks */
    protected _animate(): void;
    /** Calculate linear interpolation factor to make animations run the same regardless of FPS */
    lerpFactor(ease: number): number;
    /** Compute real-time FPS from frame durations */
    protected _computeFPS(): void;
    /** Destroy the animation frame and stop the loop */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map