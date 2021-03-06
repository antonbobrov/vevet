import Module from './Module';
import merge from './merge';
import easing from './easing';
import timeoutCallback from './timeoutCallback';
import TimelineModule from './TimelineModule';
const selectEl = require('select-el');
const lerp = require('lerp');

/**
 * @classdesc A page preloader.
 * Available targets:
 *  <ul>
 *      <li>progress - callback on progress. Each callback will receive {@linkcode Vevet.PreloaderModule.Callback} as an argument.</li>
 *      <li>hide - when the preloader must begin hiding.</li>
 *      <li>hidden - when the preloader is already hidden.</li>
 *  </ul>
 * <br><br> <b>import {PreloaderModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.PreloaderModule : progress : Vevet.PreloaderModule.Callback}
 * @vevetModuleCallback { Vevet.PreloaderModule : hide :  }
 * @vevetModuleCallback { Vevet.PreloaderModule : hidden :  }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 * @requires Vevet.TimelineModule
 */
export default class PreloaderModule extends Module {


    
    /**
     * @memberof Vevet.PreloaderModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string|HTMLElement} [selector=.v-preloader] - *** The selector of the preloader element.
     * @property {number} [animation=750] - Duration of animation when hiding.
     * @property {number} [animationInner=25] - Inner animation before the preloader hides.
     * @property {Vevet.PreloaderModule.Progress} [progress]
     * @property {boolean} [hide] - Defines if the preloader will be hidden automatically 
     * when all resources are loaded.
     */
    /**
     * @memberof Vevet.PreloaderModule
     * @typedef {object} Progress
     * @property {boolean} [on=false] - If enabled, the progress of loading resources will be enabled.
     * @property {number} [k=0.1] - The higher number, the faster animation.
     * @property {boolean} [forceEnd=false] - When resources are loaded and the progress is still not 100%,
     * this allows to end animation in a certain period of time.
     * @property {number} [forceEndDuration=3000] - Duration of the force-ednd-animation.
     * @property {boolean} [images=true] - Load images.
     * @property {string|false} [bgSelector=*:not(script)] - If you are loading images, you may also need to load
     * background images. To do this, set a background selector or make it false to skip this step.
     * @property {boolean} [videos=true] - Load videos.
     * @property {number} [resources=0] - Amount of resources to be loaded. 
     * It's a rare case when you need to set it. 
     * F.e., whe you want to imitate loading resources when there's actually none of them.
     * @property {string|Array<number>|Function} [easing] - Easing function. 
     * The default value is equal to {@linkcode Vevet.Application#easing}.
     */
    /**
     * @alias Vevet.PreloaderModule
     * 
     * @param {Vevet.PreloaderModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}preloader`;
    }

    /**
     * @readonly
     * @type {Vevet.PreloaderModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
            selector: '.' + this._prefix,
            animation: 750,
            animationInner: 25,
            progress: {
                on: false,
                k: .01,
                forceEnd: false,
                forceEndDuration: 3000,
                easing: this._vp.easing,
                images: true,
                bgSelector: '*:not(script)',
                videos: true,
                resources: 0
            },
            hide: true
        });

    }

    /**
     * @member Vevet.PreloaderModule#prop
     * @memberof Vevet.PreloaderModule
     * @readonly
     * @type {Vevet.PreloaderModule.Properties}
     */

    /**
     * @member Vevet.PreloaderModule#_prop
     * @memberof Vevet.PreloaderModule
     * @protected
     * @type {Vevet.PreloaderModule.Properties}
     */

    /**
     * @function Vevet.PreloaderModule#changeProp
     * @memberof Vevet.PreloaderModule
     * @param {Vevet.PreloaderModule.Properties} [prop]
     */



    /**
     * @description If the page is loaded.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get loaded() {
        return this._v.load.loaded;
    }
    /**
     * @description Get total amount of resources that are being loaded.
     * @default false
     * @readonly
     * @type {number}
     */
    get resourcesTotal() {
        return this._resourcesTotal;
    }
    /**
     * @description Get total amount of resources that are loaded.
     * @default false
     * @readonly
     * @type {number}
     */
    get resourcesLoaded() {
        return this._resourcesLoaded;
    }
    /**
     * @description If the preloader is hidden.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get hidden() {
        return this._hidden;
    }
    /**
     * @description Outer element.
     * @readonly
     * @type {HTMLElement}
     */
    get outer() {
        return this._outer;
    }



    // Extra Constructor
    _extra() {

        super._extra();

        let prop = this._prop;

        /**
         * @description Outer element.
         * @protected
         * @member {HTMLElement}
         */
        this._outer = selectEl.one(prop.selector);
        this._outer.classList.add(this._prefix);

        /**
         * @description Current loading time.
         * @protected
         * @member {number}
         */
        this._time = +new Date();
        /**
         * @description If the preloader is hidden.
         * @protected
         * @member {boolean}
         */
        this._hidden = false;

        /**
         * @description Images list.
         * @protected
         * @member {Array<string>}
         */
        this._images = [];
        /**
         * @description Videos list.
         * @protected
         * @member {Array<HTMLVideoElement>}
         */
        this._videos = [];
        /**
         * @description Total amount of resources.
         * @protected
         * @member {number}
         */
        this._resourcesTotal = prop.progress.resources;
        /**
         * @description Total amount of loaded resources.
         * @protected
         * @member {number}
         */
        this._resourcesLoaded = 0;

        /**
         * @description Loading progress.
         * @protected
         * @member {number}
         */
        this._progressLoad = 0;
        /**
         * @description Loading animation progress.
         * @protected
         * @member {number}
         */
        this._progressAnim = 0;
        /**
         * @description Progress animationFrame.
         * @protected
         * @member {null|number}
         */
        this._progressFrameId = null;
        /**
         * @description If progress enabled.
         * @protected
         * @member {boolean}
         */
        this._progressBool = true;

        // set styles to the preloader
        this._setStyles();

    }



    /**
     * @description Set transition styles of the preloader.
     * @protected
     */
    _setStyles() {

        let outer = this._outer;

        outer.style.opacity = '1';
        outer.style.transition = `${this._prop.animation / 1000}s`;
        outer.classList.add(`${this._prefix}_animate`);

        return true;

    }



    // Set Events
    _setEvents() {

        // when the page is loaded
        this.addEvent('load', {
            name: this._name,
            do: () => {
                this._onloaded();
            }
        });

        // copy properties
        let progressProp = this._prop.progress;

        // load resources if enables
        if (progressProp.on) {

            // count resources
            if (progressProp.images) {
                this._resourcesTotal += this._getImages();
            }
            if (progressProp.videos) {
                this._resourcesTotal += this._getVideos();
            }

            // check how many resources there are
            // if more than zero, an animation frame will be launched
            // and the resources will be loaded
            if (this._resourcesTotal > 0) {
                this._resourcesLoad();
                this._frameLaunch();
            }
            else {
                this._onloaded();
            }
            
        }

    }

    /**
     * @description Add images to stack.
     * @protected
     * @returns {number} Total number of images to be loaded.
     */
    _getImages() {

        let images = this._images;

        // get real DOM images
        let imgs = document.querySelectorAll("img");
        imgs.forEach(img => {
            images.push(img.src);
        });

        // get backgrounds
        let bgSelector = this._prop.progress.bgSelector;
        if (bgSelector) {

            let el = document.querySelectorAll(bgSelector);
            for (let i = 0; i < el.length; i++) {
                let url = getComputedStyle(el[i]).backgroundImage;
                if (url.indexOf('none') == -1 & url.indexOf('-gradient') == -1) {
                    if (url.indexOf('url') != -1) {
                        let temp = url.match(/url\((.*?)\)/);
                        url = temp[1].replace(/"/g, '');
                        images.push(url);
                    }
                }
                else {
                    if (el[i].tagName == "IMG") {
                        images.push(el[i].src);
                    }
                }
            }

        }

        return images.length;

    }

    /**
     * @description Add videos to stack.
     * @protected
     * @returns {number} Total number of images to be loaded.
     */
    _getVideos() {

        let videos = this._videos;

        let el = document.querySelectorAll('video');
        for (let i = 0; i < el.length; i++) {
            videos.push(el[i]);
        }

        return videos.length;

    }

    /**
     * @description Load real resources.
     * @protected
     */
    _resourcesLoad() {

        let images = this._images,
            videos = this._videos;

        // load images
        for (let i = 0; i < images.length; i++) {
            let image = new Image();
            image.onload = () => {
                this._resourcesOnLoaded();
            };
            image.onerror = () => {
                this._resourcesOnLoaded();
            };
            image.src = images[i];
        }

        // load videos
        for (let i = 0; i < videos.length; i++) {
            videos[i].load();
            videos[i].onloadeddata = () => {
                this._resourcesOnLoaded();
            }
        }

    }

    /**
     * @memberof Vevet.PreloaderModule
     * @typedef {object} Callback
     * @property {number} progress Current loading progress.
     * @property {number} easing Current easing progress.
     * @property {number} loaded Number of resources loaded.
     * @property {number} total Total number of resources.
     */

    /**
     * @description Event on any resource loaded.
     * @protected
     */
    _resourcesOnLoaded() {

        let total = this._resourcesTotal;

        // iterate the quantity of loaded resources
        this._resourcesLoaded++;
        let loaded = this._resourcesLoaded;
        // and update the progress value - NOT THE FRAME PROGRESS
        this._progressLoad = loaded / total;

        // when all resources are loaded
        if (loaded == total) {
            this._onloaded();
        }

    }

    /**
     * @description Iterate total amount of resources.
     * @param {number} num - Amount of resources to add.
     */
    resourcesAddTotal(num = 1) {
        this._resourcesTotal += num;
    }

    /**
     * @description Iterate total amount of resources that are loaded.
     * @param {number} num - Amount of resources to add.
     */
    resourcesAddLoaded(num = 1) {
        for (let i = 0; i < num; i++) {
            this._resourcesOnLoaded();
        }
    }



    /**
     * @description Set progress animation frame.
     * @protected
     */
    _frameLaunch() {

        this._progressFrameId = window.requestAnimationFrame(this._frame.bind(this));

    }

    /**
     * @description Frame animation
     * @protected
     */
    _frame() {

        // check if animation progress is enabled
        if (!this._progressBool) {
            return;
        }

        let prop = this._prop;

        // progress interpolation
        this._progressAnim = lerp(this._progressAnim, this._progressLoad, prop.progress.k);
        let progress = this._progressAnim;

        // if close to 1
        if (progress >= .999) { 
            progress = 1;
        }

        // launch callbacks
        this.lbt('progress', {
            progress: progress,
            easing: easing(progress, prop.progress.easing),
            loaded: this._resourcesLoaded,
            total: this._resourcesTotal
        });

        // stop animaton frame if progress is close to 1 or equal to 1
        if (progress == 1) {

            cancelAnimationFrame(this._progressFrameId);

            // hide
            this._onloaded();

            return;

        }

        // continue animation
        this._progressFrameId = window.requestAnimationFrame(this._frame.bind(this));

    }


    
    /**
     * @description Timeline animation.
     * @protected
     * @param {Vevet.TimelineModule.Data} p
     */
    _progressFrameForce(p) {

        this._progressAnim = p.s;

        // callbacks if animation is still in process
        this.lbt('progress', {
            progress: this._progressAnim,
            easing: easing(p.s, this._prop.progress.easing),
            loaded: this.resourcesLoaded,
            total: this.resourcesTotal
        });

        // callbacks if animation ended
        if (p.p === 1) {
            this._onloaded();
            return;
        }

    }



    /**
     * @description Call it when either all resources are loaded or the page is loaded.
     * @protected
     */
    _onloaded() {

        // return if page not loaded
        if (!this.loaded) {
            return;
        }

        let progressProp = this._prop.progress;

        // if progress is enabled
        // we will launch a timeline animation for the preloader
        if (progressProp.on) {

            // return if not all resources are loaded
            if (this._resourcesTotal > this._resourcesLoaded) {
                return;
            }

            // run animation
            if (this._progressAnim < 1) {
                if (progressProp.forceEnd) {

                    // stop frame animation
                    cancelAnimationFrame(this._progressFrameId);
                    this._progressBool = false;

                    // create a timeline animation
                    let timeline = new TimelineModule({
                        destroyOnEnd: true
                    });
                    timeline.add({
                        target: 'progress',
                        do: this._progressFrameForce.bind(this)
                    });
                    timeline.play({
                        duration: progressProp.forceEndDuration,
                        easing: 'linear', // progressProp.easing,
                        scope: [this._progressAnim, 1]
                    });

                    return;

                }
                else{
                    return;
                }
            }

        }

        // hide preloader
        this._hide();

    }
    


    /**
     * @description Hide preloader.
     */
    hide() {

        let interval = this._interval();

        timeoutCallback(this._hideAnimate.bind(this), interval);
        
    }

    /**
     * @description Hide callback. Hide preloader when everything is loaded.
     * @protected
     */
    _hide() {
        
        this.lbt('hide');
        if (this._prop.hide) {
            this.hide();
        }

    }

    /**
     * @description Difference between the start time and the end time.
     * Inner animation duration is applied.
     */
	_interval() {

		let time = +new Date(),
            diff = time - this._time,
            inner = this._prop.animationInner;

        let interval = 0;
        if (diff < inner) {
            interval = inner - diff;
        }

        return interval;
        
    }
    
    /**
     * @description Now we really hide the preloader.
     * @protected
     */
    _hideAnimate() {

        let outer = this._outer,
            prefix = this._prefix;

        outer.style.opacity = '0';
        outer.classList.add(`${prefix}_hide`);
        setTimeout(() => {
            outer.classList.add(`${prefix}_hidden`);
            this._onhidden();
        }, this._prop.animation);
        
    }
    
    /**
     * @description This action is called when the preloader is finally hidden.
     * @protected
     */
    _onhidden() {

        this._hidden = true;
        this.lbt('hidden');
        
    }



}