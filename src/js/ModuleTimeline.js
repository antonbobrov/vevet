import merge from './merge';
import ModuleTimelineBase from './ModuleTimelineBase';

/**
 * @classdesc This class is used for creating & playing timelines.
 * Available targets:
 *  <ul>
 *      <li>play</li>
 *      <li>pause</li>
 *      <li>resume</li>
 *      <li>progress</li>
 *      <li>end</li>
 *      <li>stop</li>
 *      <li>reverse</li>
 *  </ul>
 * Each callback will receive the object {@linkcode Vevet.ModuleTimelineBase.Data} as an argument.
 * <br><br> <b>import {Timeline} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.ModuleTimelineBase
 */
export default class ModuleTimeline extends ModuleTimelineBase {


    
    /**
     * @memberof Vevet.ModuleTimeline
     * @typedef {object} Properties
     * @augments Vevet.ModuleTimelineBase.Properties
     * @augments Vevet.ModuleTimeline.Settings
     * 
     * @property {boolean} [destroyOnEnd=false] - Destroy the timeline when it ends.
     */
    /**
     * @alias Vevet.ModuleTimeline
     * @param {Vevet.ModuleTimeline.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    // Extra Constructor
    _extra() {

        super._extra();

        // variables
        this._playing = false;
        this._paused = false;
        this._stopped = false;
        this._reversed = false;
        this._frame = null;

    }

    /**
     * @description Create tickers variables.
     * @protected
     */
    _tickers() {

        super._tickers();

        this._ticker = 0;
        this._lastFrame = 0;

    }



    /**
     * @memberof Vevet.ModuleTimeline
     * @typedef {object} Settings
     * @augments Vevet.ModuleTimelineBase.Settings
     * @property {number} [duration=750] - Duration of the animation.
     * @property {boolean} [autoDuration=false] - Defines if the duration can be changed according to the animation scope.
     */
    /**
     * @description Get default settings.
     * @readonly
     * @type {Vevet.ModuleTimeline.Settings}
     */
    get defaultSettings() {
        return merge(super.defaultSettings, {
            duration: 750,
            autoDuration: false
        });
    }

    /**
     * @description Check if the timeline is already playing.
     * @readonly
     * @default false
     * @type {boolean}
     */
    get playing() {
        return this._playing;
    }
    
    /**
     * @description Check if the timeline is reversed.
     * @readonly
     * @default false
     * @type {boolean}
     */
    get reversed() {
        return this._reversed;
    }

    /**
     * @memberof Vevet.ModuleTimeline
     * @typedef {object} Data
     * @augments Vevet.ModuleTimelineBase.Data
     * @property {number} duration - Duration of the animation.
     */
    /**
     * @description Get animation data.
     * @readonly
     * @type {Vevet.ModuleTimeline.Data}
     */
    get data() {
        return merge(super.data, {
            duration: this._settings.duration
        });
    }



    /**
     * @description Start animation. Launch requestAnimationFrame.
     * Common for {@linkcode Vevet.ModuleTimeline#play} & {@linkcode Vevet.ModuleTimeline#resume}.
     * @private
     */
    _start() {

        // change values
        this._lastFrame = Date.now();

        // change states
        this._playing = true;
        this._paused = false;
        this._stopped = false;

        // launch frame
        this._frame = window.requestAnimationFrame(this._animate.bind(this));

    }

    /**
     * @description Stop animation and set progress to zero.
     * Common for {@linkcode Vevet.ModuleTimeline#stop} & {@linkcode Vevet.ModuleTimeline#pause}.
     * @private
     */
    _stop() {

        this._playing = false;

        if (this._frame != null) {
            cancelAnimationFrame(this._frame);
            this._frame = null;
        }

    }



    /**
     * @description Start the timeline.
     * @param {Vevet.ModuleTimeline.Settings} data - Settings of the animation.
     * @returns {Vevet.ModuleTimeline} Returns 'this'.
     */
    play(data = this._settings) {
        
        // check if already playing
        if (this._playing) {
            return this;
        }
        // check if paused
        if (this._paused) {
            return this.resume();
        }

        // reset tickers
        if (!this._reversed) {
            this._tickers();
        }
        
        // get properties
        this._settings = merge(this.defaultSettings, data);
        let settings = this._settings;

        // get scope line
        let scope = settings.scope,
            scopeLine = Math.abs(scope[0] - scope[1]);

        // change duration according to the scope
        if (settings.autoDuration) {
            settings.duration *= scopeLine;
        }

        // launch animation
        this._start();

        // launch callback
        this.lbt('play', this.data);

        return this;

    }

    /**
     * @description Pause animation.
     * @returns {Vevet.ModuleTimeline} Returns 'this'.
     */
    pause() {

        // check if not playing
        if (!this._playing) {
            return this;
        }

        // pause
        this._paused = true;
        this._stop();

        // launch callback
        this.lbt("pause", this.data);

        return this;

    }

    /**
     * @description Resume animation after it is paused.
     * @returns {Vevet.ModuleTimeline} Returns 'this'.
     */
    resume() {

        // check if playing
        if (this._playing) {
            return this;
        }
        // check if not paused
        if (!this._paused) {
            return this;
        }
        // check if not ended
        if (this._absolute === 1) {
            return this;
        }

        // launch animation
        this._start();

        // launch callback
        this.lbt("resume", this.data);

        return this;

    }

    /**
     * @description Stop animation and set progress to zero.
     * @returns {Vevet.ModuleTimeline} Returns 'this'.
     */
    stop() {

        // reset states & stop the animation
        this._stopReset();
        this._reversed = false;

        // reset tickers
        this._tickers();
        this._stopped = true;

        // launch callback
        this.lbt("stop", this.data);

        return this;

    }

    /**
     * @description Stop animation and set progress to zero.
     * @private
     */
    _stopReset() {

        this._paused = false;
        this._stopped = false;

        this._stop();

    }

    /**
     * @description Reverse animation. This method does'nt start the animation line.
     * @returns {Vevet.ModuleTimeline} Returns 'this'.
     */
    reverse() {

        if (this._reversed) {
            this._reversed = false;
        }
        else {
            this._reversed = true;
        }

        // launch callback
        this.lbt('reverse', this.data);

        return this;

    }



    /**
     * @description Animation itself.
     * @private
     */
    _animate() {

        let now = Date.now(),
            frameDuration = now - this._lastFrame;

        // iterate ticker
        if (!this._reversed) {
            this._ticker += frameDuration;
        }
        else {
            this._ticker -= frameDuration;
        }

        // get progress
        let progress = this._ticker / this._settings.duration;
        if (progress > 1) {
            progress = 1;
        }
        if (progress < 0) {
            progress = 0;
        }
        
        // calculate values
        this.calc(progress);

        // if need to stop
        let stop = false,
            end = false;
        if (!this._reversed) {
            if (this._progress === 1) {
                stop = true;
                end = true;
            }
        }
        else {
            if (this._progress === 0) {
                stop = true;
                end = true;
            }
        }

        // stop animation
        if (stop) {
            this._stopReset();
        }

        // end callback
        if (end) {
            this.lbt('end');
        }

        // destroy & stop
        if (stop) {
            // destroy the class
            if (this._prop.destroyOnEnd) {
                this.destroy();
            }
            return;
        }

        // frame difference, set last frame time
        this._lastFrame = now;

        // frame
        this._frame = window.requestAnimationFrame(this._animate.bind(this));

    }



    /**
     * @description Destroy the class.
     */
    destroy() {
        
        super.destroy();

        // destroy animation frame
        if (this._frame != null) {
            cancelAnimationFrame(this._frame);
            this._frame = null;
        }
        
    }



}