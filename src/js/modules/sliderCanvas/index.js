const dom = require('dom-create-element');

import Slider from '../slider';
import Frame from '../frame';
import utils from '../../core/utils';

/**
 * @classdesc A class for creating image/video sliders onto canvas. <br>
 * Available targets:
 *  <ul>
 *      <li>All the available targets for {@linkcode Vevet.Slider}</li>
 *      <li>loaded - when images and videos are loaded.</li>
 *      <li>renderStat - render on the first start or resize.</li>
 *  </ul>
 * <br><br> <b>import {SliderCanvas} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Slider
 * @requires Vevet.Frame
 */
export default class SliderCanvas extends Slider {


    
    /**
     * @memberof Vevet.SliderCanvas
     * @typedef {object} Properties
     * @augments Vevet.Slider.Properties
     * 
     * @property {Vevet.SliderCanvas.Autoframe} [autoframe] - Launch animation frame automatically to render
     * images onto canvas even when there's no change between slides. It it useful when creating some
     * effects onto canvas that do not depend on slides animation change.
     * @property {boolean} [autoplay=true] Autoplay video slides.
     * @property {string} [img=img] Image elements tag. It may be replaced by div, f.e., 
     * not to load images twice.
     * @property {string} [src=src] Source attribute.
     *
     */
    /**
     * @memberof Vevet.SliderCanvas
     * @typedef {object} Autoframe
     * 
     * @property {boolean} [on=false] Enable
     * @property {number} [fps=30] Frames per second
     *
     */
    /**
     * @alias Vevet.SliderCanvas
     * 
     * @param {Vevet.SliderCanvas.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.SliderCanvas.Properties}
     */
    get defaultProp() {
        
        return utils.merge(super.defaultProp, {
            autoframe: {
                on: false,
                fps: 30
            },
            autoplay: true,
            img: 'img',
            src: 'src'
        });

    }

    _changeProp() {
        super._changeProp();
        this._autoframeToggle();
    }

    /**
     * @member Vevet.SliderCanvas#prop
     * @memberof Vevet.SliderCanvas
     * @readonly
     * @type {Vevet.SliderCanvas.Properties}
     */

    /**
     * @member Vevet.SliderCanvas#_prop
     * @memberof Vevet.SliderCanvas
     * @protected
     * @type {Vevet.SliderCanvas.Properties}
     */

    /**
     * @function Vevet.SliderCanvas#changeProp
     * @memberof Vevet.SliderCanvas
     * @param {Vevet.SliderCanvas.Properties} [prop]
     */



    // Extra constructor
    _extra() {

        /**
         * @description Canvas element
         * @type {HTMLElement}
         * @protected
         */
        this._canvas = false;
        /**
         * @description Canvas Context.
         * @type {object}
         * @protected
         */
        this._ctx = {};
        /**
         * @description Resources.
         * @type {Array<HTMLElement>}
         * @protected
         */
        this._res = [];
        /**
         * @description Resources' sizes.
         * @type {Array<Vevet.utils.MediaSize>}
         * @protected
         */
        this._resSize = [];
        /**
         * @description Loaded resources counter.
         * @type {number}
         * @protected
         */
        this._loaded = 0;
        /**
         * @description If all resources are loaded.
         * @type {boolean}
         * @protected
         */
        this._loadedAll = false;
        /**
         * @description Frame settings.
         * @type {Vevet.Frame}
         * @protected
         */
        this._autoframe = new Frame({
            fps: this._prop.autoframe.fps
        });
        
        // inherit
        super._extra();

    }

    // First show
    _firstStart() {
        if (this._prop.show) {
            this.renderStat();
            this._autoframeToggle();
            this._playVideo();
        }
        super._firstStart();
    }



    /**
     * @description Create elements.
     * @protected
     */
    _createElements() {

        // create canvas
        this._canvas = dom({
            selector: 'canvas'
        });
        this._outer.appendChild(this._canvas);

        // get context
        this._ctx = this._canvas.getContext("2d");

    }

    /**
     * @description Get Elements.
     * @protected
     */
    _getElements() {

        super._getElements();

        // get images
        this._slides.forEach(slide => {

            // get resources
            let img = slide.querySelector(this._prop.img);
            if (img) {
                this._res.push(img);
            }
            else {
                let video = slide.querySelector("video");
                if (video) {
                    this._res.push(video);
                }
            }

        });

        // hide slides
        this._slidesOuter.classList.add("display-none_important");

        // load resources
        this._load();

    }



    /**
     * @description Load images.
     * @private
     */
    _load() {
    
        for (let i = 0; i < this._res.length; i++) {

            // get resource
            let res = this._res[i];

            // load video
            if (res.tagName == 'VIDEO') {
                this._res[i] = res;
                res.addEventListener("loadedmetadata", () => {
                    this._loadRes();
                });
                res.crossOrigin = "anonymous";
                res.muted = true;
                res.autoplay = true;
                res.loop = true;
                res.load();
            }
            // load image
            else {
                let img = new Image();
                this._res[i] = img;
                img.addEventListener("load", this._loadRes.bind(this));
                img.crossOrigin = "anonymous";
                img.src = res.getAttribute(this._prop.src);
            }

        }

    }

    /**
     * @description When a resource is loaded.
     * @private
     */
    _loadRes() {

        // iterate loaded
        this._loaded++;

        // check if all loaded
        if (this._loaded === this._total) {
            this._onloaded();
        }

    }

    /**
     * @description When all resources are loaded.
     * @private
     */
    _onloaded() {

        this._loadedAll = true;
        this.setSize();

        this.lbt("loaded");

    }


    
    // Set events
    _setEvents() {

        super._setEvents();

        // start
        this.on("start", obj => {
            this._playVideo(obj.next);
            this._pauseVideo(obj.prev);
        });
        // end
        this.on("end", obj => {
            this._pauseVideo(obj.prev);
        })
        // show
        this.on("show", () => {
            this._playVideo(this._active);
        })
        // hide
        this.on("hide", () => {
            this._pauseVideo(this._active);
        })

    }


    /**
     * @description Play video.
     * @protected
     * @param {number} num - Order number of the slide.
     */
    _playVideo(num = this._active) {

        if (!this._prop.autoplay) {
            return;
        }

        let res = this._res[num];
        if (res.tagName == 'VIDEO') {
            res.play();
        }

    }
    /**
     * @description Pause video.
     * @protected
     * @param {number} num - Order number of the slide.
     */
    _pauseVideo(num = this._active) {

        if (!this._prop.autoplay) {
            return;
        }

        let res = this._res[num];
        if (res.tagName == 'VIDEO') {
            res.pause();
        }

    }



    /**
     * @description Update size values.
     * @param {boolean} [redraw=true] - If need to redraw.
     */
    setSize(redraw = true) {
        
        super.setSize();

        // resize canvas
        this._setCtxSize();
        
        // set resource sizes
        if (this._loadedAll & redraw) {
            this._setResSize();
            if (this._prop.show || this._shown) {
                this.renderStat();
            }
        }

    }
    /**
     * @description Set canvas sizes.
     * @private
     */
    _setCtxSize() {

        // dpr sizes
        let size = this._size;

        // canvas sizes
        this._canvas.width = size[0];
        this._canvas.height = size[1];

    }

    /**
     * @description Set resource sizes.
     * @private
     */
    _setResSize() {

        // clear sizes
        this._resSize = [];

        // get sizes
        let size = this._size,
            width = size[0],
            height = size[1];

        // set sizes
        this._res.forEach(res => {
            let size = utils.mediaSize({
                media: res,
                size: 'cover',
                width: width,
                height: height,
                maxWidth: width,
                maxHeight: height
            });
            this._resSize.push(size);
        });

    }



    /**
     * @description Clear canvas.
     * @private
     */
    _canvasClear() {
        let size = this._size;
        this._ctx.clearRect(0, 0, size[0], size[1]);
    }

    /**
     * @description Render static canvas. F.e., when the window is resized or on the first start.
     */
    renderStat() {

        // check
        if (!this._loadedAll) {
            return;
        }
        if (this._playing) {
            return;
        }

        // resize
        this._setResSize();
        
        // draw
        this._canvasClear();
        this._draw({
            num: this._active,
            p: 1,
            direction: 'show',
            type: 'show',
            prev: this._active,
            next: this._active
        });

        // callbacks
        this.lbt("renderStat");

    }
    
    
    
    /**
     * @description Animation progress.
     * @param {Vevet.Timeline.Data} p - Progress data.
     * @protected
     */
    _animateSlides(p) {

        this._canvasClear();
        super._animateSlides(p);

    }
    

    
    /**
     * @description Animation rendering.
     * @param {Vevet.Slider.Render} data - Animation data.
     * @protected
     */
    _render(data) {

        // clear canvas
        if (["show", "hide"].includes(data.direction)) {
            this._canvasClear();
        }
        
        this._draw(data);
        super._render(data);

    }



    /**
     * @description Draw on the canvas.
     * @param {Vevet.Slider.Render} data - Animation data.
     * @protected
     */
    _draw(data) {

        // eslint-disable-next-line no-unused-vars
        let {num, p, direction, type, prev, next} = data;

        // get resource and its sizes
        let resource = this._res[num],
            size = this._resSize[num];

        // get canvas sizes
        let sizes = this._size,
            w = sizes[0],
            h = sizes[1];
        
        // crop settings
        let top = 0,
            left,
            width,
            height = h;

        // crop settings according to the direction
        if (['next', 'show'].includes(direction)) {
            if (type === 'next' || type === 'show') {
                left = (1 - p) * w;
                width = w - left;
            }
            else {
                left = 0;
                width = (1 - p) * w;
            }
        }
        else if (['prev'].includes(direction)) {
            if (type === 'next') {
                left = 0;
                width = p * w;
            }
            else {
                left = w * p;
                width = w - left;
            }
        }
        else {
            left = 0;
            width = (1 - p) * w;
        }

        // draw
        let ctx = this._ctx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(resource, 0, 0, size.mediaWidth, size.mediaHeight, size.x, size.y, size.width, size.height);
        ctx.restore();

    }


    
    /**
     * @description Disable autoframe.
     * @protected
     */
    _autoframeDisable() {

        // remove callbacks
        this._autoframe.removeAll();

        // pause
        this._autoframe.pause();

    }
    /**
     * @description Enable autoframe.
     * @protected
     */
    _autoframeEnable() {

        if (!this._prop.autoframe.on) {
            return;
        }
        
        // add callbacks
        this._autoframe.add({
            do: this.renderStat.bind(this)
        });

        // play
        this._autoframe.play();

    }
    /**
     * @description Toggle autoframe.
     * @protected
     */
    _autoframeToggle() {
        
        this._autoframeDisable();
        if (this._prop.autoframe.on) {
            this._autoframeEnable();
        }

    }


    
    // Show
    show() {

        if (super.show()) {
            this.on("shown", this._autoframeEnable.bind(this));
            return true;
        }

        return false;

    }
    
    // Hide
    hide() {

        if (super.hide()) {
            this._autoframeDisable();
            return true;
        }

        return false;

    }



    /**
     * @description Destroy the class.
     */
    destroy() {

        super.destroy();

        // autoframe
        this._autoframe.destroy();

        // show items
        this._slidesOuter.classList.remove("display-none_important");
        
    }



}