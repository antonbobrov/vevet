import Module from '../Module';
import utils from '../../core/utils';

/**
 * @classdesc Wheel events. <br>
 * Available targets:
 *  <ul>
 *      <li>up</li>
 *      <li>down</li>
 *      <li>left</li>
 *      <li>right</li>
 *  </ul>
 * Each callback will receive the event object as an argument.
 * <br><br> <b>import {Wheel} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class Wheel extends Module {


    
    /**
     * @memberof Vevet.Wheel
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string|HTMLElement|Window} [outer=window] - *** Outer element.
     * @property {number} [interval=200] - Maximum interval between wheel events.
     */
    /**
     * @alias Vevet.Wheel
     * 
     * @param {Vevet.Wheel.Properties} data
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.Wheel.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            outer: window,
            interval: 200
        });
    }

    /**
     * @member Vevet.Wheel#prop
     * @memberof Vevet.Wheel
     * @readonly
     * @type {Vevet.Wheel.Properties}
     */

    /**
     * @member Vevet.Wheel#_prop
     * @memberof Vevet.Wheel
     * @protected
     * @type {Vevet.Wheel.Properties}
     */

    /**
     * @function Vevet.Wheel#changeProp
     * @memberof Vevet.Wheel
     * @param {Vevet.Wheel.Properties} [prop]
     */


    
    // Extra for Constructor

    _extra() {

        super._extra();

        // start time
        this._time = +new Date();

        // get element
        this._outer = utils.element(this._prop.outer);

    }



    /**
     * @description Set events on wheel.
     * @protected
     */
    _setEvents() {

        this.listener(this._outer, 'wheel', (e) => {
            this._implement(e);
        }, {
            passive: true
        });

    }
    


    /**
     * @memberof Vevet.Wheel
     * @typedef {object} EventObj
     * @augments Vevet.Event.EventObj
     * @property {number} k Minimal length of wheel event in pixels. 
     * @property {Function} do Callback itself.
     */
    /**
     * @description Add a callback.
     * 
     * @param {Vevet.Wheel.EventObj} data - Object with callback information.
     * @param {boolean} [bool=true] - Defines whether the event enabled or not.
     * 
     * @returns {string} Returns a string with an id of the callback.
     * 
     * @example
     * let wheel = new Wheel({
     *      outer: window
     * });
     * let id = wheel.add({
     *     target: 'down',
     *     k: 0.1,
     *     do: () => {
     *         alert("callback launched");
     *     }
     * }, true);
     */
    add(data, bool = true) {
        return super.add(data, bool);
    }



    /**
     * @description Launch callbacks on wheel.
     * 
     * @param {object} e - Event object.
     * 
     * @private
     */
    _implement(e) {

        // watch the time interval
        let time = +new Date();
		if (time - this._time < this._prop.interval) {
			return;
        }
        else {
			this._time = time;
        }

        // delta
        let wheel = utils.normalizeWheel(e),
            y = wheel.spinY,
            x = wheel.spinX;

        // search for callbacks
        for (let i = 0; i < this._events.length; i++) {

            let obj = this._events[i];

            // up
            if (obj.data.target === 'up') {
                if (y < 0 & y < obj.data.k * -1) {
                    this._launch(obj, e);
                }
            }

            // down
            if (obj.data.target === 'down') {
                if (y > 0 & y > obj.data.k) {
                    this._launch(obj, e);
                }
            }
    
            // left
            if (obj.data.target === 'left') {
                if (x < 0 & x < obj.data.k * -1) {
                    this._launch(obj, e);
                }
            }
    
            // right
            if (obj.data.target === 'right') {
                if (x > 0 & x > obj.data.k) {
                    this._launch(obj, e);
                }
            }

        }

    }



}