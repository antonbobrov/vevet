import Plugin from './Plugin';
import merge from './merge';
import SwipeModule from './SwipeModule';
import DragModule from './DragModule';

const selectEl = require('select-el');

/**
 * @classdesc Add drag & swipe changes of slides. <br>
 * <br><br> <b>import {SliderDragSwipePlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 * @requires Vevet.DragModule
 * @requires Vevet.SwipeModule
 */
export default class SliderDragSwipePlugin extends Plugin {


    
    /**
     * @memberof Vevet.SliderDragSwipePlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {string|HTMLElement|Window} [outer] - Event outer. It can be also a selector.
     * @property {boolean} [on=true] - If enabled.
     * @property {number} [min=100] - Minimum length of movement in pixels
     * @property {string} [direction=h] - Direction: h - horizontal, v - vertical.
     */
    /**
     * @alias Vevet.SliderDragSwipePlugin
     * @description Construct the class.
     * 
     * @param {Vevet.SliderDragSwipePlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.SliderDragSwipePlugin.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            outer: false,
            on: true,
            min: 100,
            direction: 'h'
        });
    }

    /**
     * @member Vevet.SliderDragSwipePlugin#prop
     * @memberof Vevet.SliderDragSwipePlugin
     * @readonly
     * @type {Vevet.SliderDragSwipePlugin.Properties}
     */

    /**
     * @member Vevet.SliderDragSwipePlugin#_prop
     * @memberof Vevet.SliderDragSwipePlugin
     * @protected
     * @type {Vevet.SliderDragSwipePlugin.Properties}
     */

    /**
     * @function Vevet.SliderDragSwipePlugin#changeProp
     * @memberof Vevet.SliderDragSwipePlugin
     * @param {Vevet.SliderDragSwipePlugin.Properties} [prop]
     */

    /**
     * @member Vevet.SliderDragSwipePlugin#_m
     * @memberof Vevet.SliderDragSwipePlugin
     * @protected
     * @type {Vevet.SliderModule|Vevet.SliderCanvasModule}
     */


    
    // Extra Constructor
    _extra() {

        super._extra();

        /**
         * @description Where drag classes are stored.
         * @type {Array<Vevet.DraggerModule|Vevet.SwipeModule|Vevet.DragModule>}
         * @protected
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
     * @protected
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
     * @protected
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
     * @protected
     */
    _dragAdd(type) {

        // get outer
        let outer = this._prop.outer;
        if (!outer) {
            outer = this._m.outer;
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
            dragger = new SwipeModule(prop);
        }
        else {
            dragger = new DragModule(prop);
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
     * @param {Vevet.DragModule|Vevet.SwipeModule} dragger
     * @param {string} target
     * @param {string} method
     * @protected
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