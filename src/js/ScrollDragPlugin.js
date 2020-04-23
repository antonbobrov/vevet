import merge from "./merge";
import DraggerModule from "./DraggerModule";
import Plugin from "./Plugin";

/**
 * @classdesc Add drag and swipe to scroll. <br>
 * <br><br> <b>import {ScrollDragPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 * @requires Vevet.DraggerModule
 */
export default class ScrollDragPlugin extends Plugin {


    
    /**
     * @memberof Vevet.ScrollDragPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [on=true] - If enabled.
     * @property {number} [multiplier=1] - The higher number the faster animation.
     * @property {number} [momentum=1] - If momentum drag/swipe is enabled.
     * @property {number} [friction=.95] - Momentum deceleration friction.
     * @property {number} [ease=.15] - This property is the same as the ease property in {@linkcode Vevet.ScrollModule}. This property means that the value in ScrollModule becomes the same as here when dragging.
     * @property {boolean} [disableListeners=true] - If you need to set 'pointer-events: none' to children when dragging.
     * @property {number} [timeoutListeners=10] - Time after which 'pointer-events' will be removed from children after dragging stops.
     * @property {boolean} [draggable=true] - If true, the property "draggable" of all elements inside of the scorll outer will be set to false.
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
            multiplier: 1,
            momentum: true,
            friction: .95,
            ease: .15,
            disableListeners: true,
            timeoutListeners: 10,
            draggable: true,
            thresholdPropagation: false
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
            this._preventInnerDrag();
        }

        /**
         * @description Module event
         * @type { Array<string> }
         * @protected
         */
        this._moduleEvents = [];

        // override get ease
        this._overrideGetEase();

    }

    /**
     * @description Init vars.
     * @protected
     */
    _vars() {

        /**
         * @description If being dragged at the moment.
         * @type {boolean}
         * @protected
         */
        this._dragging = false;

        /**
         * @description Where drag classes are stored.
         * @type { Vevet.DraggerModule | false }
         * @protected
         */
        this._dragger = false;

    }

    /**
     * @description Prevent inner elements from dragging.
     * @protected
     */
    _preventInnerDrag() {

        const draggableEl = this._m.outer.querySelectorAll("img, a");
        draggableEl.forEach(el => {
            el.draggable = false;
            el.ondragstart = function () {
                return false;
            };
        });

    }



    // Set events
    _setEvents() {

        const module = this._m;

        // create a dragger
        const dragger = new DraggerModule({
            on: this._prop.on,
            parent: this,
            outer: module.outer,
            momentum: this._prop.momentum,
            friction: this._prop.friction
        });
        this._dragger = dragger;
        dragger.on("move", this._start.bind(this));
        dragger.on("move", this._move.bind(this));
        dragger.on("end", this._end.bind(this));

        // add a wheel event to the scroll to stop dragger
        const id = module.on("wheel", () => {
            dragger.stopDrag();
        });
        this._moduleEvents.push(id);

    }



    /**
     * @description Start dragging.
     * @protected
     */
    _start() {

        // return if disabled
        if (!this._m.prop.run || !this._prop.on) {
            return;
        }

        this._dragging = true;

    }

    /**
     * @description Moving.
     * @param {Vevet.DraggerModule.Callback} data
     * @protected
     */
    _move(data) {

        const thisProp = this._prop;
        const module = this._m

        // return if disabled
        if (!module.prop.run || !thisProp.on || !this._dragging) {
            return;
        }

        // play scroll
        this._m.play();

        // vars
        const step = data.step;
        const multiplier = thisProp.multiplier;

        // drag values
        const x = step.x * multiplier;
        const y = step.y * multiplier;

        // set new targets
        module.targetLeft -= x;
        module.targetTop -= y;

        // shrink target values
        module._boundariesBoth();

        // set scroll direction
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
        if (thisProp.disableListeners) {
            module.outer.classList.add(`${module._prefix}_dragging`);
        }

    }

    /**
     * @description Drag end.
     * @protected
     */
    _end() {

        const thisProp = this._prop;
        let module = this._m;

        // return if disabled
        if (!module.prop.run || !thisProp.on) {
            return;
        }

        // change bool
        this._dragging = false;

        // return listeners to the container
        if (thisProp.disableListeners) {
            setTimeout(() => {
                if (!this._dragging) {
                    module.outer.classList.remove(`${module._prefix}_dragging`);
                }
            }, thisProp.timeoutListeners);
        }

    }



    /**
     * @description Override elements ease.
     * @protected
     */
    _overrideGetEase() {

        // get module
        let module = this._m;

        // override
        let _getEase = module._getEase.bind(module);
        module._getEase = (el, intstant) => {
            let ease = _getEase(el, intstant);

            if (this._dragging) {
                return this._prop.ease;
            }
            else {
                return ease;
            }

        };

    }
    



    /**
     * @description Destory the class.
     */
    destroy() {

        super.destroy();

        this._moduleEvents.forEach(id => {
            this._m.remove(id);
        });

    }



}