import Module from '../../Module';
import utils from '../../core/utils';

/**
 * @classdesc This class is a base for {@linkcode Vevet.Timeline}.
 * Available targets:
 *  <ul>
 *      <li>progress - receives {@linkcode Vevet.TimelineBase.Data} as an argument</li>
 *  </ul>
 * This timeline ist not quite simple. It is based on window.requestAnimationFrame. With each frame,
 * current progress is calculated. Here there may exist five types of progress:
 *  <ul>
 *      <li>absolute - see {@linkcode Vevet.TimelineBase#absolute}</li>
 *      <li>progress - see {@linkcode Vevet.TimelineBase#progress}</li>
 *      <li>easing - see {@linkcode Vevet.TimelineBase#easing}</li>
 *      <li>scope - see {@linkcode Vevet.TimelineBase#scope}</li>
 *      <li>scopeEasing - see {@linkcode Vevet.TimelineBase#scopeEasing}</li>
 *  </ul>
 * <br><br> <b>import {TimelineBase} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class TimelineBase extends Module {


    
    /**
     * @memberof Vevet.TimelineBase
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * @augments Vevet.TimelineBase.Settings
     */
    /**
     * @alias Vevet.TimelineBase
     * @param {Vevet.TimelineBase.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    // Extra Constructor
    _extra() {

        super._extra();

        // variables
        this._settings = utils.merge(this.defaultSettings, this._responsiveProp._propInit);
        this._tickers();

        // nested timelines
        /**
         * @type {Array<Vevet.Timeline|Vevet.TimelineBase>}
         */
        this._timelines = [];
        this._timelinesCount = 0;

    }

    /**
     * @description Create tickers variables.
     * @protected
     */
    _tickers() {

        // progresses
        this._absolute = 0;
        this._progress = 0;
        this._easing = 0;
        this._scope = 0;
        this._scopeEasing = 0;

        // scope line
        this._scopeLine = 0;

    }



    /**
     * @memberof Vevet.TimelineBase
     * @typedef {object} Settings
     * @property {Array<number>} [line=[0, 1]] - When animation must start and end - callback "progress".
     * This property may be used for nested timelines.
     * When the value is [.15, .85], for example, {@linkcode Vevet.TimelineBase#progress} will be 0
     * until {@linkcode Vevet.TimelineBase#absolute} is .15 or more, and it will be 1 after {@linkcode Vevet.TimelineBase#absolute}
     * reaches .85 or more.
     * @property {Array<number>} [scope=[0, 1]] - Scope of the animation line.
     * Scope stretches {@linkcode Vevet.TimelineBase#scope} along {@linkcode Vevet.TimelineBase#progress}.
     * F.e., if {@linkcode Vevet.TimelineBase#progress} is 0 and scope is [.5, 1], 
     * {@linkcode Vevet.TimelineBase#scope} will be equal to 0.5.
     * @property {string|Array<number>} [easing] - Easing function of the animation.
     */
    /**
     * @description Get default settings.
     * @readonly
     * @type {Vevet.TimelineBase.Settings}
     */
    get defaultSettings() {
        return {
            line: [0, 1],
            scope: [0, 1],
            easing: this._vp.easing
        };
    }

    /**
     * @memberof Vevet.TimelineBase
     * @typedef {object} Data
     * @property {number} a - Absolute progress. 
     * See {@linkcode Vevet.TimelineBase#absolute}.
     * @property {number} p - Current progress. 
     * See {@linkcode Vevet.TimelineBase#progress}.
     * @property {number} e - Current progress according to the easing function. 
     * See {@linkcode Vevet.TimelineBase#easing}.
     * @property {number} s - Current progress according to the scope. 
     * See {@linkcode Vevet.TimelineBase#scope}.
     * @property {number} se - Current progress according to the scope and easing function. 
     * See {@linkcode Vevet.TimelineBase#scopeEasing}.
     * @property {Array<number>} scope - Scope of the animation line.
     * @property {Array<number>} line - When animation must start and end.
     */
    /**
     * @description Get animation data.
     * @readonly
     * @type {Vevet.TimelineBase.Data}
     */
    get data() {
        let settings = this._settings;
        return {
            a: this._absolute,
            p: this._progress,
            e: this._easing,
            s: this._scope,
            se: this._scopeEasing,
            scope: settings.scope,
            line: settings.line
        };
    }
    
    /**
     * @description Absolute timeline progress.
     * @readonly
     * @type {number}
     */
    get absolute() {
        return this._absolute;
    }
    /**
     * @description Relative timeline progress to the  'line' property.
     * @readonly
     * @type {number}
     */
    get progress() {
        return this._progress;
    }
    /**
     * @description Current progress according to the easing function. 
     * @readonly
     * @type {number}
     */
    get easing() {
        return this._easing;
    }
    /**
     * @description Relative progress to the 'scope' property. 
     * @readonly
     * @type {number}
     */
    get scope() {
        return this._scope;
    }
    /**
     * @description Current scope progress according to the easing function. 
     * @readonly
     * @type {number}
     */
    get scopeEasing() {
        return this._scopeEasing;
    }



    /**
     * @description Calculations.
     * @param {number} progress - Absolute, first-level progress.
     */
    calc(progress) {

        // get settings
        let settings = this._settings,
            line = settings.line,
            easingFunc = settings.easing,
            scope = settings.scope;

        // set progress
        this._absolute = progress;

        // calculate progress along the absolute progress
        if (line[0] === 0 & line[1] === 1) {
            this._progress = progress;
        }
        else {
            if (progress < line[0]) {
                this._progress = 0;
            }
            else if (progress >= line[0] & progress <= line[1]) {
                this._progress = utils.progress(progress, line);
            }
            else {
                this._progress = 1;
            }
        }

        // easing progress
        if (easingFunc === "linear") {
            this._easing = this._progress;
        }
        else {
            this._easing = utils.easing(this._progress, easingFunc);
        }

        // scope progress
        this._scopeLine = Math.abs(scope[0] - scope[1]);
        this._scope = this._getScopeProgress(this._progress);
        this._scopeEasing = this._getScopeProgress(this._easing);

        // launch callback
        this.lbt('progress', this.data);

        // imitate nested timelines
        if (this._timelinesCount > 0) {
            for (let i = 0; i < this._timelinesCount; i++) {
                this._timelines[i].imitate(this._progress);
            }
        }

    }

    /**
     * @description Get progress according to the scope.
     * @param {number} p - Progress.
     * @protected
     */
    _getScopeProgress(p) {

        let scope = this._settings.scope

        if (scope[0] < scope[1]) {
            p = scope[0] + (p * this._scopeLine);
        }
        else {
            p = scope[0] - (p * this._scopeLine);
        }

        return p; 

    }



    /**
     * @description Imitate progress animation.
     * @param {number} p - Progress from 0 to 1.
     * @param {Vevet.TimelineBase.Settings} [settings] - Animation settings. Thru direct usage,
     * you can change them at any time.
     */
    imitate(p, settings = this._settings) {
        this._settings = utils.merge(this.defaultSettings, settings);
        this.calc(p)
    }



    /**
     * @description Add a nested timeline.
     * @param {Vevet.TimelineBase|Vevet.Timeline} timeline
     */
    addTimeline(timeline) {
        this._timelines.push(timeline);
        this._timelinesCount++;
    }



    /**
     * @description Destroy the class.
     */
    destroy() {
        
        super.destroy();

        // destroy nested timelines
        this._timelines.forEach(timeline => {
            timeline.destroy();
        });
        
    }



}