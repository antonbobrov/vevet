import Module from './Module';

/**
 * @classdesc Intervals. It is based on the "setInterval" function, 
 * but its manipulating is more convenient. <br>
 * Here any target is available.
 * <br><br> <b>import {IntervalModule} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class IntervalModule extends Module {
    


    /**
     * @memberof Vevet.IntervalModule
     * @typedef {object} EventData
     * @augments Vevet.Event.EventData
     * @property {Vevet.IntervalModule.EventObj} data Callback data.
     */
    /**
     * @memberof Vevet.IntervalModule
     * @typedef {object} EventObj
     * @augments Vevet.IntervalModule.EventObjSettings
     * @property {Function} do
     */
    /**
     * @memberof Vevet.IntervalModule
     * @typedef {object} EventObjSettings
     * @augments Vevet.Event.EventObjSettings
     * @property {number} interval Interval of callbacks (ms). 
     * @property {boolean} [disableOnBlur] Disable interval on window blur.
     */
    /**
     * @description Add a callback.
     * 
     * @param {Vevet.IntervalModule.EventObj} data - Callback data.
     * @param {boolean} [bool=true] - Defines if the event is enabled.
     * 
     * @returns {string} Returns a string with an id of the callback.
     * 
     * @example
     * let id = interval.add({
     *     interval: 1000,
     *     do: () => {
     *         alert("callback launched");
     *     }
     * }, true);
     */
    add(data, bool = true) {
        return super.add(data, bool);
    }

    /**
     * @function Vevet.IntervalModule#on
     * @memberof Vevet.IntervalModule
     * 
     * @param {''} target
     * @param {Function} callback
     * @param {Vevet.IntervalModule.EventObjSettings} prop
     * 
     * @returns {string}
     */

    /**
     * @member Vevet.IntervalModule#_events
     * @memberof Vevet.IntervalModule
     * @protected
     * @type {Array<Vevet.IntervalModule.EventData>}
     */

    /**
     * @member Vevet.IntervalModule#events
     * @memberof Vevet.IntervalModule
     * @readonly
     * @type {Array<Vevet.IntervalModule.EventData>}
     */

    _addCallback(id) {

        let obj = this.get(id);
        if (!obj) {
            return false;
        }

        // create interval vars
        obj._intervalFunc = false;
        obj._focus = false;
        obj._blur = false;
        obj._on = obj.on;

        // disable on blur
        if (typeof obj.data.disableOnBlur != 'boolean') {
            obj.data.disableOnBlur = true;
        }

        // enable interval if possible
        if (obj.on) {
            if (obj.data.disableOnBlur) {
                if (document.hasFocus()) {
                    this._on(id);
                }
            }
            else {
                this._on(id);
            }
        }

        // add events
        if (obj.data.disableOnBlur) {
            obj._focus = this.listener(window, 'focus', this._on.bind(this, id));
            obj._blur = this.listener(window, 'blur', this._off.bind(this, id));
        }

    }
    


    _turnCallback(id) {

        let obj = this.get(id);
        
        obj._on = obj.on;

        if (obj.on) {
            if (obj.data.disableOnBlur) {
                if (document.hasFocus()) {
                    this._on(id);
                }
            }
            else {
                this._on(id);
            }
        }
        else {
            this._off(id);
        }

    }
    


    _removeCallback(id) {

        let obj = this.get(id);

        // remove interval
        if (obj._intervalFunc !== false) {
            clearInterval(obj._intervalFunc);
        }

        // remove events
        if (obj.data.disableOnBlur) {
            this.removeEventListener({
                id: obj._focus.id,
                el: obj._focus.el
            });
            this.removeEventListener({
                id: obj._blur.id,
                el: obj._blur.el
            });
        }

    }
    
    
    
    /**
     * @description Enable event.
     * 
     * @param {string} id - Id of the event.
     * 
     * @protected
     */
    _on(id){

        let obj = this.get(id);

        // disable interval at first
        this._off(id);

        if (!obj._on) {
            return;
        }

        // set interval
        if (obj.data.disableOnBlur) {
            if (document.hasFocus()) {
                this._enable(obj);
            }
        }
        else {
            this._enable(obj);
        }

    }

    /**
     * @description Enable interval
     * @param {Vevet.IntervalModule.EventData} obj 
     * @protected
     */
    _enable(obj) {
        
        obj._intervalFunc = setInterval(() => {
            this._launch(obj);
        }, obj.data.interval);

    }
    
    /**
     * @description Disable event.
     * 
     * @param {string} id - Id of the event.
     * 
     * @protected
     */
    _off(id) {

        let obj = this.get(id);

        // clear interval
        if (obj._intervalFunc !== false) {
            clearInterval(obj._intervalFunc);
            obj._intervalFunc = false;
        }

    }

    



}