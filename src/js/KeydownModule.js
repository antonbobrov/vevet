import Module from './Module';
import merge from './merge';

/**
 * @classdesc Keydown events.
 * Available targets:
 *  <ul>
 *      <li>queue - The combination of keys dialed in order<li>
 *      <li>once - One pressed key</li>
 *      <li>multi - A combination of keys dialed simultaneously</li>
 *  </ul>
 * <br><br> <b>import {KeydownModule} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class KeydownModule extends Module {


    
    /**
     * @memberof Vevet.KeydownModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {number} [interval=250] - Maximum interval between keydowns when using the target 'queue'.
     */
    /**
     * @alias Vevet.KeydownModule
     * 
     * @param {Vevet.KeydownModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.KeydownModule.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            interval: 250
        });
    }

    /**
     * @member Vevet.KeydownModule#prop
     * @memberof Vevet.KeydownModule
     * @readonly
     * @type {Vevet.KeydownModule.Properties}
     */

    /**
     * @member Vevet.KeydownModule#_prop
     * @memberof Vevet.KeydownModule
     * @protected
     * @type {Vevet.KeydownModule.Properties}
     */

    /**
     * @function Vevet.KeydownModule#changeProp
     * @memberof Vevet.KeydownModule
     * @param {Vevet.KeydownModule.Properties} [prop]
     */
    


    /**
     * @memberof Vevet.KeydownModule
     * @callback _callback
     * @param {KeyboardEvent} data
     */
    /**
     * @memberof Vevet.KeydownModule
     * @typedef {object} EventData
     * @augments Vevet.Event.EventData
     * @property {Vevet.KeydownModule.EventObj} data
     */
    /**
     * @memberof Vevet.KeydownModule
     * @typedef {object} EventObj
     * @augments Vevet.KeydownModule.EventObjSettings
     * @property {'queue'|'once'|'multi'} target
     * @property {Vevet.KeydownModule._callback} do
     */
    /**
     * @memberof Vevet.KeydownModule
     * @typedef {object} EventObjSettings
     * @augments Vevet.Event.EventObjSettings
     * @property {Array<number>} [keys] An array of key codes. 
     * @property {string} [input] You can also use a string to define keys instead of 'keys'.
     */
    /**
     * @description Add a callback.
     * 
     * @param {Vevet.KeydownModule.EventObj} data - Callback data.
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

    /**
     * @function Vevet.KeydownModule#on
     * @memberof Vevet.KeydownModule
     * 
     * @param {'queue'|'once'|'multi'} target
     * @param {Vevet.KeydownModule._callback} callback
     * @param {Vevet.KeydownModule.EventObjSettings} prop
     * 
     * @returns {string}
     */

    /**
     * @member Vevet.KeydownModule#_events
     * @memberof Vevet.KeydownModule
     * @protected
     * @type {Array<Vevet.KeydownModule.EventData>}
     */

    /**
     * @member Vevet.KeydownModule#events
     * @memberof Vevet.KeydownModule
     * @readonly
     * @type {Array<Vevet.KeydownModule.EventData>}
     */



    // Set Events
    _setEvents() {
     
        this.listener(window, 'keydown', (e) => {
            this._implement(e);
        });

    }



    /**
     * @description Launch callbacks on keydown.
     * 
     * @param {KeyboardEvent} e - Keydown Event object.
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