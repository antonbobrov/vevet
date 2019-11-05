import Module from '../Module';

/**
 * @classdesc Intervals. It is based on the "setInterval" function, 
 * but its manipulating is more convenient. <br>
 * Here any target is available.
 * <br><br> <b>import {Interval} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class Interval extends Module {
    


    /**
     * @memberof Vevet.Interval
     * @typedef {object} EventObj
     * @augments Vevet.Event.EventObj
     * @property {number} [interval] Interval of callbacks (ms). 
     * @property {boolean} [disableOnBlur=true] Disable interval on window blur. 
     * @property {Function} do Callback itself.
     */
    /**
     * @description Add a callback.
     * 
     * @param {Vevet.Interval.EventObj} data - Callback data.
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
     * @private
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
     * @private
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