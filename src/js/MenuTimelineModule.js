import MenuBaseModule from './MenuBaseModule';
import merge from './merge';
import TimelineBaseModule from './TimelineBaseModule';
import TimelineModule from './TimelineModule';

/**
 * @classdesc A class for creating pop-up menus.
 * All animation are carried out through {@linkcode Vevet.TimelineModule}.
 * This menu CAN be closed if the animaiton of its opening has not ended yet and vice versa. <br>
 * Available targets:
 *  <ul>
 *      <li>progress - timeline animation. Argument - {@linkcode Vevet.TimelineBaseModule.Data}</li>
 *      <li>progressOuter - animate the outer element. Argument - {@linkcode Vevet.TimelineBaseModule.Data}</li>
 *      <li>progressInner - animate inner elements. Argument - {@linkcode Vevet.TimelineBaseModule.Data}</li>
 *      <li>show - when the menu is being opened.</li>
 *      <li>shown - when the menu is opened, the process of animation has ended.</li>
 *      <li>hide - when the menu is being hidden.</li>
 *      <li>hidden - when the menu is hidden and the animation has ended.</li>
 *  </ul>
 * <br><br> <b>import {MenuTimelineModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.MenuTimelineModule : progress : Vevet.TimelineBaseModule.Data }
 * @vevetModuleCallback { Vevet.MenuTimelineModule : progressOuter : Vevet.TimelineBaseModule.Data }
 * @vevetModuleCallback { Vevet.MenuTimelineModule : progressInner : Vevet.TimelineBaseModule.Data }
 * @vevetModuleCallback { Vevet.MenuTimelineModule : show :  }
 * @vevetModuleCallback { Vevet.MenuTimelineModule : shown :  }
 * @vevetModuleCallback { Vevet.MenuTimelineModule : hide :  }
 * @vevetModuleCallback { Vevet.MenuTimelineModule : hidden :  }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.MenuBaseModule
 * @requires Vevet.TimelineModule
 * @requires Vevet.TimelineBaseModule
 */
export default class MenuTimelineModule extends MenuBaseModule {


    
    /**
     * @memberof Vevet.MenuTimelineModule
     * @typedef {object} Properties
     * @augments Vevet.MenuBaseModule.Properties
     * 
     * @property {object} [timeline] - Timeline settings.
     * @property {number} [timeline.duration=1500] - The total duration of showing/hiding the menu.
     * @property {Array<number>} [timeline.outerScope=[0, .25]] - *** In which scope of the main timeline the outer animation
     * will be carried out. For example, how the outer element will appear.
     * @property {Array<number>} [timeline.innerScope=[0, 1]] - *** In which scope of the main timeline the inner animation
     * will be carried out. For example, how links in the menu will appear after the outer element is shown.
     * @property {string|Array<number>} [timeline.easing] - Easing function of the animation.
     */
    /**
     * @alias Vevet.MenuTimelineModule
     * 
     * @param {Vevet.MenuTimelineModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.MenuTimelineModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
            timeline: {
                duration: 1500,
                outerScope: [0, .25],
                innerScope: [0, 1],
                easing: this._vp.easing
            }
        });

    }

    /**
     * @member Vevet.MenuTimelineModule#prop
     * @memberof Vevet.MenuTimelineModule
     * @readonly
     * @type {Vevet.MenuTimelineModule.Properties}
     */

    /**
     * @member Vevet.MenuTimelineModule#_prop
     * @memberof Vevet.MenuTimelineModule
     * @protected
     * @type {Vevet.MenuTimelineModule.Properties}
     */

    /**
     * @function Vevet.MenuTimelineModule#changeProp
     * @memberof Vevet.MenuTimelineModule
     * @param {Vevet.MenuTimelineModule.Properties} [prop]
     */



    // Extra Constructor
    _extra() {

        super._extra();

        let timelineProp = this._prop.timeline,
            easing = timelineProp.easing;

        /**
         * @description Main timeline
         * @member {Vevet.TimelineModule}
         * @protected
         */
        this._timeline = new TimelineModule();
        let timeline = this._timeline;
        timeline.on("progress", this._timelineAnimation.bind(this));
        timeline.on("end", this._timelineAnimationEnd.bind(this));

        /**
         * @description Outer timeline
         * @member {Vevet.TimelineBaseModule}
         * @protected
         */
        this._timelineOuter = new TimelineBaseModule({
            line: timelineProp.outerScope,
            easing: easing
        });
        this._timelineOuter.on("progress", this._timelineOuterAnimation.bind(this));
        timeline.addTimeline(this._timelineOuter);

        /**
         * @description Innter timeline
         * @member {Vevet.TimelineBaseModule}
         * @protected
         */
        this._timelineInner = new TimelineBaseModule({
            line: timelineProp.innerScope,
            easing: easing
        });
        this._timelineInner.on("progress", this._timelineInnerAnimation.bind(this));
        timeline.addTimeline(this._timelineInner);

    }



    /**
     * @description Animation.
     * @param {Vevet.TimelineBaseModule.Data} data
     * @protected
     */
    _timelineAnimation(data) {
        this.lbt("progress", data);
    }

    /**
     * @description When animation ends.
     * @protected
     */
    _timelineAnimationEnd() {

        // callbacks
        if (this._timeline.reversed) {
            this.lbt("hidden");
        }
        else {
            this.lbt("shown");
        }

        // vars
        let outer = this._outer,
            prefix = this._prefix;

        // manipulate with classes
        if (this._timeline.reversed) {
            outer.classList.remove(`${prefix}_show`);
            outer.classList.remove(`${prefix}_hide`);
        }

    }

    /**
     * @description Outer animation.
     * @param {Vevet.TimelineBaseModule.Data} data
     * @protected
     */
    _timelineOuterAnimation(data) {

        this.lbt("progressOuter", data);

        // vars
        let outer = this._outer,
            button = this._button,
            prefix = this._prefix;

        // manipulate with classes
        if (!this._timeline.reversed) {
            if (data.p > 0) {
                outer.classList.add(`${prefix}_show`);
                outer.classList.remove(`${prefix}_hide`);
                if (button) {
                    button.classList.add(`${prefix}-button_close`);
                }
            }
        }
        else {
            if (data.p < 1) {
                outer.classList.add(`${prefix}_hide`);
                if (button) {
                    button.classList.remove(`${prefix}-button_close`);
                }
            }
        }

    }

    /**
     * @description Inner animation.
     * @param {Vevet.TimelineBaseModule.Data} data
     * @protected
     */
    _timelineInnerAnimation(data) {
        this.lbt("progressInner", data);
    }



    /**
     * @description Show the menu.
     * @protected
     */
    _show() {

        super._show();

        // play the timeline
        let timeline = this._timeline;
        if (timeline.playing) {
            timeline.reverse();
        }
        else {
            if (timeline.reversed) {
                timeline.reverse();
            }
            timeline.play({
                duration: this._prop.timeline.duration,
                easing: this._prop.timeline.easing
            });
        }

    }

    /**
     * @description Hide the menu.
     * @protected
     */
    _hide() {

        super._hide();

        let timeline = this._timeline;
        if (timeline.playing) {
            timeline.reverse();
        }
        else {
            timeline.reverse();
            timeline.play({
                duration: this._prop.timeline.duration,
                easing: this._prop.timeline.easing
            });
        }

    }



}