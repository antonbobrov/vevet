import Module from '../Module';
import Timeline from '../timeline';
import utils from '../../core/utils';

/**
 * @classdesc A class for creating sliders. This very class is to create content sliders. <br>
 * Available targets:
 *  <ul>
 *      <li>first - first start if {@linkcode Vevet.Slider.Properties}.show is true.</li>
 *      <li>prev - when the previous slide is to be shown. Argument - {@linkcode Vevet.Slider.Callback}</li>
 *      <li>next - when the next slide is to be shown. Argument - {@linkcode Vevet.Slider.Callback}</li>
 *      <li>start - callbacks before the animation starts. Argument - {@linkcode Vevet.Slider.Callback}</li>
 *      <li>end - callbacks after the animations ends. Argument - {@linkcode Vevet.Slider.Change}</li>
 *      <li>show - event on the moment when the active slide is to be shown.</li>
 *      <li>hide - event on the moment when the active slide is to be hidden.</li>
 *      <li>shown - shown.</li>  
 *      <li>hidden - hidden.</li>  
 *      <li>render - animation. Argument - {@linkcode Vevet.Slider.Render}</li> 
 *      <li>timeline - timeline progress. Argument - {@linkcode Vevet.Slider.Timeline}</li> 
 *  </ul>
 * <br><br> <b>import {Slider} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 * @requires Vevet.Timeline
 */
export default class Slider extends Module {


    
    /**
     * @memberof Vevet.Slider
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {object} [selectors]
     * @property {string|HTMLElement} [selectors.outer=.vevet-slider] - *** The outer of the slider.
     * @property {string} [selectors.slides=.vevet-slider__slides] - *** The outer of slides.
     * @property {string} [selectors.slide=.vevet-slider__slide] - *** Slide selector.
     * 
     * @property {string} [direction=h] - Direction: h - horizontal, v - vertical.
     * It defines direction of animation.
     * @property {boolean} [loop=true] - Infinite loop sliding.
     * @property {boolean} [show=true] - If the first slide is to be shown right after initializing the class.
     * @property {boolean} [prev=true] - If switching to the previous slide is possible.
     * @property {boolean} [next=true] - If switching to the next slide is possible.
     * @property {boolean} [disabled=false] - If slide is disabled.
     * @property {number} [active=0] - Active slide.
     * 
     * @property {object} [animation]
     * @property {boolean} [animation.duration=1500] - Duration of animation.
     * @property {Array<number>} [animation.prev=[0, 0.5]] - Scope of animation of the previous slide.
     * @property {Array<number>} [animation.next=[0.5, 1]] - Scope of animation of the next slide.
     * @property {string|Array<number>|Function} [animation.easing] - Easing function.
     * The default value is equal to {@linkcode Vevet.Application#easing}.
     * 
     * @property {number} [resizeTimeout=0] - Timeout before sizes are updated when the window is resized.
     *
     */
    /**
     * @alias Vevet.Slider
     * 
     * @param {Vevet.Slider.Properties} data
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}slider`;
    }

    get defaultProp() {

        let prefix = this._prefix;
        
        return utils.merge(super.defaultProp, {
            selectors: {
                outer: `.${prefix}`,
                slides: `.${prefix}__slides`,
                slide: `.${prefix}__slide`
            },
            direction: 'h',
            loop: true,
            show: true,
            prev: true,
            next: true,
            disabled: false,
            active: 0,
            animation: {
                duration: 1500,
                prev: [0, .5],
                next: [.5, 1],
                easing: this._vp.easing
            },
            resizeTimeout: 0,
        });

    }



    /**
     * @description If slider is animating.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get playing() {
        return this._playing;
    }
    /**
     * @description Get active slide.
     * @default 0
     * @readonly
     * @type {number}
     */
    get active() {
        return this._active;
    }
    /**
     * @description If active slide is shown.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get shown() {
        return this._shown;
    }
    /**
     * @description Total amount of slides.
     * @readonly
     * @type {number}
     */
    get total() {
        return this._total;
    }
    /**
     * @description Slides.
     * @readonly
     * @type {Array<HTMLElement>}
     */
    get slides() {
        return this._slides;
    }



    // Extra constructor
    _extra() {

        super._extra();

        let prop = this._prop;

        // variables

        this._total = 0;
        this._playing = false;
        this._active = prop.active;
        this._activePrev = -1;
        this._shown = false;

        this._size = [0, 0];

        // get elements
        this._getElements();

        // create other elements
        this._createElements();

        // sizes
        this.setSize();
        this._addEvent('viewport', {
            target: '',
            name: this._name,
            do: () => {
                setTimeout(() => {
                    this.setSize();
                }, prop.resizeTimeout);
            }
        });

        // show
        this._firstStart();

    }

    /**
     * @description First start.
     * @protected
     */
    _firstStart() {
        if (this._prop.show) {
            this._shown = true;
            this.lbt("first");
        }
        this._slidesClasses();
    }

    /**
     * @description Get Elements.
     * @protected
     */
    _getElements() {

        // get vars
        let prop = this._prop,
            selectors = prop.selectors,
            prefix = this._prefix;

        // get elements
        this._outer = utils.element(selectors.outer);
        this._slidesOuter = this._outer.querySelector(selectors.slides);
        this._slides = this._slidesOuter.querySelectorAll(selectors.slide);

        // get amount
        this._total = this._slides.length;

        // set classes
        this._outer.classList.add(prefix);
        this._slidesOuter.classList.add(`${prefix}__slides`);
        for (let i = 0; i < this._total; i++) {
            this._slides[i].classList.add(`${prefix}__slide`);
        }

    }

    /**
     * @description Create elements.
     * @protected
     */
    _createElements() { }



    /**
     * @description Change slides classes
     * @param {number} num - Index of the slide.
     * @protected
     */
    _slidesClasses(num = this._active) {

        let activeClass = `${this._prefix}__slide_active`;

        for (let i = 0; i < this._total; i++) {
            if (i === num) {
                this._slides[i].classList.add(activeClass);
            }
            else {
                this._slides[i].classList.remove(activeClass);
            }
        }

    }


    
    /**
     * @description Set events.
     * @protected
     */
    _setEvents() {

        super._setEvents();

    }



    /**
     * @description Update size values.
     */
    setSize() {

        // size
        let size = this._getSize();

        // get sizes
        this._width = size[0];
        this._height = size[1];

        // update dpr
        this._dprGet();
        let dpr = this._dpr;

        // update size
        this._size = [(this._width * dpr), (this._height * dpr)];

    }

    _getSize() {

        let outer = this._outer;

        return [
            outer.clientWidth,
            outer.clientHeight
        ];

    }

    _dprGet() {

        this._dpr = this._v.viewport.dprDevice;

    }



    /**
     * @description Set previous slide.
     * @returns {boolean} Returns true if successful.
     */
    prev() {
        
        if (this._playing || !this._prop.prev) {
            return false;
        }

        let num = this._prevGet();
        if (num === false) {
            return false;
        }
        this.set(num, 'prev');

        return true;
        
    }

    /**
     * @description Get previous slide.
     * @param {number} [num] - Reference slide num.
     * @returns {number} Previous slide.
     * @protected
     */
    _prevGet(num = this._active) {
        
        num -= 1;
        if (num < 0) {
            if(!this._prop.loop){
                return false;
            }
            else {
                num = this._total - 1;
            }
        }
        
        return num;

    }



    /**
     * @description Set next slide.
     * @returns {boolean} Returns true if successful.
     */
    next() {
        
        if (this._playing || !this._prop.next) {
            return false;
        }

        let num = this._nextGet();
        if (num === false) {
            return false;
        }
        this.set(num, 'next');

        return true;
        
    }

    /**
     * @description Get next slide.
     * @param {number} [num] - Reference slide num.
     * @returns {number} Next slide.
     * @protected
     */
    _nextGet(num = this._active) {
        
        num += 1;
        if (num > (this._total - 1)) {
            if(!this._prop.loop){
                return false;
            }
            else {
                num = 0;
            }
        }
        
        return num;

    }



    /**
     * @description Show the active slide.
     * @returns {boolean} Returns true if successful.
     */
    show() {
        
        if (this._playing || this._shown || this._prop.disabled) {
            return false;
        }

        this._shown = true;
        this._outer.classList.add(`${this._prefix}_shown`);

        // change helpers & classes
        this._slidesClasses();

        // animation
        this._showHide("show");

        return true;

    }

    /**
     * @description Hide the active slide.
     * @returns {boolean} Returns true if successful.
     */
    hide() {
        
        if (this._playing || !this._shown || this._prop.disabled) {
            return false;
        }

        this._shown = false;
        this._outer.classList.remove(`${this._prefix}_shown`);

        // change helpers & classes
        this._slidesClasses(-1);

        // animation
        this._showHide("hide");

        return true;

    }

    /**
     * @description Show/Hide method helper.
     * @param {string} action - Name of the action: show/hide.
     */
    _showHide(action) {

        // callback
        this.lbt(action);

        // change vars
        this._playing = true;

        // get active num
        let active = this._active;

        // create timeline animation
        let timeline = new Timeline({
            destroyOnEnd: true
        });

        // add progress callbacks
        timeline.add({
            target: 'progress',
            do: (p) => {
                let obj = {
                    prev: active,
                    next: active,
                    direction: action
                };
                this._animateTimeline(obj, p);
                this._animateType(obj, action, p);
            }
        });

        // end callback
        timeline.add({
            target: 'end',
            do: () => {
                this._animationEnd();
                if (action == 'show') {
                    this.lbt("shown");
                }
                else {
                    this.lbt("hidden");
                }
            }
        });

        // launch timeline
        timeline.play({
            duration: this._prop.animation.duration,
            autoDuration: true,
            easing: 'linear'
        });

    }



    /**
     * @memberof Vevet.Slider
     * @typedef {object} Callback
     * @property {string} direction - Direction of action: prev or next.
     * @property {number} prev - Previous slide number.
     * @property {number} next - Next slide number.
     */
    /**
     * @description Set slide.
     * 
     * @param {number} [num=0] - Slide index number.
     * @param {string} [direction=none] - Direction of action: prev or next.
     * 
     * @returns {boolean} - Returns true if successful.
     */
    set(num = 0, direction = 'none') {

        // if available
        if (this._playing || this._prop.disabled) {
            return false;
        }

        // check if shown
        if (!this._shown) {
            return false;
        }

        // check number
        if (this._active === num) {
            return false;
        }

        // change active
        this._activePrev = this._active;
        this._active = num;

        // change slides classes
        this._slidesClasses();

        // get right direction
        if (direction === 'none') {
            if (this._active > this._activePrev) {
                direction = 'next';
            }
            else {
                direction = 'prev';
            }
        }

        // launch callbacks
        this._setCallbacks(direction);

        // animate
        this._animate(direction);

        // success
        return true;

    }

    _setCallbacks(direction = '') {

        // Get object for callbacks - {@linkcode Vevet.Slider.Callback}.
        let obj = {
            direction: direction,
            prev: this._activePrev,
            next: this._active,
        };

        if (direction === 'prev') {
            this.lbt("prev", obj);
        }
        if (direction === 'next') {
            this.lbt("next", obj);
        }
        this.lbt("start", obj);

    }


    
    /**
     * @memberof Vevet.Slider
     * @typedef {object} Change
     * @property {string} direction - Direction of action: prev or next.
     * @property {number} prev - Previous slide number.
     * @property {number} next - Next slide number.
     */
    /**
     * @description Animate slides.
     * @param {string} direction - Direction of action: prev or next.
     * @param {Array<number>} scope - Animation scope.
     * @protected
     */
    _animate(direction = '', scope = [0, 1]) {

        // change vars
        this._playing = true;

        // create timeline animation
        let timeline = new Timeline({
            destroyOnEnd: true
        });

        // Get object for callbacks - {@linkcode Vevet.Slider.Change}.
        let obj = {
            direction: direction,
            prev: this._activePrev,
            next: this._active,
        };

        // add progress callbacks
        timeline.add({
            target: 'progress',
            do: this._animateTypes.bind(this, obj)
        });

        // end callback
        timeline.add({
            target: 'end',
            do: this._animateEnd.bind(this, obj)
        });

        // launch timeline
        timeline.play({
            duration: this._prop.animation.duration,
            autoDuration: true,
            scope: scope,
            easing: 'linear'
        });

    }

    /**
     * @description End of animation.
     * @param {Vevet.Slider.Change} obj - Callback data.
     * @protected
     */
    _animateEnd(obj) {

        this._animationEnd();
        this.lbt("end", obj);

    }

    _animationEnd() {

        this._playing = false;

    }

    /**
     * @memberof Vevet.Slider
     * @typedef {object} Timeline
     * @augments Vevet.Slider.Change
     * @property {number} p - Progress without easing.
     */

    /**
     * @description Animation progress. Here we split animation into two parts:
     * animation of the previous & of the next slide.
     * @param {Vevet.Slider.Change} obj - Callback data.
     * @param {Vevet.Timeline.Data} p - Progress data.
     * @protected
     */
    _animateTypes(obj, p) {

        // timeline
        this._animateTimeline(obj, p);

        // animate the previous & next slide
        this._animateType(obj, 'prev', p);
        this._animateType(obj, 'next', p);

    }

    /**
     * @description Timeline animation.
     * @param {Vevet.Slider.Change} obj - Callback data.
     * @param {Vevet.Timeline.Data} p - Progress data.
     * @protected
     */
    _animateTimeline(obj, p) {

        // the methods above will call the event "render" twice
        // perhaps, you will need to have a single render event that will not depend on slide animation props.
        let data = utils.merge({
            p: p.se
        }, obj);
        this.lbt("timeline", data);

    }

    /**
     * @description Animation a slide type: show|hide|prev|next.
     * @param {Vevet.Slider.Change} obj - Callback data.
     * @param {string} type - Slide type.
     * @param {Vevet.Timeline.Data} p - Progress data.
     * @protected
     */
    _animateType(obj, type, p) {

        // get animation scope
        let scope = this._prop.animation[type];
        if (typeof scope == "undefined") {
            scope = [0, 1];
        }

        // get type progress
        let progress = utils.progress(p.se, scope);
        if (progress < 0) {
            progress = 0;
        }
        else if (progress > 1) {
            progress = 1;
        }
        else {
            progress = utils.easing(progress, this._prop.animation.easing);
        }

        // Create Animation Data, {@linkcode Vevet.Slider.Render}.
        let data = utils.merge({
            p: progress,
            num: type === 'prev' ? obj.prev : obj.next,
            type: type
        }, obj);

        // render
        this._render(data);

    }

    /**
     * @memberof Vevet.Slider
     * @typedef {object} Render
     * @augments Vevet.Slider.Change
     * @property {number} p - Progress of animation.
     * @property {number} num - Index number of the slide under animation.
     * @property {string} type - What type of a slide is under animation: prev|next|show|hide.
     */

    /**
     * @description Animation render.
     * @param {Vevet.Slider.Render} data - Animation data.
     * @protected
     */
    _render(data) {

        // reder callback
        this.lbt("render", data);

    }



    /**
     * @description Destroy the class.
     */
    destroy() {

        super.destroy();

        let prefix = this._prefix;

        // remove classes
        this._outer.classList.remove(prefix);
        this._slidesOuter.classList.remove(`${prefix}__slides`);
        for (let i = 0; i < this._total; i++) {
            this._slides[i].classList.remove(`${prefix}__slide`);
        }
        
    }



}