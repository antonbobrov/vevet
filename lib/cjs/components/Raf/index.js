"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raf = void 0;
var Module_1 = require("../../base/Module");
__exportStar(require("./types"), exports);
/**
 * Manages an animation frame loop with configurable FPS and playback controls.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Raf)
 *
 * @group Components
 */
var Raf = /** @class */ (function (_super) {
    __extends(Raf, _super);
    function Raf(props) {
        var _this = _super.call(this, props) || this;
        /** Indicates if the animation frame is currently running */
        _this._isPlaying = false;
        /** Active requestAnimationFrame ID, or `null` if not running */
        _this._raf = null;
        /** Timestamp of the last frame */
        _this._lastTimestamp = null;
        /** Timestamp of the current frame */
        _this._timestamp = null;
        /** Current frame index */
        _this._index = 0;
        /** Real-time FPS */
        _this._fps = 60;
        /** Duration of the last frame in ms */
        _this._duration = 0;
        // Initialize FPS
        _this._fps = _this.props.fps === 'auto' ? _this._fps : _this.props.fps;
        // Play on init
        if (_this.props.enabled) {
            _this._play();
        }
        return _this;
    }
    /** Get default static properties */
    Raf.prototype._getStatic = function () {
        return __assign({}, _super.prototype._getStatic.call(this));
    };
    /** Get default mutable properties */
    Raf.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { fps: 'auto', enabled: false, fpsRecalcFrames: 10 });
    };
    Object.defineProperty(Raf.prototype, "isPlaying", {
        /** Playback state of the animation frame */
        get: function () {
            return this._isPlaying;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raf.prototype, "timestamp", {
        /** Timestamp of the current frame */
        get: function () {
            var _a;
            return (_a = this._timestamp) !== null && _a !== void 0 ? _a : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raf.prototype, "index", {
        /** Current frame index */
        get: function () {
            return this._index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raf.prototype, "fps", {
        /** Real-time FPS */
        get: function () {
            return this._fps;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raf.prototype, "duration", {
        /** Duration of the last frame in ms */
        get: function () {
            return this._duration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Raf.prototype, "fpsFactor", {
        /** Scaling coefficient based on a 60 FPS target */
        get: function () {
            return 60 / this.fps;
        },
        enumerable: false,
        configurable: true
    });
    /** Handle property mutations */
    Raf.prototype._handleProps = function () {
        _super.prototype._handleProps.call(this);
        this._lastTimestamp = null;
        if (this.props.enabled) {
            this._play();
        }
        else {
            this._pause();
        }
    };
    /** Start the animation loop */
    Raf.prototype.play = function () {
        if (this.isDestroyed || this.props.enabled) {
            return;
        }
        this.updateProps({ enabled: true });
    };
    /** Internal method to start the loop */
    Raf.prototype._play = function () {
        if (this.isPlaying) {
            return;
        }
        this._isPlaying = true;
        this.callbacks.emit('play', undefined);
        this.callbacks.emit('toggle', undefined);
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
    };
    /** Pause the animation loop */
    Raf.prototype.pause = function () {
        if (!this.props.enabled) {
            return;
        }
        this.updateProps({ enabled: false });
    };
    /** Internal method to pause the loop */
    Raf.prototype._pause = function () {
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
    };
    /** Animation loop handler, calculates FPS, and triggers callbacks */
    Raf.prototype._animate = function () {
        var _a, _b;
        if (!this._isPlaying) {
            return;
        }
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
        var minFrameDuration = this.props.fps === 'auto' ? 1 : 1000 / this.props.fps;
        this._timestamp = performance.now();
        (_a = this._lastTimestamp) !== null && _a !== void 0 ? _a : (this._lastTimestamp = this._timestamp);
        var duration = this._timestamp - ((_b = this._lastTimestamp) !== null && _b !== void 0 ? _b : this._timestamp);
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
    };
    /** Calculate linear interpolation factor to make animations run the same regardless of FPS */
    Raf.prototype.lerpFactor = function (ease) {
        return 1 - Math.exp(-ease * 60 * (this.duration / 1000));
    };
    /** Compute real-time FPS from frame durations */
    Raf.prototype._computeFPS = function () {
        var _a = this, duration = _a.duration, index = _a.index, props = _a.props;
        if ((index > 10 && index % props.fpsRecalcFrames !== 0) ||
            duration <= 0 ||
            duration > 250) {
            return;
        }
        var standardFps = 60;
        var standardFrameTime = 1000 / standardFps;
        var fpsMultiplier = standardFrameTime / duration;
        this._fps = Math.round(60 * fpsMultiplier) || 1;
    };
    /** Destroy the animation frame and stop the loop */
    Raf.prototype._destroy = function () {
        this.pause();
        _super.prototype._destroy.call(this);
    };
    return Raf;
}(Module_1.Module));
exports.Raf = Raf;
//# sourceMappingURL=index.js.map