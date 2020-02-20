import utils from '../../core/utils';
import Plugin from '../Plugin';
import Drag from '../../ModuleDrag';
import Swipe from '../../ModuleSwipe';

/**
 * @classdesc Add drag & swipe changes of slides. <br>
 * <br><br> <b>import {SliderSwipePlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 * @requires Vevet.ModuleDrag
 * @requires Vevet.ModuleSwipe
 */
export default class SliderSwipePlugin extends Plugin {


    
    /**
     * @memberof Vevet.SliderSwipePlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {string|HTMLElement|Window} [outer] - Event outer. It can be also a selector.
     * @property {boolean} [on=true] - If enabled.
     * @property {number} [min=100] - Minimum length of movement in pixels
     * @property {string} [direction=h] - Direction: h - horizontal, v - vertical.
     */
    /**
     * @alias Vevet.SliderSwipePlugin
     * @description Construct the class.
     * 
     * @param {Vevet.SliderSwipePlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.SliderSwipePlugin.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            outer: false,
            on: true,
            min: 100,
            direction: 'h'
        });
    }

    /**
     * @member Vevet.SliderSwipePlugin#prop
     * @memberof Vevet.SliderSwipePlugin
     * @readonly
     * @type {Vevet.SliderSwipePlugin.Properties}
     */

    /**
     * @member Vevet.SliderSwipePlugin#_prop
     * @memberof Vevet.SliderSwipePlugin
     * @protected
     * @type {Vevet.SliderSwipePlugin.Properties}
     */

    /**
     * @function Vevet.SliderSwipePlugin#changeProp
     * @memberof Vevet.SliderSwipePlugin
     * @param {Vevet.SliderSwipePlugin.Properties} [prop]
     */

    /**
     * @member Vevet.SliderSwipePlugin#_m
     * @memberof Vevet.SliderSwipePlugin
     * @protected
     * @type {Vevet.Slider|Vevet.SliderCanvas}
     */


    
    // Extra Constructor
    _extra() {

        super._extra();

        /**
         * @description Where drag classes are stored.
         * @type {Array<Vevet.ModuleDragger|Vevet.ModuleSwipe|Vevet.ModuleDrag>}
         * @private
         */
        this._draggers = [];

    }

    // Set events
    _setEvents() {

        this._dragSet();

    }

    // Change properties
    _changeProp() {

        this._dragSet();

    }



    /**
     * @description Set drag events.
     * @private
     */
    _dragSet() {

        // first of all, remove previous events
        this._dragRemove();

        // check if enabled
        if (!this._prop.on) {
            return;
        }

        this._dragAdd("drag");
        this._dragAdd("swipe");

    }

    /**
     * @description Remove drag events.
     * @private
     */
    _dragRemove() {

        this._draggers.forEach(event => {
            event.destroy();
        });
        this._draggers = [];

    }

    /**
     * @description Add a drag/swipe event.
     * @param {string} type
     * @private
     */
    _dragAdd(type) {

        // get outer
        let outer = this._prop.outer;
        if (!outer) {
            outer = this._m._outer;
        }
        else {
            outer = selectEl.one(outer);
        }
        
        // dragger
        let dragger;

        // properties
        let prop = {
            v: this._m.prop.v,
            outer: outer
        };

        // create draggers
        if (type == 'swipe') {
            dragger = new Swipe(prop);
        }
        else {
            dragger = new Drag(prop);
        }
        this._draggers.push(dragger);

        // event types
        let horizontal = [['right', 'prev'], ['left', 'next']],
            vertical = [['up', 'next'], ['down', 'prev']],
            needed = this._prop.direction == 'h' ? horizontal: vertical;
        
        // add events
        needed.forEach(e => {
            this._dragAddEvent(dragger, e[0], e[1]);
        });

    }

    /**
     * @description Add a drag/swipe event.
     * @param {Vevet.ModuleDrag|Vevet.ModuleSwipe} dragger
     * @param {string} target
     * @param {string} method
     * @private
     */
    _dragAddEvent(dragger, target, method) {

        dragger.on(target, () => {
            this._m[method]();
        }, {
           min: this._prop.min 
        });

    }



    // Destroy events
    _destroy() {

        super._destroy();

        this._dragRemove();

    }



}