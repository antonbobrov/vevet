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
exports.Swipe = void 0;
var base_1 = require("../../base");
var Pointers_1 = require("../Pointers");
var utils_1 = require("../../utils");
var initVevet_1 = require("../../global/initVevet");
var Timeline_1 = require("../Timeline");
var styles_1 = require("./styles");
__exportStar(require("./types"), exports);
var VELOCITIES_COUNT = 4;
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
var Swipe = /** @class */ (function (_super) {
    __extends(Swipe, _super);
    function Swipe(props) {
        var _this = _super.call(this, props) || this;
        /** If swiping has started */
        _this._isSwiping = false;
        /** If swiping has been aborted */
        _this._isAborted = false;
        var _a = _this.props, container = _a.container, buttons = _a.buttons, pointers = _a.pointers;
        // set default data
        _this._coords = {
            timestamp: 0,
            start: { x: 0, y: 0, angle: 0 },
            prev: { x: 0, y: 0, angle: 0 },
            current: { x: 0, y: 0, angle: 0 },
            diff: { x: 0, y: 0, angle: 0 },
            step: { x: 0, y: 0, angle: 0 },
            accum: { x: 0, y: 0 },
        };
        _this._velocities = [];
        _this._cursorStyles = styles_1.cursorStyles === null || styles_1.cursorStyles === void 0 ? void 0 : styles_1.cursorStyles.cloneNode(true);
        // create pointers
        _this._pointers = new Pointers_1.Pointers({
            container: container,
            buttons: buttons,
            minPointers: pointers,
            maxPointers: pointers,
            enabled: _this.props.enabled,
            disableUserSelect: _this.props.disableUserSelect,
        });
        // add pointer events
        _this._pointers.on('start', function () { return _this._handlePointersStart(); });
        // add listeners
        var touchstart = (0, utils_1.addEventListener)(container, 'touchstart', function (event) { return _this._handleTouchStart(event); }, { passive: false });
        _this.onDestroy(function () { return touchstart(); });
        // apply styles
        _this._setInlineStyles();
        return _this;
    }
    /**
     * Returns default static properties.
     */
    Swipe.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { buttons: [0], pointers: 1, disableUserSelect: true });
    };
    /**
     * Returns default mutable properties.
     */
    Swipe.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { enabled: true, relative: false, axis: null, grabCursor: false, willAbort: function () { return false; }, threshold: 5, minTime: 0, directionThreshold: 50, preventEdgeSwipe: true, edgeSwipeThreshold: 20, preventTouchMove: true, requireCtrlKey: false, inertia: false, inertiaDuration: function (distance) { return (0, utils_1.clamp)(distance, 500, 2000); }, inertiaEasing: utils_1.EaseOutCubic, velocityModifier: false, distanceModifier: false, inertiaRatio: 1, inertiaDistanceThreshold: 50 });
    };
    Object.defineProperty(Swipe.prototype, "isSwiping", {
        /** Indicates if a swipe is active */
        get: function () {
            return this._isSwiping;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Swipe.prototype, "coords", {
        /** Returns current swipe coordinates */
        get: function () {
            return this._coords;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Swipe.prototype, "container", {
        /** Event target element */
        get: function () {
            return this.props.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Swipe.prototype, "hasInertia", {
        /** Indicates if inertia is active */
        get: function () {
            return !!this._inertia;
        },
        enumerable: false,
        configurable: true
    });
    /** Handles property updates */
    Swipe.prototype._handleProps = function () {
        _super.prototype._handleProps.call(this);
        this._pointers.updateProps({ enabled: this.props.enabled });
        this._setInlineStyles();
    };
    /** Applies touch-action and cursor styles */
    Swipe.prototype._setInlineStyles = function () {
        var _a = this.props, container = _a.container, axis = _a.axis;
        var cursor = this.props.grabCursor ? 'grab' : '';
        var touchAction = 'none';
        if (axis === 'x') {
            touchAction = 'pan-y';
        }
        else if (axis === 'y') {
            touchAction = 'pan-x';
        }
        container.style.cursor = cursor;
        container.style.touchAction = touchAction;
    };
    /** Handles `touchstart` events */
    Swipe.prototype._handleTouchStart = function (event) {
        if (!this.props.enabled) {
            return;
        }
        this.callbacks.emit('touchstart', event);
        this._preventEdgeSwipe(event);
    };
    /** Prevents edge swipes if enabled */
    Swipe.prototype._preventEdgeSwipe = function (event) {
        if (!this.props.preventEdgeSwipe) {
            return;
        }
        var threshold = this.props.edgeSwipeThreshold;
        var x = event.targetTouches[0].pageX;
        if (event.cancelable &&
            (x <= threshold || x >= (0, initVevet_1.initVevet)().width - threshold)) {
            event.preventDefault();
            this.callbacks.emit('preventEdgeSwipe', undefined);
        }
    };
    /** Handles swipe start and tracking */
    Swipe.prototype._handlePointersStart = function () {
        var _this = this;
        // track touchmove
        var touchmove = (0, utils_1.addEventListener)(window, 'touchmove', this._handleTouchMove.bind(this), { passive: false });
        // track movement of the first pointer only
        var mousemove = (0, utils_1.addEventListener)(window, 'mousemove', this._handleMouseMove.bind(this));
        // track end of pointers
        var end = this._pointers.on('end', function () {
            _this._handleEnd();
            end();
            touchmove();
            mousemove();
        });
        // destroy
        this.onDestroy(function () {
            end();
            touchmove();
            mousemove();
        });
    };
    /** Handles `touchmove` event */
    Swipe.prototype._handleTouchMove = function (event) {
        this.callbacks.emit('touchmove', event);
        if (this._isSwiping && this.props.preventTouchMove && event.cancelable) {
            event.preventDefault();
        }
        this._handleMove(this._decodeCoords(event), 'touch');
    };
    /** Handles `mousemove` event */
    Swipe.prototype._handleMouseMove = function (event) {
        if (this.props.requireCtrlKey && !event.ctrlKey) {
            return;
        }
        this.callbacks.emit('mousemove', event);
        this._handleMove(this._decodeCoords(event), 'mouse');
    };
    /** Parses pointer coordinates relative to the container */
    Swipe.prototype._decodeCoords = function (event) {
        var props = this.props;
        var clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        var clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        var x = clientX;
        var y = clientY;
        var centerX = (0, initVevet_1.initVevet)().width / 2;
        var centerY = (0, initVevet_1.initVevet)().height / 2;
        if (props.relative) {
            var bounding = props.container.getBoundingClientRect();
            x = clientX - bounding.left;
            y = clientY - bounding.top;
            centerX = bounding.left + bounding.width / 2;
            centerY = bounding.top + bounding.height / 2;
        }
        var angleRad = Math.atan2(clientY - centerY, clientX - centerX);
        var angle = (angleRad * 180) / Math.PI;
        return { x: x, y: y, angle: angle };
    };
    /** Handles move events */
    Swipe.prototype._handleMove = function (matrix, type) {
        var data = this._coords;
        if (this._isAborted) {
            return;
        }
        if (!this._startCoord) {
            this._startCoord = __assign({}, matrix);
        }
        if (!this._startTime) {
            this._startTime = +Date.now();
        }
        // check if can start
        if (!this._isSwiping) {
            var _a = this.props, threshold = _a.threshold, minTime = _a.minTime, axis = _a.axis, willAbort = _a.willAbort;
            var diff = {
                x: matrix.x - this._startCoord.x,
                y: matrix.y - this._startCoord.y,
            };
            // check threshold
            if (Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2)) < threshold) {
                return;
            }
            // check time
            if (+new Date() - this._startTime < minTime) {
                return;
            }
            // check axis
            if (axis) {
                var rawAngle = (Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * 180) / Math.PI;
                var normalizedAngle = axis === 'x' ? rawAngle : 90 - rawAngle;
                if (normalizedAngle > 45) {
                    this._reset();
                    this._isAborted = true;
                    this.callbacks.emit('abort', undefined);
                    return;
                }
            }
            // check if should abort
            if (willAbort({ type: type, matrix: matrix, start: this._startCoord, diff: diff })) {
                this._reset();
                this._isAborted = true;
                this.callbacks.emit('abort', undefined);
                return;
            }
        }
        // start
        if (!this._isSwiping) {
            this.cancelInertia();
            this._isSwiping = true;
            this._startCoord = __assign({}, matrix);
            data.timestamp = performance.now();
            data.start = __assign(__assign({}, this._startCoord), { angle: matrix.angle });
            data.prev = __assign(__assign({}, this._startCoord), { angle: matrix.angle });
            data.current = __assign(__assign({}, this._startCoord), { angle: matrix.angle });
            data.diff = { x: 0, y: 0, angle: 0 };
            data.step = { x: 0, y: 0, angle: 0 };
            data.accum = { x: 0, y: 0 };
            // emit callbacks
            this.callbacks.emit('start', this._coords);
            // apply cursor
            if (this.props.grabCursor && this._cursorStyles) {
                (0, initVevet_1.initVevet)().body.append(this._cursorStyles);
            }
        }
        // move
        this._move(matrix);
    };
    /** Handles move events */
    Swipe.prototype._move = function (_a) {
        var x = _a.x, y = _a.y, angle = _a.angle;
        var coords = this._coords;
        // prepare data
        var start = __assign({}, coords.start);
        var prev = __assign({}, coords.current);
        var current = { x: x, y: y, angle: angle };
        // update coords
        coords.timestamp = performance.now();
        coords.prev = prev;
        coords.current = current;
        var angleDelta = coords.current.angle - coords.prev.angle;
        if (angleDelta > 180) {
            angleDelta -= 360;
        }
        else if (angleDelta < -180) {
            angleDelta += 360;
        }
        coords.step = {
            x: current.x - prev.x,
            y: current.y - prev.y,
            angle: angleDelta,
        };
        coords.diff = {
            x: current.x - start.x,
            y: current.y - start.y,
            angle: coords.diff.angle + coords.step.angle,
        };
        coords.accum = {
            x: coords.accum.x + Math.abs(coords.step.x),
            y: coords.accum.y + Math.abs(coords.step.y),
        };
        // update velocity
        if (!this.hasInertia) {
            this._velocities.push(__assign(__assign({}, coords.current), { timestamp: coords.timestamp }));
            if (this._velocities.length > VELOCITIES_COUNT) {
                this._velocities.shift();
            }
        }
        // trigger callbacks
        this.callbacks.emit('move', this._coords);
    };
    /** Handles swipe end */
    Swipe.prototype._handleEnd = function () {
        // reset
        this._startTime = undefined;
        this._isAborted = false;
        // check swiping
        if (!this.isSwiping) {
            return;
        }
        // reset
        this._reset();
        // reset cursor
        this._cursorStyles.remove();
        // calculate direction
        var _a = this._coords.diff, diffX = _a.x, diffY = _a.y;
        var absDiffX = Math.abs(diffX);
        var absDiffY = Math.abs(diffY);
        var directionThreshold = this.props.directionThreshold;
        var endAxis = absDiffX > absDiffY ? 'x' : 'y';
        if (endAxis === 'x' && absDiffX > directionThreshold) {
            if (diffX > 0) {
                this.callbacks.emit('toRight', undefined);
            }
            else if (diffX < 0) {
                this.callbacks.emit('toLeft', undefined);
            }
        }
        if (endAxis === 'y' && absDiffY > directionThreshold) {
            if (diffY > 0) {
                this.callbacks.emit('toBottom', undefined);
            }
            else if (diffY < 0) {
                this.callbacks.emit('toTop', undefined);
            }
        }
        // end callback
        this.callbacks.emit('end', this._coords);
        // modifiy last velocity time
        if (this._velocities.length > 0) {
            this._velocities[this._velocities.length - 1].timestamp =
                performance.now();
        }
        // end with inertia
        if (this.props.inertia) {
            this._endWithInertia();
        }
    };
    /** Reset swipe states */
    Swipe.prototype._reset = function () {
        this._startCoord = undefined;
        this._isSwiping = false;
    };
    Object.defineProperty(Swipe.prototype, "velocity", {
        /** Returns current velocity */
        get: function () {
            var samples = this._velocities;
            if (samples.length < 2) {
                return { x: 0, y: 0, angle: 0 };
            }
            var totalWeight = 0;
            var wvx = 0;
            var wvy = 0;
            var wva = 0;
            for (var i = 1; i < samples.length; i += 1) {
                var current = samples[i];
                var previous = samples[i - 1];
                var deltaX = current.x - previous.x;
                var deltaY = current.y - previous.y;
                var angleDiff = current.angle - previous.angle;
                if (angleDiff > 180)
                    angleDiff -= 360;
                if (angleDiff < -180)
                    angleDiff += 360;
                var deltatTime = current.timestamp - previous.timestamp;
                var sx = (deltaX / deltatTime) * 1000;
                var sy = (deltaY / deltatTime) * 1000;
                var sa = (angleDiff / deltatTime) * 1000;
                var weight = 1 / Math.exp(-deltatTime * 0.1);
                wvx += sx * weight;
                wvy += sy * weight;
                wva += sa * weight;
                totalWeight += weight;
            }
            if (totalWeight > 0) {
                return {
                    x: wvx / totalWeight,
                    y: wvy / totalWeight,
                    angle: wva / totalWeight,
                };
            }
            return { x: 0, y: 0, angle: 0 };
        },
        enumerable: false,
        configurable: true
    });
    /** Apply inertia-based movement */
    Swipe.prototype._endWithInertia = function () {
        var _this = this;
        var _a = this.props, inertiaDuration = _a.inertiaDuration, inertiaEasing = _a.inertiaEasing, velocityModifier = _a.velocityModifier, inertiaRatio = _a.inertiaRatio, inertiaDistanceThreshold = _a.inertiaDistanceThreshold;
        var sourceVelocity = {
            x: this.velocity.x * inertiaRatio,
            y: this.velocity.y * inertiaRatio,
            angle: this.velocity.angle * inertiaRatio,
        };
        var velocity = velocityModifier
            ? velocityModifier(sourceVelocity)
            : sourceVelocity;
        var velocityX = velocity.x, velocityY = velocity.y, velocityA = velocity.angle;
        var distance = Math.sqrt(Math.pow(velocityX, 2) + Math.pow(velocityY, 2));
        // Check if we have sufficient velocity
        if (distance < inertiaDistanceThreshold) {
            this.callbacks.emit('inertiaFail', undefined);
            return;
        }
        // Calculate animation duration
        var duration = inertiaDuration(distance);
        // Check if the animation duration is positive
        if (duration <= 0) {
            this.callbacks.emit('inertiaFail', undefined);
            return;
        }
        // Calculate the start and add matrices
        var startMatrix = __assign({}, this.coords.current);
        var addMatrix = { x: 0, y: 0, angle: 0 };
        // Start the inertia animation
        this._inertia = new Timeline_1.Timeline({ duration: duration, easing: inertiaEasing });
        this._inertia.on('start', function () {
            _this.callbacks.emit('inertiaStart', undefined);
        });
        this._inertia.on('update', function (_a) {
            var eased = _a.eased;
            addMatrix.x = velocityX * eased;
            addMatrix.y = velocityY * eased;
            addMatrix.angle = velocityA * eased;
            // Apply the calculated position
            _this._move({
                x: startMatrix.x + addMatrix.x,
                y: startMatrix.y + addMatrix.y,
                angle: startMatrix.angle + addMatrix.angle,
            });
            _this.callbacks.emit('inertia', undefined);
        });
        this._inertia.on('end', function () {
            _this.cancelInertia();
            _this.callbacks.emit('inertiaEnd', undefined);
        });
        setTimeout(function () {
            var _a;
            (_a = _this._inertia) === null || _a === void 0 ? void 0 : _a.play();
        }, 0);
    };
    /** Destroy inertia animation */
    Swipe.prototype.cancelInertia = function () {
        var _a;
        if (!this._inertia) {
            return;
        }
        if (this._inertia.progress < 1) {
            this.callbacks.emit('inertiaCancel', undefined);
        }
        (_a = this._inertia) === null || _a === void 0 ? void 0 : _a.destroy();
        this._inertia = undefined;
    };
    Object.defineProperty(Swipe.prototype, "start", {
        /** Start coordinate */
        get: function () {
            return this._coords.start;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Swipe.prototype, "prev", {
        /** Previous coordinate */
        get: function () {
            return this._coords.prev;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Swipe.prototype, "current", {
        /** Current coordinate */
        get: function () {
            return this._coords.current;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Swipe.prototype, "diff", {
        /** Difference between start and current coordinates */
        get: function () {
            return this._coords.diff;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Swipe.prototype, "step", {
        /** Difference between start and previous coordinates */
        get: function () {
            return this._coords.step;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Swipe.prototype, "accum", {
        /** Accumulated movement */
        get: function () {
            return this._coords.accum;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Destroys the component
     */
    Swipe.prototype._destroy = function () {
        var _a;
        _super.prototype._destroy.call(this);
        this._pointers.destroy();
        (_a = this._inertia) === null || _a === void 0 ? void 0 : _a.destroy();
        this._cursorStyles.remove();
    };
    return Swipe;
}(base_1.Module));
exports.Swipe = Swipe;
//# sourceMappingURL=index.js.map