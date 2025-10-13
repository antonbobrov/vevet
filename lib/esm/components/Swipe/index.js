import { Module } from '../../base';
import { Pointers } from '../Pointers';
import { addEventListener, clamp, EaseOutCubic } from '../../utils';
import { initVevet } from '../../global/initVevet';
import { Timeline } from '../Timeline';
import { cursorStyles } from './styles';
export * from './types';
const VELOCITIES_COUNT = 4;
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
export class Swipe extends Module {
    /**
     * Returns default static properties.
     */
    _getStatic() {
        return Object.assign(Object.assign({}, super._getStatic()), { buttons: [0], pointers: 1, disableUserSelect: true });
    }
    /**
     * Returns default mutable properties.
     */
    _getMutable() {
        return Object.assign(Object.assign({}, super._getMutable()), { enabled: true, relative: false, axis: null, grabCursor: false, willAbort: () => false, threshold: 5, minTime: 0, directionThreshold: 50, preventEdgeSwipe: true, edgeSwipeThreshold: 20, preventTouchMove: true, requireCtrlKey: false, inertia: false, inertiaDuration: (distance) => clamp(distance, 500, 2000), inertiaEasing: EaseOutCubic, velocityModifier: false, distanceModifier: false, inertiaRatio: 1, inertiaDistanceThreshold: 50 });
    }
    /** Indicates if a swipe is active */
    get isSwiping() {
        return this._isSwiping;
    }
    /** Returns current swipe coordinates */
    get coords() {
        return this._coords;
    }
    /** Event target element */
    get container() {
        return this.props.container;
    }
    /** Indicates if inertia is active */
    get hasInertia() {
        return !!this._inertia;
    }
    constructor(props) {
        super(props);
        /** If swiping has started */
        this._isSwiping = false;
        /** If swiping has been aborted */
        this._isAborted = false;
        const { container, buttons, pointers } = this.props;
        // set default data
        this._coords = {
            timestamp: 0,
            start: { x: 0, y: 0, angle: 0 },
            prev: { x: 0, y: 0, angle: 0 },
            current: { x: 0, y: 0, angle: 0 },
            diff: { x: 0, y: 0, angle: 0 },
            step: { x: 0, y: 0, angle: 0 },
            accum: { x: 0, y: 0 },
        };
        this._velocities = [];
        this._cursorStyles = cursorStyles === null || cursorStyles === void 0 ? void 0 : cursorStyles.cloneNode(true);
        // create pointers
        this._pointers = new Pointers({
            container,
            buttons,
            minPointers: pointers,
            maxPointers: pointers,
            enabled: this.props.enabled,
            disableUserSelect: this.props.disableUserSelect,
        });
        // add pointer events
        this._pointers.on('start', () => this._handlePointersStart());
        // add listeners
        const touchstart = addEventListener(container, 'touchstart', (event) => this._handleTouchStart(event), { passive: false });
        this.onDestroy(() => touchstart());
        // apply styles
        this._setInlineStyles();
    }
    /** Handles property updates */
    _handleProps() {
        super._handleProps();
        this._pointers.updateProps({ enabled: this.props.enabled });
        this._setInlineStyles();
    }
    /** Applies touch-action and cursor styles */
    _setInlineStyles() {
        const { container, axis } = this.props;
        const cursor = this.props.grabCursor ? 'grab' : '';
        let touchAction = 'none';
        if (axis === 'x') {
            touchAction = 'pan-y';
        }
        else if (axis === 'y') {
            touchAction = 'pan-x';
        }
        container.style.cursor = cursor;
        container.style.touchAction = touchAction;
    }
    /** Handles `touchstart` events */
    _handleTouchStart(event) {
        if (!this.props.enabled) {
            return;
        }
        this.callbacks.emit('touchstart', event);
        this._preventEdgeSwipe(event);
    }
    /** Prevents edge swipes if enabled */
    _preventEdgeSwipe(event) {
        if (!this.props.preventEdgeSwipe) {
            return;
        }
        const threshold = this.props.edgeSwipeThreshold;
        const x = event.targetTouches[0].pageX;
        if (event.cancelable &&
            (x <= threshold || x >= initVevet().width - threshold)) {
            event.preventDefault();
            this.callbacks.emit('preventEdgeSwipe', undefined);
        }
    }
    /** Handles swipe start and tracking */
    _handlePointersStart() {
        // track touchmove
        const touchmove = addEventListener(window, 'touchmove', this._handleTouchMove.bind(this), { passive: false });
        // track movement of the first pointer only
        const mousemove = addEventListener(window, 'mousemove', this._handleMouseMove.bind(this));
        // track end of pointers
        const end = this._pointers.on('end', () => {
            this._handleEnd();
            end();
            touchmove();
            mousemove();
        });
        // destroy
        this.onDestroy(() => {
            end();
            touchmove();
            mousemove();
        });
    }
    /** Handles `touchmove` event */
    _handleTouchMove(event) {
        this.callbacks.emit('touchmove', event);
        if (this._isSwiping && this.props.preventTouchMove && event.cancelable) {
            event.preventDefault();
        }
        this._handleMove(this._decodeCoords(event), 'touch');
    }
    /** Handles `mousemove` event */
    _handleMouseMove(event) {
        if (this.props.requireCtrlKey && !event.ctrlKey) {
            return;
        }
        this.callbacks.emit('mousemove', event);
        this._handleMove(this._decodeCoords(event), 'mouse');
    }
    /** Parses pointer coordinates relative to the container */
    _decodeCoords(event) {
        const { props } = this;
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        let x = clientX;
        let y = clientY;
        let centerX = initVevet().width / 2;
        let centerY = initVevet().height / 2;
        if (props.relative) {
            const bounding = props.container.getBoundingClientRect();
            x = clientX - bounding.left;
            y = clientY - bounding.top;
            centerX = bounding.left + bounding.width / 2;
            centerY = bounding.top + bounding.height / 2;
        }
        const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
        const angle = (angleRad * 180) / Math.PI;
        return { x, y, angle };
    }
    /** Handles move events */
    _handleMove(matrix, type) {
        const data = this._coords;
        if (this._isAborted) {
            return;
        }
        if (!this._startCoord) {
            this._startCoord = Object.assign({}, matrix);
        }
        if (!this._startTime) {
            this._startTime = +Date.now();
        }
        // check if can start
        if (!this._isSwiping) {
            const { threshold, minTime, axis, willAbort } = this.props;
            const diff = {
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
                const rawAngle = (Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * 180) / Math.PI;
                const normalizedAngle = axis === 'x' ? rawAngle : 90 - rawAngle;
                if (normalizedAngle > 45) {
                    this._reset();
                    this._isAborted = true;
                    this.callbacks.emit('abort', undefined);
                    return;
                }
            }
            // check if should abort
            if (willAbort({ type, matrix, start: this._startCoord, diff })) {
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
            this._startCoord = Object.assign({}, matrix);
            data.timestamp = performance.now();
            data.start = Object.assign(Object.assign({}, this._startCoord), { angle: matrix.angle });
            data.prev = Object.assign(Object.assign({}, this._startCoord), { angle: matrix.angle });
            data.current = Object.assign(Object.assign({}, this._startCoord), { angle: matrix.angle });
            data.diff = { x: 0, y: 0, angle: 0 };
            data.step = { x: 0, y: 0, angle: 0 };
            data.accum = { x: 0, y: 0 };
            // emit callbacks
            this.callbacks.emit('start', this._coords);
            // apply cursor
            if (this.props.grabCursor && this._cursorStyles) {
                initVevet().body.append(this._cursorStyles);
            }
        }
        // move
        this._move(matrix);
    }
    /** Handles move events */
    _move({ x, y, angle }) {
        const coords = this._coords;
        // prepare data
        const start = Object.assign({}, coords.start);
        const prev = Object.assign({}, coords.current);
        const current = { x, y, angle };
        // update coords
        coords.timestamp = performance.now();
        coords.prev = prev;
        coords.current = current;
        let angleDelta = coords.current.angle - coords.prev.angle;
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
            this._velocities.push(Object.assign(Object.assign({}, coords.current), { timestamp: coords.timestamp }));
            if (this._velocities.length > VELOCITIES_COUNT) {
                this._velocities.shift();
            }
        }
        // trigger callbacks
        this.callbacks.emit('move', this._coords);
    }
    /** Handles swipe end */
    _handleEnd() {
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
        const { x: diffX, y: diffY } = this._coords.diff;
        const absDiffX = Math.abs(diffX);
        const absDiffY = Math.abs(diffY);
        const { directionThreshold } = this.props;
        const endAxis = absDiffX > absDiffY ? 'x' : 'y';
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
    }
    /** Reset swipe states */
    _reset() {
        this._startCoord = undefined;
        this._isSwiping = false;
    }
    /** Returns current velocity */
    get velocity() {
        const samples = this._velocities;
        if (samples.length < 2) {
            return { x: 0, y: 0, angle: 0 };
        }
        let totalWeight = 0;
        let wvx = 0;
        let wvy = 0;
        let wva = 0;
        for (let i = 1; i < samples.length; i += 1) {
            const current = samples[i];
            const previous = samples[i - 1];
            const deltaX = current.x - previous.x;
            const deltaY = current.y - previous.y;
            let angleDiff = current.angle - previous.angle;
            if (angleDiff > 180)
                angleDiff -= 360;
            if (angleDiff < -180)
                angleDiff += 360;
            const deltatTime = current.timestamp - previous.timestamp;
            const sx = (deltaX / deltatTime) * 1000;
            const sy = (deltaY / deltatTime) * 1000;
            const sa = (angleDiff / deltatTime) * 1000;
            const weight = 1 / Math.exp(-deltatTime * 0.1);
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
    }
    /** Apply inertia-based movement */
    _endWithInertia() {
        const { inertiaDuration, inertiaEasing, velocityModifier, inertiaRatio, inertiaDistanceThreshold, } = this.props;
        const sourceVelocity = {
            x: this.velocity.x * inertiaRatio,
            y: this.velocity.y * inertiaRatio,
            angle: this.velocity.angle * inertiaRatio,
        };
        const velocity = velocityModifier
            ? velocityModifier(sourceVelocity)
            : sourceVelocity;
        const { x: velocityX, y: velocityY, angle: velocityA } = velocity;
        const distance = Math.sqrt(Math.pow(velocityX, 2) + Math.pow(velocityY, 2));
        // Check if we have sufficient velocity
        if (distance < inertiaDistanceThreshold) {
            this.callbacks.emit('inertiaFail', undefined);
            return;
        }
        // Calculate animation duration
        const duration = inertiaDuration(distance);
        // Check if the animation duration is positive
        if (duration <= 0) {
            this.callbacks.emit('inertiaFail', undefined);
            return;
        }
        // Calculate the start and add matrices
        const startMatrix = Object.assign({}, this.coords.current);
        const addMatrix = { x: 0, y: 0, angle: 0 };
        // Start the inertia animation
        this._inertia = new Timeline({ duration, easing: inertiaEasing });
        this._inertia.on('start', () => {
            this.callbacks.emit('inertiaStart', undefined);
        });
        this._inertia.on('update', ({ eased }) => {
            addMatrix.x = velocityX * eased;
            addMatrix.y = velocityY * eased;
            addMatrix.angle = velocityA * eased;
            // Apply the calculated position
            this._move({
                x: startMatrix.x + addMatrix.x,
                y: startMatrix.y + addMatrix.y,
                angle: startMatrix.angle + addMatrix.angle,
            });
            this.callbacks.emit('inertia', undefined);
        });
        this._inertia.on('end', () => {
            this.cancelInertia();
            this.callbacks.emit('inertiaEnd', undefined);
        });
        setTimeout(() => {
            var _a;
            (_a = this._inertia) === null || _a === void 0 ? void 0 : _a.play();
        }, 0);
    }
    /** Destroy inertia animation */
    cancelInertia() {
        var _a;
        if (!this._inertia) {
            return;
        }
        if (this._inertia.progress < 1) {
            this.callbacks.emit('inertiaCancel', undefined);
        }
        (_a = this._inertia) === null || _a === void 0 ? void 0 : _a.destroy();
        this._inertia = undefined;
    }
    /** Start coordinate */
    get start() {
        return this._coords.start;
    }
    /** Previous coordinate */
    get prev() {
        return this._coords.prev;
    }
    /** Current coordinate */
    get current() {
        return this._coords.current;
    }
    /** Difference between start and current coordinates */
    get diff() {
        return this._coords.diff;
    }
    /** Difference between start and previous coordinates */
    get step() {
        return this._coords.step;
    }
    /** Accumulated movement */
    get accum() {
        return this._coords.accum;
    }
    /**
     * Destroys the component
     */
    _destroy() {
        var _a;
        super._destroy();
        this._pointers.destroy();
        (_a = this._inertia) === null || _a === void 0 ? void 0 : _a.destroy();
        this._cursorStyles.remove();
    }
}
//# sourceMappingURL=index.js.map