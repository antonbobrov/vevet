import SliderModule from './SliderModule';
import merge from './merge';
import FrameModule from './FrameModule';

// import { get } from 'node-background-size';
const nodeBackgroundSize = require('node-background-size');
const dom = require('dom-create-element');
import 'node-background-size/dist/types/types.d.ts';

/**
 * @classdesc A class for creating image/video sliders onto canvas. <br>
 * Available targets:
 *  <ul>
 *      <li>All the available targets for {@linkcode Vevet.SliderModule}</li>
 *      <li>loaded - when images and videos are loaded.</li>
 *      <li>renderStat - render on the first start or resize.</li>
 *  </ul>
 * <br><br> <b>import {SliderCanvasModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.SliderCanvasModule : first :  }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : prev : Vevet.SliderModule.AnimationData }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : next : Vevet.SliderModule.AnimationData }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : start : Vevet.SliderModule.AnimationData }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : end : Vevet.SliderModule.AnimationData }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : show :  }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : hide :  }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : shown :  }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : hidden :  }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : render : Vevet.SliderModule.Render }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : timeline : Vevet.SliderModule.Timeline }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : loaded :  }
 * @vevetModuleCallback { Vevet.SliderCanvasModule : renderStat :  }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.SliderModule
 * @requires Vevet.FrameModule
 */
export default class SliderCanvasModule extends SliderModule {


    
    /**
     * @memberof Vevet.SliderCanvasModule
     * @typedef {object} Properties
     * @augments Vevet.SliderModule.Properties
     * 
     * @property {Vevet.SliderCanvasModule.Autoframe} [autoframe] - Launch animation frame automatically to render
     * images onto canvas even when there's no change between slides. It it useful when creating some
     * effects onto canvas that do not depend on slides animation change.
     * @property {boolean} [autoplay=true] Autoplay video slides.
     * @property {string} [img=img] Image elements tag. It may be replaced by div, f.e., 
     * not to load images twice.
     * @property {string} [src=src] Source attribute.
     *
     */
    /**
     * @memberof Vevet.SliderCanvasModule
     * @typedef {object} Autoframe
     * 
     * @property {boolean} [on=false] Enable
     * @property {number} [fps=30] Frames per second
     *
     */
    /**
     * @alias Vevet.SliderCanvasModule
     * 
     * @param {Vevet.SliderCanvasModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.SliderCanvasModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
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
     * @member Vevet.SliderCanvasModule#prop
     * @memberof Vevet.SliderCanvasModule
     * @readonly
     * @type {Vevet.SliderCanvasModule.Properties}
     */

    /**
     * @member Vevet.SliderCanvasModule#_prop
     * @memberof Vevet.SliderCanvasModule
     * @protected
     * @type {Vevet.SliderCanvasModule.Properties}
     */

    /**
     * @function Vevet.SliderCanvasModule#changeProp
     * @memberof Vevet.SliderCanvasModule
     * @param {Vevet.SliderCanvasModule.Properties} [prop]
     */



    // Extra constructor
    _extra() {

        /**
         * @description Canvas element
         * @type {HTMLCanvasElement}
         * @protected
         */
        this._canvas = false;
        /**
         * @description Canvas Context.
         * @type {CanvasRenderingContext2D}
         * @protected
         */
        this._ctx = {};
        /**
         * @description Resources.
         * @type {Array<HTMLImageElement|HTMLVideoElement>}
         * @protected
         */
        this._res = [];
        // import('node-background-size').MediaSizes
        /**
         * @typedef { object } MediaSizes
         * @memberof Vevet.SliderCanvasModule
         * @property {HTMLImageElement|HTMLVideoElement} media - The media element itself.
         * @property {number} width - The calculated width.
         * @property {number} height - The calculated height.
         * @property {number} mediaWidth - The initial width of the media element.
         * @property {number} mediaHeight - The initial height of the media element.
         * @property {number} scale - Scaling.
         * @property {number} x - The x-axis coordinate of the top left corner.
         * @property {number} y - The y-axis coordinate of the top left corner.
         */
        /**
         * @description Resources' sizes.
         * @type {Array<Vevet.SliderCanvasModule.MediaSizes>}
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
         * @type {Vevet.FrameModule}
         * @protected
         */
        this._autoframe = new FrameModule({
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
     * @description If all resources are loaded.
     * @readonly
     * @type {boolean}
     */
    get loaded() {
        return this._loadedAll;
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
     * @protected
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
     * @protected
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
     * @protected
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
     * @protected
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
     * @protected
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
            let size = nodeBackgroundSize.get({
                media: res,
                width: width,
                height: height
            });
            this._resSize.push(size);
        });

    }



    /**
     * @description Clear canvas.
     * @protected
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
     * @param {Vevet.TimelineModule.Data} p - Progress data.
     * @protected
     */
    _animateSlides(p) {

        this._canvasClear();
        super._animateSlides(p);

    }
    

    
    /**
     * @description Animation rendering.
     * @param {Vevet.SliderModule.Render} data - Animation data.
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
     * @param {Vevet.SliderModule.Render} data - Animation data.
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