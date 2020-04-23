import Module from './Module';
import merge from './merge';
const selectEl = require('select-el');

/**
 * @classdesc Dragging/Swiping. <br>
 * Available targets:
 *  <ul>
 *      <li>start - argument {@linkcode Vevet.DraggerModule.Callback}<li>
 *      <li>end - argument {@linkcode Vevet.DraggerModule.Callback}</li>
 *      <li>move - argument {@linkcode Vevet.DraggerModule.Callback}</li>
 *      <li>up</li>
 *      <li>down</li>
 *      <li>left</li>
 *      <li>right</li>
 *  </ul>
 * <br><br> <b>import {DraggerModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.DraggerModule : start : Vevet.DraggerModule.Callback }
 * @vevetModuleCallback { Vevet.DraggerModule : end : Vevet.DraggerModule.Callback }
 * @vevetModuleCallback { Vevet.DraggerModule : move : Vevet.DraggerModule.Callback }
 * @vevetModuleCallback { Vevet.DraggerModule : up :  }
 * @vevetModuleCallback { Vevet.DraggerModule : down :  }
 * @vevetModuleCallback { Vevet.DraggerModule : left :  }
 * @vevetModuleCallback { Vevet.DraggerModule : right :  }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Event
 */
export default class DraggerModule extends Module {


    /**
     * @memberof Vevet.DraggerModule
     * @typedef {object} ThresholdPropagation
     * 
     * @property { 'x' | 'y' } dir
     * @property { number } value
     */    
    /**
     * @memberof Vevet.DraggerModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {boolean} [on=true] - If the module is enabled.
     * @property {string|HTMLElement|Window} outer - *** Selector of the element or the element itself.
     * @property {number} [min=100] - Minimum length of movement in pixels to launch events under the targets "up", "down, "left", "right".
     * @property {boolean} [momentum=false] - If momentum drag/swipe is enabled.
     * @property {number} [friction=.95] - Momentum deceleration friction.
     * @property { Vevet.DraggerModule.ThresholdPropagation | false } [thresholdPropagation=false] - Stop propagation if a definite length of movement in pixels was reached.
     */
    /**
     * @alias Vevet.DraggerModule
     * 
     * @param {Vevet.DraggerModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.DraggerModule.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            on: true,
            outer: '',
            min: 100,
            momentum: false,
            friction: .95,
            thresholdPropagation: false
        });
    }

    /**
     * @member Vevet.DraggerModule#prop
     * @memberof Vevet.DraggerModule
     * @readonly
     * @type {Vevet.DraggerModule.Properties}
     */

    /**
     * @member Vevet.DraggerModule#_prop
     * @memberof Vevet.DraggerModule
     * @protected
     * @type {Vevet.DraggerModule.Properties}
     */

    /**
     * @function Vevet.DraggerModule#changeProp
     * @memberof Vevet.DraggerModule
     * @param {Vevet.DraggerModule.Properties} [prop]
     */



    /**
     * @memberof Vevet.DraggerModule
     * @typedef {object} Coords
     * @property {number} x
     * @property {number} y
     */

    

    // Extra Constructor
    _extra() {

        super._extra();

        /**
         * @description Start coordinates. They can change when using "thresholdPropagation".
         * @protected
         * @member {Vevet.DraggerModule.Coords}
         */
        this._start = {
            x: 0,
            y: 0
        };
        /**
         * @description Global coordinates / relative to the window.
         * @protected 
         * @member {Vevet.DraggerModule.Coords}
         */
        this._global = {
            x: 0,
            y: 0
        };
        /**
         * @description Previous global coordinates.
         * @protected 
         * @member {Vevet.DraggerModule.Coords}
         */
        this._prev = {
            x: 0,
            y: 0
        };
        /**
         * @description Difference between the previous and current values since the drag/swipe was started.
         * @protected 
         * @member {Vevet.DraggerModule.Coords}
         */
        this._diff = {
            x: 0,
            y: 0
        };

        /**
         * @description If dragging at the moment
         * @protected
         * @member {boolean}
         */
        this._dragging = false;
        /**
         * @description If preventDefault and stopPropagation must be applied.
         * @protected
         * @member {boolean}
         */
        this._prevent = false;
        /**
         * @description If momentum is in process.
         * @protected
         * @member {boolean}
         */
        this._decelerating = false;
        /**
         * @description Deceleration target values.
         * @protected 
         * @member {Vevet.DraggerModule.Coords}
         */
        this._deceleration = {
            x: 0,
            y: 0
        };
        /**
         * @description Pointer ID.
         * @protected
         * @member { any }
         */
        this._pointerID = false;
        /**
         * @description Tracking points. They are used to calculate the momentum strength.
         * @type { Array<Vevet.DraggerModule.TrackingPoint> }
         * @protected
         */
        this._trackingPoints = [];

        /**
         * @description Additional event listeners.
         * @protected
         * @member { Array<Vevet.BindListener> }
         */
        this._runningListeners = [];

        // get elements
        this._getElements();

    }

    /**
     * @description Get elements
     * @protected
     */
    _getElements() {

        /**
         * @description Outer element.
         * @protected
         * @member {HTMLElement}
         */
        this._outer = selectEl.one(this._prop.outer);

    }

    // Remove event listeners when properties are changed
    _changeProp() {

        // remove events
        this.removeEventListeners();
    
        // update elements
        this._getElements();

        // set events
        this._setEvents();

    }



    /**
     * @description Set events.
     * @protected
     */
    _setEvents() {

        if (this._prop.on) {
            this._setStartEvents();
        }

    }

    /**
     * @description Set events to start dragging. In {@linkcode Vevet.DraggerModule} is is empty.
     * @protected
     */
    _setStartEvents() {

        this.listener(this._outer, "mousedown", this._onStart.bind(this));
        this.listener(this._outer, "touchstart", this._onStart.bind(this));

    }

    /**
     * @description Add running events.
     * @protected
     */
    _addRunningEvents() {

        this._removeRunningEvents();

        const listeners = this._runningListeners;
        const outer = this._outer;

        listeners.push(this.listener(outer, 'touchmove', this._onMove.bind(this)));
        listeners.push(this.listener(outer, 'touchend', this._onEnd.bind(this)));
        listeners.push(this.listener(outer, 'touchcancel', this._onStop.bind(this)));

        listeners.push(this.listener(window, 'mousemove', this._onMove.bind(this)));
        listeners.push(this.listener(window, 'mouseup', this._onEnd.bind(this)));
        listeners.push(this.listener(window, 'blur', this._onStop.bind(this)));

    }

    /**
     * @description Remove running events.
     * @protected
     */
    _removeRunningEvents() {

        this._runningListeners.forEach(event => {
            this.removeEventListener({
                id: event.id,
                el: event.el
            });
        });

        this._runningListeners = [];

    }



    /**
     * @description When dragging has been started.
     * @param { MouseEvent | TouchEvent } e
     * @protected
     */
    _onStart(e) {

        const event = this._normalizeEvent(e);

        if (!this._dragging) {

            // prevent actions
            if (e.type == 'mousedown') {
                if (e.which == 1) {
                    e.stopPropagation();
                }
                else {
                    return;
                }
            }

            // change dragging vars
            this._dragging = true;
            this._decelerating = false;
            this._prevent = false;
            this._pointerID = event.id;

            // reset difference
            this._diff.x = 0;
            this._diff.y = 0;

            // change coordinates
            this._global.x = this._prev.x = this._start.x = event.x;
            this._global.y = this._prev.y = this._start.y = event.y;

            // change tracking points
            this._trackingPoints = [];
            this._addTrackingPoint(event.x, event.y);

            // add additional events
            this._addRunningEvents();

            // call events
            this._callEvents('start');

        }

    }

    /**
     * @description Handles move events
     * @param { Event } e
     */
    _onMove(e) {

        const event = this._normalizeEvent(e);

        if (this._dragging && event.id === this._pointerID) {

            // calculate difference between current and previous coordinates
            this._diff.x += Math.abs(event.x - this._global.x);
            const diffX = this._diff.x;
            this._diff.y += Math.abs(event.y - this._global.y);
            const diffY = this._diff.y;

            // change coordinates
            this._global.x = event.x;
            this._global.y = event.y;

            // check if movement is possible
            // or prevent the default event and propagation
            const thresholdPropagation = this._prop.thresholdPropagation;
            if (thresholdPropagation) {
                const value = thresholdPropagation.value;
                if (
                    (thresholdPropagation.dir == 'x' & diffX > value & diffX > diffY) ||
                    (thresholdPropagation.dir == 'y' & diffY > value & diffY > diffX)
                ) {
                    e.stopPropagation();
                    e.preventDefault();
                    this._prevent = true;
                    // if (this._prop.stopppp) {
                    //     console.log("stopppp")
                    // }
                }
                else {
                    this._start.x = event.x;
                    this._start.y = event.y;
                    return;
                }
            }

            // add a tracking point
            this._addTrackingPoint(this._prev.x, this._prev.y);

            // call events
            this._callEvents("move");

        }

    }

    /**
     * @description Handles end events
     * @param { Event } e
     */
    _onEnd(e) {

        const event = this._normalizeEvent(e);

        if (this._dragging && event.id === this._pointerID) {

            this.stopDrag(false);
            
            // start deceleration at the end if enabled
            if (this._prop.momentum) {
                this._startDeceleration();
            }
            // if no, call the end events
            else {
                this._callEvents("end");
            }

        }

    }

    /**
     * @description Handles end events
     */
    _onStop() {

        if (this._dragging) {
            this.stopDrag();
        }

    }

    /**
     * @description Stop Swipe/Drag.
     * @param { boolean } [bool] - Launch end callbacks.
     */
    stopDrag(bool = true) {

        // change dragging bools
        this._dragging = false;
        this._decelerating = false;
        this._prevent = false;

        // remove runtime listeners
        this._removeRunningEvents();

        // callbacks
        if (bool) {
            this._callEvents("end");
        }

    }



    /**
     * @memberof Vevet.DraggerModule
     * @typedef {object} NormalizedEvent
     * @property { number } x
     * @property { number } y
     * @property { any } id
     */

    /**
     * @description Normalize Data from the event.
     * @param { Event } e
     * @protected
     */
    _normalizeEvent(e) {

        // touch events
        if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
            const touch = e.targetTouches[0] || e.changedTouches[0];
            return {
                x: touch.clientX,
                y: touch.clientY,
                id: touch.identifier
            };
        }
        
        // mouse events
        return {
            x: e.clientX,
            y: e.clientY,
            id: null
        };

    }

    /**
     * @description Records movement for the last 100ms
     * @param {number} x
     * @param {number} y
     * @protected
     */
    _addTrackingPoint(x, y) {

        const time = Date.now();
        let trackingPoints = this._trackingPoints;

        while (trackingPoints.length > 0) {
            if (time - trackingPoints[0].time <= 100) {
                break;
            }
            trackingPoints.shift();
        }

        trackingPoints.push({x, y, time});
        this._trackingPoints = trackingPoints;

    }

    /**
     * @memberof Vevet.DraggerModule
     * @typedef {object} TrackingPoint
     * @property { number } time
     * @property { number } x
     * @property { number } y
     */



    /**
     * @description Calculate and start momentum deceleration.
     * @protected
     */
    _startDeceleration() {

        const trackingPoints = this._trackingPoints;

        const firstPoint = trackingPoints[0];
        const lastPoint = trackingPoints[trackingPoints.length - 1];

        const xOffset = lastPoint.x - firstPoint.x;
        const yOffset = lastPoint.y - firstPoint.y;

        const timeOffset = lastPoint.time - firstPoint.time;

        const D = (timeOffset / 35);

        const decelerateTarget = this._deceleration;
        decelerateTarget.x = (xOffset / D) || 0;
        decelerateTarget.y = (yOffset / D) || 0;

        if ((Math.abs(decelerateTarget.x) > 1 || Math.abs(decelerateTarget.y) > 1)){
            this._decelerating = true;
            window.requestAnimationFrame(this._decelerationAnim.bind(this));
        }
        else {
            this.stopDrag();
        }

    }

    /**
     * @description Momentum deceleration animation.
     * @protected
     */
    _decelerationAnim() {

        // stop if not decelerating
        if (!this._decelerating) {
            return;
        }

        // vars
        const stopThreshold = 0.3;
        const friction = this._prop.friction;

        // decelerate momentum
        this._deceleration.x *= friction;
        const x = this._deceleration.x;
        this._deceleration.y *= friction;
        const y = this._deceleration.y;

        // iterate global coordinates
        this._global.x += x;
        this._global.y += y;

        // launch callbacks
        this._callEvents("move");

        // continue decelerating
        if (Math.abs(x) > stopThreshold & Math.abs(y) > stopThreshold) {
            window.requestAnimationFrame(this._decelerationAnim.bind(this));
        }
        else {
            this.stopDrag();
        }

    }




    /**
     * @description Call events.
     * @param { 'start' | 'move' | 'end' } target 
     */
    _callEvents(target) {
        
        // get new coordinates
        const coords = this._calcCoords();

        // if the target is "start", call the start callback
        if (target == 'start') {
            this.lbt("start", coords);
        }
        // if the target is "move", call the move callback
        else if (target == 'move') {
            this.lbt("move", coords);
        }
        // if another target, call "end" callbacks and the "once-callbacks" if they exist
        else {
            this.lbt("end", coords);
            this._callOnceEvents(coords);
        }

        // change previous values
        this._prev.x = this._global.x;
        this._prev.y = this._global.y;

    }

    /**
     * @description Call once-events
     * @protected
     * @param { Vevet.DraggerModule.Coords } coords
     */
    _callOnceEvents(coords) {

        const global = coords.global;
        const startX = this._start.x;
        const startY = this._start.y;
        const min = this._prop.min;

        // to left / left
        if (startX > global.x) {
            if (Math.abs(startX - global.x) > Math.abs(min)) {
                this.lbt("left");
            }
        }

        // to right / right
        if (startX < global.x) {
            if (Math.abs(startX - global.x) > Math.abs(min)) {
                this.lbt("right");
            }
        }

        // to top / up
        if (startY > global.y) {
            if (Math.abs(startY - global.y) > Math.abs(min)) {
                this.lbt("up");
            }
        }

        // to bottom / down
        if (startY < global.y) {
            if (Math.abs(startY - global.y) > Math.abs(min)) {
                this.lbt("down");
            }
        }

    }

    /**
     * @memberof Vevet.DraggerModule
     * @typedef {object} Callback
     * @property {Vevet.DraggerModule.Coords} global - Coordinates relative to the window. 
     * @property {Vevet.DraggerModule.Coords} inner - Coordinates relative to the outer. 
     * @property {Vevet.DraggerModule.Coords} diff - Difference between the start and current coordinates.
     * @property {Vevet.DraggerModule.Coords} step - Difference between current and previous values.
     */

    /**
     * @description Calculate current coordinates.
     * @protected
     * @returns { Vevet.DraggerModule.Callback }
     */
    _calcCoords() {

        // get outer
        const outer = this._outer;
        // get global coords
        const global = this._global;
    
        // calculate all coordinates
        let bounding = {
                top: 0,
                left: 0
            },
            inner = {
                x: 0,
                y: 0
            },
            diff = {
                x: 0,
                y: 0
            },
            step = {
                x: 0,
                y: 0
            };
        
        // get inner coords
        // if the outer is not the window or document, its bounding will be taken into consideration also
        if (outer instanceof Window || outer instanceof Document) {
            inner.x = global.x;
            inner.y = global.y;
        }
        else {
            bounding = outer.getBoundingClientRect();
            inner.x = global.x - bounding.left;
            inner.y = global.y - bounding.top;
        }
        
        // get difference coords
        diff.x = inner.x - (this._start.x - bounding.left);
        diff.y = inner.y - (this._start.y - bounding.top);
        
        // get step values
        step.x = global.x - this._prev.x;
        step.y = global.y - this._prev.y;

        // create an object with new coordinates
        return {
            global: global,
            inner: inner,
            diff: diff,
            step: step
        };

    }



}