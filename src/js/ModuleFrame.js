import Module from './Module';
import merge from './merge';

/**
 * @classdesc Animation Frame. It is based on window.requestAnimationFrame but supports fps from 1 to 60, playing and stopping and manipulation with callbacks. <br>
 * Here any target for callbacks is available because with each frame {@linkcode Vevet.Event#launchAll} is launched.
 * <br><br> <b>import {Frame} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class ModuleFrame extends Module {


    
    /**
     * @memberof Vevet.ModuleFrame
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {number} [fps=60] - Frames per second.
     */
    /**
     * @alias Vevet.ModuleFrame
     * 
     * @param {Vevet.ModuleFrame.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.ModuleFrame.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            fps: 60
        });
    }

    /**
     * @member Vevet.ModuleFrame#prop
     * @memberof Vevet.ModuleFrame
     * @readonly
     * @type {Vevet.ModuleFrame.Properties}
     */

    /**
     * @member Vevet.ModuleFrame#_prop
     * @memberof Vevet.ModuleFrame
     * @protected
     * @type {Vevet.ModuleFrame.Properties}
     */

    /**
     * @function Vevet.ModuleFrame#changeProp
     * @memberof Vevet.ModuleFrame
     * @param {Vevet.ModuleFrame.Properties} [prop]
     */



    // Extra Constructor
    _extra() {

        super._extra();

        // variables
        this._time = null;
        this._frameSeg = -1;
        this._frame = null;

        this._playing = false;

    }

    /**
     * @description Check if the animation frame is already launched.
     * @readonly
     * @default false
     * @type {boolean}
     */
    get playing() {
        return this._playing;
    }



    /**
     * @description Start the animation frame.
     * 
     * @returns {boolean} Returns true if launched.
     */
    play() {
        
        // check if already playing
        if (this._playing) {
            return false;
        }
        this._playing = true;

        // request animation frame
        this._start();

        return true;

    }

    /**
     * @description Start the animation frame.
     * @private
     * 
     * @param {number} timestamp - Timestamp.
     */
    _start(timestamp = 0) {

        this._frame = window.requestAnimationFrame(this._start.bind(this));

        // do
        if (this._time == null) {
            this._time = timestamp;
        }
        let seg = Math.floor((timestamp - this._time) / (1000 / this._prop.fps));
        if (seg > this._frameSeg) {
            this._frameSeg = seg;
            // launch all callbacks
            this.launchAll();
        }

    }

    /**
     * @description Pause animation.
     * @returns {boolean} Returns true if succeeded.
     */
    pause() {

        if (!this._playing) {
            return false;
        }

        // cancel animation frame
        window.cancelAnimationFrame(this._frame);

        // bool
        this._playing = false;

        return true;

    }



    /**
     * @description Destroy the animation frame.
     */
    destroy() {

        super.destroy();

        // stop frame
        this.pause();
        
    }



}