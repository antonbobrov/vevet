import { Module } from '../../base/Module';
export * from './types';
/**
 * Manages an animation frame loop with configurable FPS and playback controls.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Raf)
 *
 * @group Components
 */
export class Raf extends Module {
    /** Get default static properties */
    _getStatic() {
        return Object.assign({}, super._getStatic());
    }
    /** Get default mutable properties */
    _getMutable() {
        return Object.assign(Object.assign({}, super._getMutable()), { fps: 'auto', enabled: false, fpsRecalcFrames: 10 });
    }
    /** Playback state of the animation frame */
    get isPlaying() {
        return this._isPlaying;
    }
    /** Timestamp of the current frame */
    get timestamp() {
        var _a;
        return (_a = this._timestamp) !== null && _a !== void 0 ? _a : 0;
    }
    /** Current frame index */
    get index() {
        return this._index;
    }
    /** Real-time FPS */
    get fps() {
        return this._fps;
    }
    /** Duration of the last frame in ms */
    get duration() {
        return this._duration;
    }
    /** Scaling coefficient based on a 60 FPS target */
    get fpsFactor() {
        return 60 / this.fps;
    }
    constructor(props) {
        super(props);
        /** Indicates if the animation frame is currently running */
        this._isPlaying = false;
        /** Active requestAnimationFrame ID, or `null` if not running */
        this._raf = null;
        /** Timestamp of the last frame */
        this._lastTimestamp = null;
        /** Timestamp of the current frame */
        this._timestamp = null;
        /** Current frame index */
        this._index = 0;
        /** Real-time FPS */
        this._fps = 60;
        /** Duration of the last frame in ms */
        this._duration = 0;
        // Initialize FPS
        this._fps = this.props.fps === 'auto' ? this._fps : this.props.fps;
        // Play on init
        if (this.props.enabled) {
            this._play();
        }
    }
    /** Handle property mutations */
    _handleProps() {
        super._handleProps();
        this._lastTimestamp = null;
        if (this.props.enabled) {
            this._play();
        }
        else {
            this._pause();
        }
    }
    /** Start the animation loop */
    play() {
        if (this.isDestroyed || this.props.enabled) {
            return;
        }
        this.updateProps({ enabled: true });
    }
    /** Internal method to start the loop */
    _play() {
        if (this.isPlaying) {
            return;
        }
        this._isPlaying = true;
        this.callbacks.emit('play', undefined);
        this.callbacks.emit('toggle', undefined);
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
    }
    /** Pause the animation loop */
    pause() {
        if (!this.props.enabled) {
            return;
        }
        this.updateProps({ enabled: false });
    }
    /** Internal method to pause the loop */
    _pause() {
        if (!this.isPlaying) {
            return;
        }
        if (this._raf) {
            window.cancelAnimationFrame(this._raf);
            this._raf = null;
        }
        this._isPlaying = false;
        this.callbacks.emit('pause', undefined);
        this.callbacks.emit('toggle', undefined);
    }
    /** Animation loop handler, calculates FPS, and triggers callbacks */
    _animate() {
        var _a, _b;
        if (!this._isPlaying) {
            return;
        }
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
        const minFrameDuration = this.props.fps === 'auto' ? 1 : 1000 / this.props.fps;
        this._timestamp = performance.now();
        (_a = this._lastTimestamp) !== null && _a !== void 0 ? _a : (this._lastTimestamp = this._timestamp);
        const duration = this._timestamp - ((_b = this._lastTimestamp) !== null && _b !== void 0 ? _b : this._timestamp);
        if (duration < minFrameDuration) {
            return;
        }
        this._duration = duration;
        this._lastTimestamp = this._timestamp;
        this._index += 1;
        this._computeFPS();
        this.callbacks.emit('frame', {
            fps: this.fps,
            fpsFactor: this.fpsFactor,
            duration: this.duration,
            lerpFactor: this.lerpFactor.bind(this),
        });
    }
    /** Calculate linear interpolation factor to make animations run the same regardless of FPS */
    lerpFactor(ease) {
        return 1 - Math.exp(-ease * 60 * (this.duration / 1000));
    }
    /** Compute real-time FPS from frame durations */
    _computeFPS() {
        const { duration, index, props } = this;
        if ((index > 10 && index % props.fpsRecalcFrames !== 0) ||
            duration <= 0 ||
            duration > 250) {
            return;
        }
        const standardFps = 60;
        const standardFrameTime = 1000 / standardFps;
        const fpsMultiplier = standardFrameTime / duration;
        this._fps = Math.round(60 * fpsMultiplier) || 1;
    }
    /** Destroy the animation frame and stop the loop */
    _destroy() {
        this.pause();
        super._destroy();
    }
}
//# sourceMappingURL=index.js.map