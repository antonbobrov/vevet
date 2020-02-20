import utils from '../../core/utils';
import Plugin from '../Plugin';
import Keydown from '../../modules/keydown';

/**
 * @classdesc Add keydown events to slider. <br>
 * <br><br> <b>import {SliderKeydownPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 * @requires Vevet.KeydownModule
 */
export default class SliderKeydownPlugin extends Plugin {


    
    /**
     * @memberof Vevet.SliderKeydownPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [on=true] - If enabled.
     * @property {string} [direction=h] - Direction: h - horizontal, v - vertical.
     */
    /**
     * @alias Vevet.SliderKeydownPlugin
     * @description Construct the class.
     * 
     * @param {Vevet.SliderKeydownPlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.SliderKeydownPlugin.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            on: true,
            direction: 'h'
        });
    }

    /**
     * @member Vevet.SliderKeydownPlugin#prop
     * @memberof Vevet.SliderKeydownPlugin
     * @readonly
     * @type {Vevet.SliderKeydownPlugin.Properties}
     */

    /**
     * @member Vevet.SliderKeydownPlugin#_prop
     * @memberof Vevet.SliderKeydownPlugin
     * @protected
     * @type {Vevet.SliderKeydownPlugin.Properties}
     */

    /**
     * @function Vevet.SliderKeydownPlugin#changeProp
     * @memberof Vevet.SliderKeydownPlugin
     * @param {Vevet.SliderKeydownPlugin.Properties} [prop]
     */

    /**
     * @member Vevet.SliderKeydownPlugin#_m
     * @memberof Vevet.SliderKeydownPlugin
     * @protected
     * @type {Vevet.SliderModule|Vevet.SliderCanvasModule}
     */


    
    // Set Events
    _setEvents() {

        // add wheel event
        this._keydown = new Keydown({
            v: this._m.prop.v
        });

        // add events
        let types = [37, 38, 39, 40];
        types.forEach((val) => {
            this._keydown.add({
                target: 'once',
                keys: [val],
                do: this._call.bind(this)
            });
        });

    }



    /**
     * @description Call events.
     * @param {object} e
     * @private
     */
    _call(e) {

        let prop = this._prop,
            module = this._m;

        // check if enabled
        if (!this._prop.on) {
            return;
        }

        // call events
        if (prop.direction === 'h') {
            if (e.keyCode === 37) {
                module.prev(true);
            }
            else if (e.keyCode === 39) {
                module.next(true);
            }
        }
        else if (prop.direction === 'v') {
            if (e.keyCode === 38) {
                module.prev(true);
            }
            else if (e.keyCode === 40){ 
                module.next(true);
            }
        }

    }



    // Destroy events
    _destroy() {

        super._destroy();

        this._keydown.destroy();

    }



}