import utils from '../../core/utils';
import Plugin from '../Plugin';
import Wheel from '../../modules/wheel';

/**
 * @classdesc Add wheel events to slider. <br>
 * <br><br> <b>import {SliderWheelPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 * @requires Vevet.WheelEventModule
 */
export default class SliderWheelPlugin extends Plugin {


    
    /**
     * @memberof Vevet.SliderWheelPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {string|HTMLElement|Window} [outer] - Event outer. It can be also a selector. 
     * By default, the value is equal to the slider's outer.
     * @property {boolean} [on=true] - If enabled.
     * @property {number} [k=0.1] - Minimum length of wheel event in pixels. 
     */
    /**
     * @alias Vevet.SliderWheelPlugin
     * @description Construct the class.
     * 
     * @param {Vevet.SliderWheelPlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.SliderWheelPlugin.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            outer: false,
            on: true,
            k: .1
        });
    }

    /**
     * @member Vevet.SliderWheelPlugin#prop
     * @memberof Vevet.SliderWheelPlugin
     * @readonly
     * @type {Vevet.SliderWheelPlugin.Properties}
     */

    /**
     * @member Vevet.SliderWheelPlugin#_prop
     * @memberof Vevet.SliderWheelPlugin
     * @protected
     * @type {Vevet.SliderWheelPlugin.Properties}
     */

    /**
     * @function Vevet.SliderWheelPlugin#changeProp
     * @memberof Vevet.SliderWheelPlugin
     * @param {Vevet.SliderWheelPlugin.Properties} [prop]
     */

    /**
     * @member Vevet.SliderWheelPlugin#_m
     * @memberof Vevet.SliderWheelPlugin
     * @protected
     * @type {Vevet.SliderModule|Vevet.SliderCanvasModule}
     */


    
    // Set Events
    _setEvents() {

        // prop
        let prop = this._prop;

        // get outer
        let outer = prop.outer;
        if (!outer) {
            outer = this._m._outer;
        }
        else {
            outer = selectEl.one(outer);
        }

        // add wheel event
        this._wheel = new Wheel({
            v: this._m.prop.v,
            outer: outer
        });

        // add events
        let types = [
            'down', 
            'up'
        ];
        types.forEach((val) => {
            this._wheel.add({
                target: val,
                k: prop.k,
                do: this._call.bind(this, val)
            });
        });

    }



    /**
     * @description Call events.
     * @param {string} type
     * @private
     */
    _call(type) {

        let module = this._m;

        // check if enabled
        if (!this._prop.on) {
            return;
        }

        if (type === 'up') {
            module.prev();
        }
        else if (type === 'down') {
            module.next();
        }

    }



    // Destroy events
    _destroy() {

        super._destroy();

        this._wheel.destroy();

    }



}