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
exports.Timeline = void 0;
var Module_1 = require("../../base/Module");
var math_1 = require("../../utils/math");
var initVevet_1 = require("../../global/initVevet");
__exportStar(require("./types"), exports);
/**
 * A timeline class for managing animations with easing and precise progress control.
 * It provides methods for playing, reversing, pausing, and resetting the timeline.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Timeline)
 *
 * @group Components
 */
var Timeline = /** @class */ (function (_super) {
    __extends(Timeline, _super);
    function Timeline(props) {
        var _this = _super.call(this, props) || this;
        // Initialize default values
        _this._progress = 0;
        _this._eased = 0;
        _this._raf = undefined;
        _this._time = 0;
        _this._isReversed = false;
        _this._isPaused = false;
        return _this;
    }
    /** Get default static properties. */
    Timeline.prototype._getStatic = function () {
        return __assign({}, _super.prototype._getStatic.call(this));
    };
    /** Get default mutable properties. */
    Timeline.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { easing: (0, initVevet_1.initVevet)().props.easing, duration: 1000 });
    };
    Object.defineProperty(Timeline.prototype, "progress", {
        /**
         * Get or set the linear progress of the timeline.
         * Setting this triggers an update and associated callbacks.
         */
        get: function () {
            return this._progress;
        },
        set: function (val) {
            this._progress = (0, math_1.clamp)(val);
            this._onUpdate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "eased", {
        /**
         * Get the eased progress of the timeline, derived from the easing function.
         */
        get: function () {
            return this._eased;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "isPlaying", {
        /**
         * Whether the timeline is currently playing.
         */
        get: function () {
            return typeof this._raf !== 'undefined';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "isReversed", {
        /**
         * Whether the timeline is reversed (progress decreases over time).
         */
        get: function () {
            return this._isReversed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "isPaused", {
        /**
         * Whether the timeline is paused.
         */
        get: function () {
            return this._isPaused;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "duration", {
        /**
         * Get the timeline duration, ensuring it is at least 0 ms.
         */
        get: function () {
            return Math.max(this.props.duration, 0);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Play the timeline, advancing progress toward completion.
     * Does nothing if the timeline is destroyed or already completed.
     */
    Timeline.prototype.play = function () {
        if (this.isDestroyed || this.progress === 1) {
            return;
        }
        this._isReversed = false;
        this._isPaused = false;
        if (!this.isPlaying) {
            this._time = Date.now();
            this._animate();
        }
    };
    /**
     * Reverse the timeline, moving progress toward the start.
     * Does nothing if the timeline is destroyed or already at the start.
     */
    Timeline.prototype.reverse = function () {
        if (this.isDestroyed || this.progress === 0) {
            return;
        }
        this._isReversed = true;
        this._isPaused = false;
        if (!this.isPlaying) {
            this._time = Date.now();
            this._animate();
        }
    };
    /**
     * Pause the timeline, halting progress without resetting it.
     */
    Timeline.prototype.pause = function () {
        if (this.isDestroyed) {
            return;
        }
        this._isPaused = true;
        if (this._raf) {
            window.cancelAnimationFrame(this._raf);
        }
        this._raf = undefined;
    };
    /**
     * Reset the timeline to the beginning (progress = 0).
     */
    Timeline.prototype.reset = function () {
        if (this.isDestroyed) {
            return;
        }
        this.pause();
        this.progress = 0;
    };
    /**
     * Animate the timeline, updating progress based on elapsed time.
     */
    Timeline.prototype._animate = function () {
        var _this = this;
        if (this.isPaused) {
            return;
        }
        var _a = this, isReversed = _a.isReversed, duration = _a.duration;
        if (duration <= 0) {
            this.progress = isReversed ? 1 : 0;
            this.progress = isReversed ? 0 : 1;
            return;
        }
        var currentTime = Date.now();
        var frameDiff = Math.abs(this._time - currentTime);
        this._time = currentTime;
        var progressIterator = frameDiff / duration / (isReversed ? -1 : 1);
        var progressTarget = this.progress + progressIterator;
        this.progress = progressTarget;
        if ((this.progress === 1 && !isReversed) ||
            (this.progress === 0 && isReversed)) {
            this._isReversed = false;
            this._isPaused = false;
            this._raf = undefined;
            return;
        }
        this._raf = window.requestAnimationFrame(function () { return _this._animate(); });
    };
    /**
     * Handle progress updates and trigger callbacks.
     */
    Timeline.prototype._onUpdate = function () {
        this._eased = (0, math_1.easing)(this._progress, this.props.easing);
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
    };
    /**
     * Destroy the timeline, stopping any active animation and cleaning up resources.
     */
    Timeline.prototype._destroy = function () {
        this.pause();
        _super.prototype._destroy.call(this);
    };
    return Timeline;
}(Module_1.Module));
exports.Timeline = Timeline;
//# sourceMappingURL=index.js.map