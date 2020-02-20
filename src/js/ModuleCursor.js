const dom = require('dom-create-element');

import Module from './Module';
import merge from './merge';
const selectEl = require('select-el');
const lerp = require('lerp');

/**
 * @classdesc Custom cursor. <br>
 * Available targets:
 *  <ul>
 *      <li>create</li>
 *      <li>render</li>
 *  </ul>
 * <br><br> <b>import {ModuleCursor} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class ModuleCursor extends Module {


    
    /**
     * @memberof Vevet.ModuleCursor
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string|HTMLElement} [selector=body] - *** An outer element.
     * @property {number} [ease=.2] - The higher number, the faster the cursor will move.
     * @property {boolean} [run=true] - Change to false to stop the animation frame.
     */
    /**
     * @alias Vevet.ModuleCursor
     * 
     * @param {Vevet.ModuleCursor.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}cursor`;
    }

    /**
     * @readonly
     * @type {Vevet.ModuleCursor.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            selector: 'body',
            ease: .2,
            run: true
        });
    }

    /**
     * @member Vevet.ModuleCursor#prop
     * @memberof Vevet.ModuleCursor
     * @readonly
     * @type {Vevet.ModuleCursor.Properties}
     */

    /**
     * @member Vevet.ModuleCursor#_prop
     * @memberof Vevet.ModuleCursor
     * @protected
     * @type {Vevet.ModuleCursor.Properties}
     */

    /**
     * @function Vevet.ModuleCursor#changeProp
     * @memberof Vevet.ModuleCursor
     * @param {Vevet.ModuleCursor.Properties} [prop]
     */



    /**
     * @description The outer element.
     * @readonly
     * @member {HTMLElement}
     */
    get outer() {
        return this._outer;
    }
    /**
     * @description Get the cursor element.
     * @readonly
     * @type {HTMLElement}
     */
    get cursor() {
        return this._cursor;
    }



    // Extra constructor
    _extra() {

        super._extra();

        /**
         * @description Mouse position.
         * @protected
         * @type {Vevet.ModuleCursor.Coords}
         */
        this._mouse = {
            x: 0,
            y: 0
        };
        /**
         * @description Cursor centered position.
         * @protected
         * @type {Vevet.ModuleCursor.Coords}
         */
        this._pos = {
            x: 0,
            y: 0
        };

        // classes
        let prefix = this._prefix;
        this._classes = {
            show: `${prefix}_show`,
            click: `${prefix}_click`
        }

        // get the outer
        this._outer = selectEl.one(this._prop.selector);

        // create the cursor
        this._create();

        // animate the cursor
        this._runPrevBool = this._prop.run;
        this._play();

    }

    /**
     * @memberof Vevet.ModuleCursor
     * @typedef {object} Coords
     * @property {number} x
     * @property {number} y
     */

    // Change Properties
    _changeProp() {

        super._changeProp();

        if (this.prop.run !== this._runPrevBool) {
            this._play();
        }

        this._runPrevBool = this._prop.run;

    }



    
    /**
     * @description Create the cursor.
     * @protected
     */
    _create() {

        this._cursor = dom({
            selector: 'div',
            styles: this._prefix
        });
        this._outer.appendChild(this._cursor);

        this.lbt("create");

    }



    
    // Set events
    _setEvents() {

        super._setEvents();

        this.listener(this._outer, "mousemove", this._mousemove.bind(this));
        this.listener(this._outer, "mouseenter", this._mouseenter.bind(this));
        this.listener(this._outer, "mouseleave", this._mouseleave.bind(this));
        this.listener(this._outer, "mousedown", this._mousedown.bind(this));
        this.listener(this._outer, "mouseup", this._mouseup.bind(this));
        this.listener(window, "blur", this._blur.bind(this));

    }

    /**
     * @description Event of mousemove.
     * @param {object} e - Event.
     * @protected
     */
    _mousemove(e) {

        this._mouse.x = e.x;
        this._mouse.y = e.y;

        this._outer.classList.add(this._classes.show);
        
    }

    /**
     * @description Event of mouseenter.
     * @protected
     */
    _mouseenter() {

        this._outer.classList.add(this._classes.show);
        
    }

    /**
     * @description Event of mouseleave.
     * @protected
     */
    _mouseleave() {

        this._outer.classList.remove(this._classes.show);
        
    }

    /**
     * @description Event of mousedown.
     * @param {object} e - Event.
     * @protected
     */
    _mousedown(e) {

        if (e.which === 1) {
            this._cursor.classList.add(this._classes.click);
        }
        
    }

    /**
     * @description Event of mouseup.
     * @protected
     */
    _mouseup() {

        this._cursor.classList.remove(this._classes.click);
        
    }

    /**
     * @description Event on blur.
     * @protected
     */
    _blur() {

        this._cursor.classList.remove(this._classes.click);
        
    }



    /**
     * @description Start an animation frame.
     * @protected
     */
    _play() {

        if (this._prop.run) {

            window.requestAnimationFrame(this._play.bind(this));

            this._animate();

        }
        
    }



    /**
     * @description Animate the cursor.
     * @protected
     */
    _animate() {
        
        // calculate position
        this._animatePos();

        // apply styles
        this._render();

        this.lbt("render");
        
    }

    /**
     * @description Calculate position of the cursor.
     * @protected
     */
    _animatePos() {

        let width = this._cursor.clientWidth,
            height = this._cursor.clientHeight,
            targetX = this._mouse.x - width / 2,
            targetY = this._mouse.y - height / 2;

        this._pos.x = lerp(this._pos.x, targetX, this._prop.ease);
        this._pos.y = lerp(this._pos.y, targetY, this._prop.ease);
        
    }

    /**
     * @description Render the cursor, apply styles.
     * @protected
     */
    _render() {

        this._cursor.style.transform = `translate3d(${this._pos.x}px, ${this._pos.y}px, 0)`;
        
    }



}