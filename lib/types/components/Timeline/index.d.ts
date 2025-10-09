import { TRequiredProps } from '../../internal/requiredProps';
import { Module } from '../../base/Module';
import { ITimelineCallbacksMap, ITimelineMutableProps, ITimelineStaticProps } from './types';
export * from './types';
/**
 * A timeline class for managing animations with easing and precise progress control.
 * It provides methods for playing, reversing, pausing, and resetting the timeline.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Timeline)
 *
 * @group Components
 */
export declare class Timeline<CallbacksMap extends ITimelineCallbacksMap = ITimelineCallbacksMap, StaticProps extends ITimelineStaticProps = ITimelineStaticProps, MutableProps extends ITimelineMutableProps = ITimelineMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /** Get default static properties. */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Get default mutable properties. */
    _getMutable(): TRequiredProps<MutableProps>;
    /** Current linear progress of the timeline (0 to 1). */
    protected _progress: number;
    /**
     * Get or set the linear progress of the timeline.
     * Setting this triggers an update and associated callbacks.
     */
    get progress(): number;
    set progress(val: number);
    /** Current eased progress of the timeline (after applying easing function). */
    protected _eased: number;
    /**
     * Get the eased progress of the timeline, derived from the easing function.
     */
    get eased(): number;
    /** Stores the ID of the current animation frame request. */
    protected _raf?: number;
    /** Stores the timestamp of the last frame update. */
    protected _time: number;
    /**
     * Whether the timeline is currently playing.
     */
    get isPlaying(): boolean;
    /** Indicates whether the timeline is currently reversed. */
    protected _isReversed: boolean;
    /**
     * Whether the timeline is reversed (progress decreases over time).
     */
    get isReversed(): boolean;
    /** Indicates whether the timeline is paused. */
    protected _isPaused: boolean;
    /**
     * Whether the timeline is paused.
     */
    get isPaused(): boolean;
    /**
     * Get the timeline duration, ensuring it is at least 0 ms.
     */
    get duration(): number;
    constructor(props?: StaticProps & MutableProps);
    /**
     * Play the timeline, advancing progress toward completion.
     * Does nothing if the timeline is destroyed or already completed.
     */
    play(): void;
    /**
     * Reverse the timeline, moving progress toward the start.
     * Does nothing if the timeline is destroyed or already at the start.
     */
    reverse(): void;
    /**
     * Pause the timeline, halting progress without resetting it.
     */
    pause(): void;
    /**
     * Reset the timeline to the beginning (progress = 0).
     */
    reset(): void;
    /**
     * Animate the timeline, updating progress based on elapsed time.
     */
    protected _animate(): void;
    /**
     * Handle progress updates and trigger callbacks.
     */
    protected _onUpdate(): void;
    /**
     * Destroy the timeline, stopping any active animation and cleaning up resources.
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map