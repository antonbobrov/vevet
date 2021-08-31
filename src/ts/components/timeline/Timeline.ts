import { StaticTimeline, NStaticTimeline } from './StaticTimeline';
import { RequiredModuleProp } from '../../utils/types/utility';
import boundVal from '../../utils/math/boundVal';



export namespace NTimeline {

    /**
     * Static properties
     */
    export interface StaticProp extends NStaticTimeline.StaticProp {
        /**
         * Reset the timeline progress on each finished play & reverse call
         * @default false
         */
        reset?: boolean;
        /**
         * Destroy the timeline on animation end
         * @default false
         */
        destroyOnEnd?: boolean;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NStaticTimeline.ChangeableProp {
        /**
         * Timeline duration
         */
        duration?: number;
    }

    /**
     * Available callbacks
     */
    export interface ProgressArg {
        progress: number;
        easing: number;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NStaticTimeline.CallbacksTypes {
        'start': false;
        'end': false;
    }

}



/**
 * Timeline is an animation helper.
 */
export class Timeline <
    StaticProp extends NTimeline.StaticProp = NTimeline.StaticProp,
    ChangeableProp extends NTimeline.ChangeableProp = NTimeline.ChangeableProp,
    CallbacksTypes extends NTimeline.CallbacksTypes = NTimeline.CallbacksTypes,
> extends StaticTimeline <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    /**
     * Get default properties
     */
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            duration: 1500,
            reset: false,
            destroyOnEnd: false,
        };
    }



    /**
     * Check if timeline is playing
     */
    get isPlaying () {
        return typeof this._animationFrame !== 'undefined';
    }
    protected _isPlaying: boolean;

    /**
     * Check if timeline is reversed
     */
    get isReversed () {
        return this._isReversed;
    }
    protected _isReversed: boolean;

    /**
     * Check if timeline is paused
     */
    get isPaused () {
        return this._isPaused;
    }
    protected _isPaused: boolean;

    /**
     * The animation frame
     */
    protected _animationFrame?: number;
    /**
     * Last time when animationFrame callback has been called
     */
    protected _animationFrameLastTime: number;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // set default variables
        this._isPlaying = false;
        this._isReversed = false;
        this._isPaused = false;
        this._animationFrameLastTime = 0;

        if (init) {
            this.init();
        }
    }



    /**
     * Play the timeline
     */
    public play () {
        if (this._destroyed) {
            return;
        }
        if (this.prop.reset && this.progress === 1) {
            this._progress = 0;
        }
        this._isReversed = false;
        this._isPaused = false;
        if (!this.isPlaying) {
            this._animationFrameLastTime = +new Date();
            this._animate();
        }
    }

    /**
     * Play reversed timeline
     */
    public reverse () {
        if (this._destroyed) {
            return;
        }
        if (this.prop.reset && this.progress === 0) {
            this._progress = 1;
        }
        this._isReversed = true;
        this._isPaused = false;
        if (!this.isPlaying) {
            this._animationFrameLastTime = +new Date();
            this._animate();
        }
    }

    /**
     * Pause animation
     */
    public pause () {
        if (this._destroyed) {
            return;
        }
        this._isPaused = true;
        if (this._animationFrame) {
            window.cancelAnimationFrame(this._animationFrame);
        }
        this._animationFrame = undefined;
    }



    /**
     * Start animation
     */
    protected _animate () {
        // stop if animation is paused
        if (this._isPaused) {
            return;
        }
        const { isReversed } = this;

        // calculate difference between frames
        const currentTime = +new Date();
        const frameDiff = Math.abs(this._animationFrameLastTime - currentTime);
        this._animationFrameLastTime = currentTime;

        // calculate current progress
        const progressIterator = frameDiff / this.prop.duration / (isReversed ? -1 : 1);
        const progressTarget = boundVal(
            this.progress + progressIterator,
            [0, 1],
        );
        this.progress = progressTarget;

        // end animation
        if (
            (progressTarget === 1 && !isReversed)
            || (progressTarget === 0 && isReversed)
        ) {
            this._isReversed = false;
            this._isPaused = false;
            this._animationFrame = undefined;
            return;
        }

        // continue animation
        this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }

    /**
     * Events on progress
     */
    protected _handleProgress () {
        super._handleProgress();

        const progress = this._progress;

        // launch callbacks
        if (progress === 0) {
            this.callbacks.tbt('start', false);
        } else if (progress === 1) {
            this.callbacks.tbt('end', false);
            if (this.prop.destroyOnEnd) {
                this.destroy();
            }
        }
    }



    /**
     * Destroy the timeline
     */
    protected _destroy () {
        this.pause();
        super._destroy();
    }
}
