import Module from '../Module';
import utils from '../../core/utils';

/**
 * @classdesc Keydown events.
 * Available targets:
 *  <ul>
 *      <li>queue - The combination of keys dialed in order<li>
 *      <li>once - One pressed key</li>
 *      <li>multi - A combination of keys dialed simultaneously</li>
 *  </ul>
 * <br><br> <b>import {Keydown} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class Keydown extends Module {


    
    /**
     * @memberof Vevet.Keydown
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {number} [interval=250] - Maximum interval between keydowns when using the target 'queue'.
     */
    /**
     * @alias Vevet.Keydown
     * 
     * @param {Vevet.Keydown.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.Keydown.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            interval: 250
        });
    }

    /**
     * @member Vevet.Keydown#prop
     * @memberof Vevet.Keydown
     * @readonly
     * @type {Vevet.Keydown.Properties}
     */

    /**
     * @member Vevet.Keydown#_prop
     * @memberof Vevet.Keydown
     * @protected
     * @type {Vevet.Keydown.Properties}
     */

    /**
     * @function Vevet.Keydown#changeProp
     * @memberof Vevet.Keydown
     * @param {Vevet.Keydown.Properties} [prop]
     */
    


    /**
     * @memberof Vevet.Keydown
     * @typedef {object} EventObj
     * @augments Vevet.Event.EventObj
     * @property {Array<number>} [keys] An array of key codes. 
     * @property {string} [input] You can also use a string to define keys instead of 'keys'.
     */
    /**
     * @description Add a callback.
     * 
     * @param {Vevet.Keydown.EventObj} data - Callback data.
     * @param {boolean} [bool=true] - Defines if the event is enabled.
     * 
     * @returns {string} Returns a string with the callback's id.
     * 
     * @example
     * let id = keydown.add({
     *     target: 'queue',
     *     keys: [72, 73],
     *     // input: 'hello',
     *     do: () => {
     *         alert("callback launched");
     *     }
     * }, true);
     */
    add(data, bool = true) {

        if (typeof data.input != 'undefined') {
            data.input = data.input.toUpperCase();
            data.keys = [];
            for (let i = 0; i < data.input.length; i++) {
                data.keys.push(data.input[i].charCodeAt(0));
            }
        }

        return super.add(data, bool);

    }



    // Set Events
    _setEvents() {
     
        this.listener(window, 'keydown', (e) => {
            this._implement(e);
        });

    }



    /**
     * @description Launch callbacks on keydown.
     * 
     * @param {object} e - Event object.
     * 
     * @private
     */
    _implement(e) {

        // go thru all events
        this._events.forEach((el) => {
            
            // check if event is enabled
            if (!el.on) return;

            // data copy
            let data = el.data;

            // once target
            if (data.target === 'once') {
                if (e.keyCode === data.keys[0]) {
                    this._launch(el, e);
                }
            }

            // queue target
            else if (data.target === 'queue') {

                // create a string of keys if not exists
                if (typeof el.string == "undefined") {
                    el.string = '';
                }
                el.string += '-' + e.keyCode;

                // create a comparative string of keys
                if (typeof el.compareString == "undefined") {
                    el.compareString = '';
                    for (let a = 0; a < data.keys.length; a++) {
                        el.compareString += '-' + data.keys[a];
                    }
                }

                // compare strings
                if (el.string.includes(el.compareString)) {
                    this._launch(el, e);
                    el.string = '';
                }

            }

            // multiple keys
            else if (data.target === 'multi') {

                // comparative array
                if (typeof el.array == "undefined") {
                    el.array = [];
                }
                el.array.push(e.keyCode);

                // interval to clear the array
                setTimeout(() => {
                    el.array = [];
                }, this._prop.interval);

                // get overlapings
                let overlaps = 0;
                for (let a = 0; a < data.keys.length; a++) {
                    for (let b = 0; b < el.array.length; b++) {
                        if (data.keys[a] === el.array[b]) {
                            overlaps++;
                        }
                    }
                }

                // compare count of overlapings
                if (data.keys.length === overlaps) {
                    this._launch(el, e);
                    el.array = [];
                }

            }

        });

    }

    



}