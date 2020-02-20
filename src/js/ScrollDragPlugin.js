import merge from "./merge";
import DragModule from "./DragModule";
import SwipeModule from "./SwipeModule";
import Plugin from "./Plugin";

/**
 * @classdesc Add drag and swipe to scroll. <br>
 * <br><br> <b>import {ScrollDragPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 * @requires Vevet.DragModule
 * @requires Vevet.SwipeModule
 */
export default class ScrollDragPlugin extends Plugin {


    
    /**
     * @memberof Vevet.ScrollDragPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [on=true] - If enabled.
     * @property {number} [k=1] - The higher number the faster animation.
     * @property {boolean} [disableListeners=true] - If you need to set 'pointer-events: none' to children when dragging.
     * @property {number} [timeoutListeners=10] - Time after which 'pointer-events' will be removed from children after dragging stops.
     * @property {number} [min=0] - Minimum amount of pixels for drag to respond.
     * @property {boolean} [draggable=true] - If true, the "draggable" property will be set to false.
     * @property {number} [draggableEase=.15] - This property is the same as the ease property in {@linkcode Vevet.ScrollModule}, though the value in Scroll becomes the same as here only when dragging.
     */
    /**
     * @alias Vevet.ScrollDragPlugin
     * @description Construct the class.
     * 
     * @param {Vevet.ScrollDragPlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.ScrollDragPlugin.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            on: true,
            k: 1,
            disableListeners: true,
            timeoutListeners: 10,
            min: 0,
            draggable: true,
            draggableEase: .15
        });
    }

    /**
     * @member Vevet.ScrollDragPlugin#prop
     * @memberof Vevet.ScrollDragPlugin
     * @readonly
     * @type {Vevet.ScrollDragPlugin.Properties}
     */

    /**
     * @member Vevet.ScrollDragPlugin#_prop
     * @memberof Vevet.ScrollDragPlugin
     * @protected
     * @type {Vevet.ScrollDragPlugin.Properties}
     */

    /**
     * @function Vevet.ScrollDragPlugin#changeProp
     * @memberof Vevet.ScrollDragPlugin
     * @param {Vevet.ScrollDragPlugin.Properties} [prop]
     */

    /**
     * @member Vevet.ScrollDragPlugin#_m
     * @memberof Vevet.ScrollDragPlugin
     * @protected
     * @type {Vevet.ScrollModule}
     */


    
    // Extra Constructor
    _extra() {

        super._extra();

        // init variables
        this._vars();

        // draggable elements
        if (this._prop.draggable) {
            let draggableEl = this._m.outer.querySelectorAll("img, a");
            draggableEl.forEach(el => {
                el.draggable = false;
            });
        }

        // override get ease
        this._getEase();

        // velocity decreaser
        this._setVelocity();

    }

    _vars() {

        /**
         * @description If being dragged at the moment.
         * @type {boolean}
         * @private
         */
        this._dragging = false;

        /**
         * @description Where drag classes are stored.
         * @type {Array<Vevet.DraggerModule|Vevet.SwipeModule|Vevet.DragModule>}
         * @private
         */
        this._draggers = [];

    }



    // Set events
    _setEvents() {

        // drag events
        this._setDrag("drag");
        this._setDrag("swipe");

    }

    /**
     * @description Set Drag Events.
     * @private
     * @param {string} type - Drag|swipe.
     */
    _setDrag(type) {

        // vars
        let event,
            module = this._m,
            prop = {
                v: module.prop.v,
                outer: module.outer
            };

        // create drag
        if (type == 'drag') {
            event = new DragModule(prop);
        }
        else {
            event = new SwipeModule(prop);
        }

        // add to stack
        this._draggers.push(event);

        // add events
        event.on("start", this._start.bind(this));
        event.on("move", this._move.bind(this));
        event.on("end", this._end.bind(this));

    }



    /**
     * @description Start Dragging.
     * @private
     */
    _start() {

        if (this._m.prop.run & this._prop.on) {
            // change bool
            this._dragging = true;
            // reset velocity
            this._setVelocity();
        }

    }

    /**
     * @description Moving.
     * @param {Vevet.DraggerModule.Callback} data
     * @private
     */
    _move(data) {

        // return if disabled
        if (!this._m.prop.run || !this._prop.on || !this._dragging) {
            return;
        }

        // vars
        let diff = data.diff,
            step = data.step,
            min = this._prop.min,
            k = this._prop.k,
            module = this._m;

        // check minimum values
        if (module._prop.horizontal) {
            if (Math.abs(diff.x) < min) {
                return;
            }
        }
        else {
            if (Math.abs(diff.y) < min) {
                return;
            }
        }

        // drag values
        let x = step.x * k,
            y = step.y * k;

        // set new targets
        module.targetLeft -= x;
        module.targetTop -= y;

        // calculate velocity
        this._increaseVelocity(x, y);

        // shrink target values
        module._boundariesBoth();

        // set direction
        let directionPixel = 'y';
        if (module._prop.horizontal) {
            directionPixel = 'x';
        }
        if (data.diff[directionPixel] > 0) {
            module._direction = -1;
        }
        else {
            module._direction = 1;
        }

        // disable listeners
        if (this._prop.disableListeners) {
            module.outer.classList.add(`${module._prefix}_dragging`);
        }

    }

    /**
     * @description Drag end.
     * @private
     */
    _end() {

        // return if disabled
        if (!this._m.prop.run || !this._prop.on) {
            return;
        }

        // vars
        let module = this._m;

        // apply acceleration

        // y

        let velocity = this._velocity.y / module._prop.ease;
        velocity = Math.abs(velocity) < 50 ? 0 : velocity;

        module._targetTop -= velocity;
        module._boundariesBoth();

        // change bool
        this._dragging = false;

        // return listeners to the container
        if (this._prop.disableListeners) {
            setTimeout(() => {
                if (!this._dragging) {
                    module.outer.classList.remove(`${module._prefix}_dragging`);
                }
            }, this._prop.timeoutListeners)
        }

    }


    /**
     * @description Reset Velocity values.
     * @param {number} [x=0] - Horizontal velocity.
     * @param {number} [y=0] - Vertical velocity.
     * @private
     */
    _setVelocity(x = 0, y = 0) {
        this._velocity = {
            x: x,
            y: y,
            t: new Date()
        };
    }

    /**
     * @description Increase Velocity values.
     * @param {number} x - Iterator.
     * @param {number} y - Iterator.
     * @private
     */
    _increaseVelocity(x, y) {

        // velocity values
        let velocity = this._velocity,
            frame = new Date() - velocity.t || 16,
            // current velocity length
            xLength = x / frame * 16,
            yLength = y / frame * 16,
            // new velocity values
            newX = .9 * xLength + .1 * velocity.x,
            newY = .9 * yLength + .1 * velocity.y;

        // update velocity values
        this._setVelocity(newX, newY);
        
    }

    /**
     * @description Override elements ease.
     * @private
     */
    _getEase() {

        // get module
        let module = this._m;

        // override
        let _getEase = module._getEase.bind(module);
        module._getEase = (el, intstant) => {
            let ease = _getEase(el, intstant);

            if (this._dragging) {
                return this._prop.draggableEase;
            }
            else {
                return ease;
            }

        };

    }



    // Destroy
    _destroy() {

        super._destroy();

        this._draggers.forEach(event => {
            event.destroy();
        });

    }



}