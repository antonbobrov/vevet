import { Module } from '../../base/Module';
import { clamp, easing } from '../../utils/math';
import { initVevet } from '../../global/initVevet';
export * from './types';
/**
 * A timeline class for managing animations with easing and precise progress control.
 * It provides methods for playing, reversing, pausing, and resetting the timeline.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Timeline)
 *
 * @group Components
 */
export class Timeline extends Module {
    /** Get default static properties. */
    _getStatic() {
        return Object.assign({}, super._getStatic());
    }
    /** Get default mutable properties. */
    _getMutable() {
        return Object.assign(Object.assign({}, super._getMutable()), { easing: initVevet().props.easing, duration: 1000 });
    }
    /**
     * Get or set the linear progress of the timeline.
     * Setting this triggers an update and associated callbacks.
     */
    get progress() {
        return this._progress;
    }
    set progress(val) {
        this._progress = clamp(val);
        this._onUpdate();
    }
    /**
     * Get the eased progress of the timeline, derived from the easing function.
     */
    get eased() {
        return this._eased;
    }
    /**
     * Whether the timeline is currently playing.
     */
    get isPlaying() {
        return typeof this._raf !== 'undefined';
    }
    /**
     * Whether the timeline is reversed (progress decreases over time).
     */
    get isReversed() {
        return this._isReversed;
    }
    /**
     * Whether the timeline is paused.
     */
    get isPaused() {
        return this._isPaused;
    }
    /**
     * Get the timeline duration, ensuring it is at least 0 ms.
     */
    get duration() {
        return Math.max(this.props.duration, 0);
    }
    constructor(props) {
        super(props);
        // Initialize default values
        this._progress = 0;
        this._eased = 0;
        this._raf = undefined;
        this._time = 0;
        this._isReversed = false;
        this._isPaused = false;
    }
    /**
     * Play the timeline, advancing progress toward completion.
     * Does nothing if the timeline is destroyed or already completed.
     */
    play() {
        if (this.isDestroyed || this.progress === 1) {
            return;
        }
        this._isReversed = false;
        this._isPaused = false;
        if (!this.isPlaying) {
            this._time = Date.now();
            this._animate();
        }
    }
    /**
     * Reverse the timeline, moving progress toward the start.
     * Does nothing if the timeline is destroyed or already at the start.
     */
    reverse() {
        if (this.isDestroyed || this.progress === 0) {
            return;
        }
        this._isReversed = true;
        this._isPaused = false;
        if (!this.isPlaying) {
            this._time = Date.now();
            this._animate();
        }
    }
    /**
     * Pause the timeline, halting progress without resetting it.
     */
    pause() {
        if (this.isDestroyed) {
            return;
        }
        this._isPaused = true;
        if (this._raf) {
            window.cancelAnimationFrame(this._raf);
        }
        this._raf = undefined;
    }
    /**
     * Reset the timeline to the beginning (progress = 0).
     */
    reset() {
        if (this.isDestroyed) {
            return;
        }
        this.pause();
        this.progress = 0;
    }
    /**
     * Animate the timeline, updating progress based on elapsed time.
     */
    _animate() {
        if (this.isPaused) {
            return;
        }
        const { isReversed, duration } = this;
        if (duration <= 0) {
            this.progress = isReversed ? 1 : 0;
            this.progress = isReversed ? 0 : 1;
            return;
        }
        const currentTime = Date.now();
        const frameDiff = Math.abs(this._time - currentTime);
        this._time = currentTime;
        const progressIterator = frameDiff / duration / (isReversed ? -1 : 1);
        const progressTarget = this.progress + progressIterator;
        this.progress = progressTarget;
        if ((this.progress === 1 && !isReversed) ||
            (this.progress === 0 && isReversed)) {
            this._isReversed = false;
            this._isPaused = false;
            this._raf = undefined;
            return;
        }
        this._raf = window.requestAnimationFrame(() => this._animate());
    }
    /**
     * Handle progress updates and trigger callbacks.
     */
    _onUpdate() {
        this._eased = easing(this._progress, this.props.easing);
        this.callbacks.emit('update', {
            progress: this._progress,
            eased: this._eased,
        });
        if (this.progress === 0) {
            this.callbacks.emit('start', undefined);
            return;
        }
        if (this.progress === 1) {
            this.callbacks.emit('end', undefined);
        }
    }
    /**
     * Destroy the timeline, stopping any active animation and cleaning up resources.
     */
    _destroy() {
        this.pause();
        super._destroy();
    }
}
//# sourceMappingURL=index.js.map