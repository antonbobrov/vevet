import Module from './Module';
import merge from './merge';
const selectEl = require('select-el');

/**
 * @classdesc Dragger is the basis for such modules as Drag and Swipe. <br>
 * Available targets:
 *  <ul>
 *      <li>start - {@linkcode Vevet.ModuleDragger.Callback}<li>
 *      <li>end - {@linkcode Vevet.ModuleDragger.Callback}</li>
 *      <li>move - {@linkcode Vevet.ModuleDragger.Callback}</li>
 *      <li>up - {@linkcode Vevet.ModuleDragger.Callback}</li>
 *      <li>down - {@linkcode Vevet.ModuleDragger.Callback}</li>
 *      <li>left - {@linkcode Vevet.ModuleDragger.Callback}</li>
 *      <li>right - {@linkcode Vevet.ModuleDragger.Callback}</li>
 *  </ul>
 * <br><br> <b>import {Dragger} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Event
 */
export default class ModuleDragger extends Module {


    
    /**
     * @memberof Vevet.ModuleDragger
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string|HTMLElement|Window} outer - *** Selector of the element or the element itself.
     * @property {boolean} [ignoreOuter=true] - Swipe/Drag begins when it starts on the element under the selector.
     * Custom events are then called only if the movement is done inside the bounding of the element. Thought if
     * 'ignoreOuter' is true, swipe/drag can call the events even when the movement is out of the element's bounding.
     * @property {number} [min=100] - Minimum length of movement in pixels to launch events under the targets {@linkcode Vevet.ModuleDragger#_once}. 
     */
    /**
     * @alias Vevet.ModuleDragger
     * 
     * @param {Vevet.ModuleDragger.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.ModuleDragger.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            outer: '',
            ignoreOuter: true,
            min: 100
        });
    }

    /**
     * @member Vevet.ModuleDragger#prop
     * @memberof Vevet.ModuleDragger
     * @readonly
     * @type {Vevet.ModuleDragger.Properties}
     */

    /**
     * @member Vevet.ModuleDragger#_prop
     * @memberof Vevet.ModuleDragger
     * @protected
     * @type {Vevet.ModuleDragger.Properties}
     */

    /**
     * @function Vevet.ModuleDragger#changeProp
     * @memberof Vevet.ModuleDragger
     * @param {Vevet.ModuleDragger.Properties} [prop]
     */

    

    // Extra Constructor
    _extra() {

        super._extra();
        
        /**
         * @description Callback targets that are called only when drag or swipe ends.
         * @member {Array<string>}
         * @protected
         */
        this._once = [
            'up',
            'down',
            'left',
            'right'
        ];

        // start values
        this._xStart = null;
        this._yStart = null;

        // global values
        this._global = {
            x: 0,
            y: 0
        };

        // previous values
        this._prev = {
            x: 0,
            y: 0
        };

        // if dragging at the moment
        this._dragging = false;

        // get elements
        this._getElements();

    }

    _getElements() {

        // get elements
        this._outer = selectEl.one(this._prop.outer);

        // ignore outer
        if (this._prop.ignoreOuter) {
            this._outerIgnore = window;
        }
        else {
            this._outerIgnore = this._outer;
        }

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
     * @memberof Vevet.ModuleDragger
     * @typedef {object} Callback
     * @property {Vevet.ModuleDragger.Coords} global - Coordinates relative to the window. 
     * @property {Vevet.ModuleDragger.Coords} inner - Coordinates relative to the outer. 
     * @property {Vevet.ModuleDragger.Coords} diff - Difference between the start and current coordinates.
     * @property {Vevet.ModuleDragger.Coords} step - Difference between current and previous values.
     */
    /**
     * @memberof Vevet.ModuleDragger
     * @typedef {object} Coords
     * @property {number} x
     * @property {number} y
     */



    /**
     * @description Launch callbacks on actions.
     * 
     * @param {string} type - Type of action (drag|swipe).
     * @param {string} target - Target of actions.
     * @param {object} e - Event object.
     * 
     * @protected
     */
    _call(type, target, e) {

        // change dragging value
        if (target == 'start') {
            this._dragging = true;
        }
        // return if not dragging
        if (target !== 'start' & !this._dragging) {
            return;
        }
        // change dragging bool if end
        if (target == 'end') {
            this._dragging = false;
        }

        // calculate coordinates
        this._calc(type, target, e);

        // launch needed events
        this._callEvents(target);

        // change previous values
        this._prev.x = this._global.x;
        this._prev.y = this._global.y;

    }



    /**
     * @description Calculate coordinates.
     * 
     * @param {string} type - Type of action (drag|swipe).
     * @param {string} target - Target of actions.
     * @param {object} e - Event object.
     * 
     * @protected
     */
    _calc(type, target, e) {

        // get coordinates
        let x, y;
        if (type == 'swipe') {
            if (target != 'end' & !this._once.includes(target)) {
                x = e.targetTouches[0].pageX;
                y = e.targetTouches[0].pageY;
            }
            else {
                x = e.changedTouches[0].pageX;
                y = e.changedTouches[0].pageY;
            }
        }
        else {
            x = e.pageX;
            y = e.pageY;
        }
    
        // change values on start
        if (target == 'start') {

            // set start values
            this._xStart = x;
            this._yStart = y;
            // change global values
            this._global.x = x;
            this._global.y = y;
            // change previous values
            this._prev.x = x;
            this._prev.y = y;
    
        }
    
        // change values on other targets
        else {
    
            if (type == 'swipe') {
                if (target != 'end' & !this._once.includes(target)) {
                    this._global.x = x;
                    this._global.y = y;
                }
                else{
                    this._global.x = x;
                    this._global.y = y;
                }
            }
            else {
                this._global.x = x;
                this._global.y = y;
            }
    
        }

    }



    /**
     * @description Call custom events.
     * @param {string} target
     * @protected
     */
    _callEvents(target) {
        
        // get outer
        let outer = this._outer;

        // copy global
        let global = this._global;
    
        // go thru all events
        for (let i = 0; i < this._events.length; i++) {

            let event = this._events[i],
                eventTarget = event.data.target;

            // check if needed event
            if (eventTarget !== target) {
                continue;
            }
    
            // create coords
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
            diff.x = inner.x - (this._xStart - bounding.left);
            diff.y = inner.y - (this._yStart - bounding.top);
            
            // get step values
            step.x = global.x - this._prev.x;
            step.y = global.y - this._prev.y;

            // create object
            let obj = {
                global: global,
                inner: inner,
                diff: diff,
                step: step
            };

            // launch event
            this._callWithCoords(event, obj);
    
        }

    }



    /**
     * @description Call events and set coordinates as an argument.
     * @param {Vevet.Event.EventData} event
     * @param {Vevet.ModuleDragger.Callback} obj
     * @protected
     */
    _callWithCoords(event, obj) {

        // if once event
        if (this._once.includes(event.data.target)) {
            this._callOnce(event, obj);
            return;
        }

        // launch event
        this._launch(event, obj);

    }



    /**
     * @description Call events under the targets {@linkcode Vevet.ModuleDragger#_once}.
     * @param {Vevet.Event.EventData} event
     * @param {Vevet.ModuleDragger.Callback} obj
     * @protected
     */
    _callOnce(event, obj) {

        let allow = false,
            data = event.data,
            min = this._prop.min,
            global = this._global;

        // up
        if (data.target == 'up') {
            if (global.y < this._yStart) {
                if (Math.abs(this._yStart - global.y) > Math.abs(min)) {
                    allow = true;
                }
            }
        }

        // down
        if (data.target == 'down') {
            if (global.y > this._yStart) {
                if (Math.abs(this._yStart - global.y) > Math.abs(min)) {
                    allow = true;
                }
            }
        }

        // left
        if (data.target == 'left') {
            if (global.x < this._xStart) {
                if (Math.abs(this._xStart - global.x) > Math.abs(min)) {
                    allow = true;
                }
            }
        }

        // right
        if (data.target == 'right') {
            if (global.x > this._xStart) {
                if (Math.abs(this._xStart - global.x) > Math.abs(min)) {
                    allow = true;
                }
            }
        }

        // launch event
        if (allow) {
            this._launch(event, obj);
        }

    }



}