import utils from '../../core/utils';
import Plugin from '../Plugin';
import Interval from '../../modules/interval';

/**
 * @classdesc Automatic change of slides. <br>
 * <br><br> <b>import {SliderIntervalPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 * @requires Vevet.IntervalModule
 */
export default class SliderIntervalPlugin extends Plugin {


    
    /**
     * @memberof Vevet.SliderIntervalPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [on=true] - If enabled.
     * @property {number} [time=5000] - Interval between slides. 
     */
    /**
     * @alias Vevet.SliderIntervalPlugin
     * @description Construct the class.
     * 
     * @param {Vevet.SliderIntervalPlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.SliderIntervalPlugin.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            on: true,
            time: 5000
        });
    }

    /**
     * @member Vevet.SliderIntervalPlugin#prop
     * @memberof Vevet.SliderIntervalPlugin
     * @readonly
     * @type {Vevet.SliderIntervalPlugin.Properties}
     */

    /**
     * @member Vevet.SliderIntervalPlugin#_prop
     * @memberof Vevet.SliderIntervalPlugin
     * @protected
     * @type {Vevet.SliderIntervalPlugin.Properties}
     */

    /**
     * @function Vevet.SliderIntervalPlugin#changeProp
     * @memberof Vevet.SliderIntervalPlugin
     * @param {Vevet.SliderIntervalPlugin.Properties} [prop]
     */

    /**
     * @member Vevet.SliderIntervalPlugin#_m
     * @memberof Vevet.SliderIntervalPlugin
     * @protected
     * @type {Vevet.Slider|Vevet.SliderCanvas}
     */



    // Set events
    _setEvents() {
        
        let module = this._m;
        module.on("first", this._setInterval.bind(this));
        module.on("start", this._removeInterval.bind(this));
        module.on("end", this._setInterval.bind(this));
        module.on("hide", this._removeInterval.bind(this));
        module.on("shown", this._setInterval.bind(this));

    }

    // When properties are changed.
    _changeProp() {

        this._setInterval();

    }



    /**
     * @description Set interval.
     * @private
     */
    _setInterval() {

        // destroy previous interval
        this._removeInterval();

        // create new interval if enabled
        if (this._prop.on) {

            this._interval = new Interval({
                v: this._m.prop.v
            });
            this._interval.on('', () => {
                this._m.next(true);
            }, {
                interval: this._prop.time
            });

        }

    }

    /**
     * @description Destroy interval.
     * @private
     */
    _removeInterval() {

        if (this._interval) {
            this._interval.destroy();
            this._interval = false;
        }

    }



    // Destroy events
    _destroy() {

        super._destroy();

        this._removeInterval();

    }



}