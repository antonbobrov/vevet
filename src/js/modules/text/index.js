let isarray = require("isarray");

import TextSplit from '../textSplit';
import Timeline from '../timeline';
import utils from '../../core/utils';

let elementary = require("./_elementary");
let composite_elementary = require("./_composite_elementary");

/**
 * @classdesc Animation of text. <br>
 * Available types of animation by default:
 *  <ul>
 *      <li>letter</li>
 *      <li>word</li>
 *      <li>wordletter</li>
 *      <li>line</li>
 *      <li>lineletter</li>
 *      <li>lineword</li>
 *  </ul>
 *  Available targets:
 *  <ul>
 *      <li>resize - when window is resizes.</li>
 *      <li>split - when the text is splitted into letters, words & lines.</li>
 *  </ul>
 * <br><br> <b>import {Text} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.TextSplit
 * @requires Vevet.Timeline
 */
export default class Text extends TextSplit {


    
    /**
     * @memberof Vevet.Text
     * @typedef {object} Properties
     * @augments Vevet.TextSplit.Properties
     */
    /**
     * @alias Vevet.Text
     * 
     * @param {Vevet.Text.Properties} data
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}text`;
    }



    /**
     * @description If animation in process.
     * @readonly
     * @type {boolean}
     */
    get playing() {
        return this._playing;
    }



    // Extra for Constructor
    
    _extra() {
        
        // vars
        this._playing = false;
        this._timeline = false;

        // split text
        super._extra();

    }



    // Resize & Split

    _resize() {
        
        setTimeout(() => {
            this._resizeText();
        }, this._prop.resizeTimeout);

    }
    
    _resizeText() {

        if (this._playing) {
            this._timeline.add({
                target: 'end',
                do: () => {
                    this._resizeFunc();
                },
                once: true
            });
        }
        else {
            this._resizeFunc();
        }

    }



    /**
     * @memberof Vevet.Text
     * @typedef {object} Settings
     * @property {Array<string>} [types=['letter']] - Types of animation. All types of animation can be combined! See the types at the top.
     * @property {number} [durationElement=250] - Duration of animation of each element according to the chosen type of animation.
     * @property {boolean} [durationAuto=true] - Defines if the total duration will be calculated accorging to the totalamount of elements.
     * @property {number} [duration=2500] - Total duration of the animation (will be taken into account only if durationAuto is false).
     * @property {string|Array<number>|Function} [easing=linear] - Easing function of the Timeline.
     * @property {string|Array<number>|Function} [easingEl] - Easing function of elements. The default value is equal to {@linkcode Vevet.Application#easing}.
     * @property {Array<Vevet.Text.SettingStyle>} [letter] - Array of actions to change styles of each element. Fill it if one of your types is 'letter'.
     * @property {Array<Vevet.Text.SettingStyle>} [word] - Array of actions to change styles of each element. Fill it if one of your types is 'word'.
     * @property {Array<Vevet.Text.SettingStyle>} [line] - Array of actions to change styles of each word in the line. Fill it if one of your types is 'line'.
     * @property {number} [shift=0.2] - Shift in animation chain between elements. F.e., if 0.2 then the animation of the second element will start after 80% of animation of the first element passed.
     * @property {number} [shiftLine=0.2] - Almost the same as the previous value, though it is active for the 'line' type only.
     * @property {number} [reverse=false] - Defines if the chain of animation of the elements will be reversed. It is not the same as {@linkcode Vevet.Timeline}.
     * @property {number} [reverseComposite=false] - Defines if the chain of animation of parent elements will be reversed. It is actual only for composite types of animation.
     * @property {number} [shuffle=false] - If true, the chain of animation of the elements will be chaotic.
     * @property {number} [center=false] - If animation must start from center. Not available for 'lineletter' & 'lineword'.
     * @property {Array<Vevet.Text.SettingCallback>} [callbacks] - Callbacks on the animation process.
     */
    /**
     * @memberof Vevet.Text
     * @typedef {object} SettingStyle
     * @property {Array<number>} [scope=[0,1]] - Scope of the animation for each element. It defines the edges of the animation line. Numbers from 0 to 1 are available. F.e., [0, 1].
     * @property {string} [property] - The name of a css property to be changed. You can even skip it if you want to. F.e. you need to create a scramble-text-animation. In this case, you, perhaps will not need to change any css properties, though the "value" could be used as a callback for other changes.
     * @property {Function} value - A new value of the property. The function will recieve an object {@linkcode Vevet.Text.StyleArgument} as an argument and must return a new value for the property.
     * @property {boolean} [remove=false] - Defines if we need to remove a css property after its animation is proceeded.
     */
    /**
     * @memberof Vevet.Text
     * @typedef {object} StyleArgument
     * @property {number} p - Current progress of animation.
     * @property {number} e - Current progress of animation according to 'easingEl' function.
     * @property {number} position - Position of the element in the animation stack.
     * @property {number} total - Total amount of elements in the animation.
     * @property {HTMLElement} el - The element to be animated.
     */
    /**
     * @memberof Vevet.Text
     * @typedef {object} SettingCallback
     * @property {number} target - The moment of the animation line at which the callback will be launched.
     * @property {string} do - The callback itself. Each callback wil recieve an object !!!!!!!! as an argument.
     */
    /**
     * @description Start the animation.
     * 
     * @param {Vevet.Text.Settings} data - Settings of the animation.
     * 
     * @returns {Vevet.Timeline|boolean} Returns an object if the animation is launched and false if not.
     */
    play(data) {
        
        // check if already playing
        if (this._playing) {
            return this._timeline;
        }

        // properties

        let prop = {
            types: ['letter'],
            durationElement: 250,
            durationAuto: true,
            duration: 2500,
            easing: 'linear',
            easingEl: this._vp.easing,
            letter: [],
            word: [],
            line: [],
            shift: .2,
            shiftLine: .2,
            reverse: false,
            reverseComposite: false,
            shuffle: false,
            center: false,
            callbacks: []
        };
        prop = utils.merge(prop, data);

        // merge style settings
        prop.letter = this._mergeSettingStyle(prop.letter);
        prop.word = this._mergeSettingStyle(prop.word);
        prop.line = this._mergeSettingStyle(prop.line);

        // define animation prototype & get data for each type

        let infos = [];

        for (let i = 0; i < prop.types.length; i++) {

            let type = prop.types[i],
                prototype = type;

            if (type === 'letter' || type === 'word' || type === 'line') {
                prototype = 'elementary'
            }
            
            if (type === 'lineletter' || type === 'lineword' || type === 'wordletter') {
                prototype = 'composite_elementary'
            }

            // launch for type
            if (typeof(this[`animate_${prototype}`]) != "undefined") {
                infos.push(this[`animate_${prototype}`](prop, type));
            }

        }

        // check if there are types
        if (infos.length === 0) {
            return false;
        }

        // calculate how much time for each type
        let animationInfo = this._calcTypesTime(infos);

        // launch animation
        this._timeline = this._animate(animationInfo, prop);

        // return object timeline if animation launched
        return this._timeline;

    }

    _mergeSettingStyle(arr) {

        for (let i = 0; i < arr.length; i++) {
            let el = arr[i];
            if (typeof el.scope == 'undefined') {
                el.scope = [0, 1];
            }
            if (typeof el.remove == 'undefined') {
                el.remove = false;
            }
        }

        return arr;

    }



    /**
     * @description Calculate animation time.
     * 
     * @private
     * 
     * @param {object} data - Play properties + el.
     */
    _animationInfo(data) {

        // get total amount of elements and the elements themselves

        let amount = data.el.length,
            el = data.el.slice();

        // get duration

        let duration = data.duration;

        // intervals of time

        let timelines = [];

        // calculate custom duration if auto

        if (data.durationAuto) {

            // calculate duration

            let durationFull = amount * data.durationElement,
                shiftsDuration = (amount - 1) * data.shift * data.durationElement;
            duration = durationFull - shiftsDuration;

            // get timelines

            for (let i = 0; i < amount; i++) {
                let startTime = data.durationElement * (1 - data.shift) * i,
                    endTime = startTime + data.durationElement;
                timelines.push({
                    start: startTime / duration,
                    end: endTime / duration
                });
            }

        }

        // calculate duration of each element if duration not auto

        else {

            let time = 1 / (amount - data.shift * (amount - 1));

            for (let i = 0; i < amount; i++) {
                let start = (time * (1 - data.shift)) * i,
                    end = start + time;
                timelines.push({
                    start: start,
                    end: end
                });
            }

        }

        // elements to durations

        for (let i = 0; i < timelines.length; i++) {
            timelines[i].el = el[i];
        }

        // return object of data

        return {
            duration: duration,
            timelines: timelines,
            styles: data.styles
        };

    }



    /**
     * @description Calculate how much time for each type of animation
     * 
     * @private
     * 
     * @param {Array<object>} data - Animation data from _animationInfo.
     */
    _calcTypesTime(data) {

        // get durations from each type

        let durations = [];
        for (let i = 0; i < data.length; i++) {
            durations.push(data[i].duration);
        }

        // get maximum duration

        let durationMax = Math.max(...durations);

        // get scope of animations for each type

        for (let i = 0; i < data.length; i++) {
            data[i].scope = [
                0,
                data[i].duration / durationMax
            ];
        }

        return {
            animations: data,
            duration: durationMax
        };

    }



    /**
     * @description Launch main animation.
     * 
     * @private
     * 
     * @param {object} data - Animation data.
     * @param {Vevet.Text.Settings} prop - Settings of the animation.
     */
    _animate(data, prop) {

        // create timeline animation

        let timeline = new Timeline();

        // add progress callbacks for style

        timeline.add({
            target: 'progress',
            do: this._animateTypes.bind(this, data, prop)
        });

        // add progress callbacks

        let callbacks = prop.callbacks.slice();
        for (let i = 0; i < callbacks.length; i++) {
            callbacks[i].proceeded = false;
        }

        timeline.add({
            target: 'progress',
            do: this._callbacks.bind(this, callbacks)
        });

        timeline.add({
            target: 'end',
            do: () => {
                this._playing = false;
            }
        })

        // launch timeline
        
        this._playing = true;
        timeline.play({
            duration: data.duration,
            easing: prop.easing
        });

        // return timeline

        return timeline;

    }

    /**
     * @description Launch main animation.
     * 
     * @private
     * 
     * @param {object} data - Animation data.
     * @param {Vevet.Text.Settings} prop - Settings of the animation.
     * @param {Vevet.Timeline.Data} p - Current progress.
     */
    _animateTypes(data, prop, p) {
        
        // launch types if it is time for thm

        let types = data.animations;

        for (let i = 0; i < types.length; i++) {

            // get progress

            let progress = 0;

            let scope = types[i].scope;
            if (p.se >= scope[0] & p.se <= scope[1]) {
                progress = utils.progress(p.se, scope);
            }
            else if(p.se > scope[1]) {
                progress = 1;
            }

            // launch type

            this._animateType(progress, types[i], prop);

        }

    }

    /**
     * @description Animate elements in each type.
     * 
     * @private
     * 
     * @param {number} p - Current progress.
     * @param {object} data - Animation data.
     * @param {Vevet.Text.Settings} prop - Settings of the animation.
     */
    _animateType(p, data, prop) {

        // go thru elements and animate them if needed

        for (let i = 0; i < data.timelines.length; i++) {

            // get progress

            let progress = 0,
                elTimeline = data.timelines[i];

            if (p >= elTimeline.start & p <= elTimeline.end) {
                progress = utils.progress(p, [elTimeline.start, elTimeline.end]);
            }
            else if (p > elTimeline.end) {
                progress = 1;
            }

            // data obj

            let obj = {
                styles: data.styles,
                p: progress,
                prop: prop,
                position: i,
                total: data.timelines.length
            },
                el = elTimeline.el;

            // animate elements // animate words if type is line

            if (!isarray(el)) {
                this._animateTypeChildren(Object.assign(obj, {
                    el: el,
                }));
            }
            else {
                for (let a = 0; a < el.length; a++) {
                    this._animateTypeChildren(Object.assign(obj, {
                        el: el[a],
                    }));
                }
            }

        }

    }

    _animateTypeChildren(obj) {

        this._animateEl({
            el: obj.el,
            styles: obj.styles,
            p: obj.p,
            prop: obj.prop,
            position: obj.position,
            total: obj.total
        });

    }

    /**
     * @description Animate element.
     * 
     * @private
     * 
     * @param {object} data - Animation data.
     */
    _animateEl(data) {

        // absolute progress for each element

        let p = data.p;

        // get current element

        let el = data.el.el;

        // get properties

        let prop = data.prop;

        // go thru all styles
            
        for (let i = 0; i < data.styles.length; i++) {

            // get styles

            let style = data.styles[i],
                scope = style.scope,
                property = style.property,
                value = style.value,
                remove = style.remove;

            // get progress

            let progress = 0,
                easingProgress = 0;

            if (p >= scope[0] & p <= scope[1]) {
                progress = utils.progress(p, scope);
                easingProgress = utils.easing(progress, prop.easingEl);
            }
            else if (p > scope[1]) {
                progress = 1;
                easingProgress = 1;
            }

            // apply styles

            let resetStyles = false;
            if (progress == 1 & remove) {
                resetStyles = true;
            }

            if (!resetStyles) {
                let val = value({
                    p: progress,
                    e: easingProgress,
                    position: data.position,
                    total: data.total,
                    el: el
                });
                if (property) {
                    el.style[property] = val;
                }
            }
            else {
                if (property) {
                    el.style[property] = '';
                }
            }

        }

    }

    /**
     * @description Launch callbacks.
     * 
     * @private
     * 
     * @param {Array<object>} callbacks - Array of callbacks.
     * @param {Vevet.Timeline.Data} p - Settings of the animation.
     */
    _callbacks(callbacks, p) {

        for (let i = 0; i < callbacks.length; i++) {

            let c = callbacks[i];

            // if it is time for callbacks

            if (p.se >= c.target) {
                if (!c.proceeded) {
                    c.proceeded = true;
                    c.do();
                }
            }

        }

    }



}

Text.prototype.animate_elementary = elementary;
Text.prototype.animate_composite_elementary = composite_elementary;