import utils from '../../core/utils';
import Plugin from '../Plugin';

/**
 * @classdesc Load images and video before a page can be shown. <br>
 * <br><br> <b>import {PageLoadMediaPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 */
export default class PageLoadMediaPlugin extends Plugin {


    
    /**
     * @memberof Vevet.PageLoadMediaPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [images=true] - *** Defines if all images inside the page will be loaded before showing the page. Even if you call {@linkcode Vevet.PageModule#show}, the page will be shown only when images will be loaded.
     * @property {boolean} [videos=true] - *** The same thing but about videos.
     * @property {boolean} [bg=true] - *** The same thing but about background images.
     * @property {boolean} [bgSelector=.bg] - *** Background images selector.
     */
    /**
     * @alias Vevet.PageLoadMediaPlugin
     * @description Construct the class.
     * 
     * @param {Vevet.PageLoadMediaPlugin.Properties} [data] - Object of data to construct the class.
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.PageLoadMediaPlugin.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            images: true,
            videos: true,
            bg: true,
            bgSelector: '.bg'
        });
    }

    /**
     * @member Vevet.PageLoadMediaPlugin#prop
     * @memberof Vevet.PageLoadMediaPlugin
     * @readonly
     * @type {Vevet.PageLoadMediaPlugin.Properties}
     */

    /**
     * @member Vevet.PageLoadMediaPlugin#_prop
     * @memberof Vevet.PageLoadMediaPlugin
     * @protected
     * @type {Vevet.PageLoadMediaPlugin.Properties}
     */

    /**
     * @function Vevet.PageLoadMediaPlugin#changeProp
     * @memberof Vevet.PageLoadMediaPlugin
     * @param {object} [prop]
     */

    /**
     * @member Vevet.PageLoadMediaPlugin#_m
     * @memberof Vevet.PageLoadMediaPlugin
     * @protected
     * @type {Vevet.PageModule}
     */


    
    // Extra for Constructor
    _extra() {

        super._extra();

        // init vars
        this._m.on("create", this._initVars.bind(this));

        // load media
        this._m.on("create", this._load.bind(this));

        // override show
        let showCheckMethod = this._m._showCheck.bind(this._m);
        this._m._showCheck = () => {

            // native check
            if (!showCheckMethod()) {
                return false;
            }

            // check resources
            if ((this._prop.images || this._prop.videos || this._prop.bg) & (this._mediaLoaded < this._mediaTotal)) {
                this._showAfterMedia = true;
                return false;
            }

            return true;

        };

    }

    _initVars() {

        this._mediaTotal = 0;
        this._mediaLoaded = 0;
        this._showAfterMedia = false;

    }



    /**
     * @description Load resources.
     * @private
     */
    _load() {
        
        // images
        if (this._prop.images) {
            this._loadImages();
        }

        // videos
        if (this._prop.videos) {
            this._loadVideos();
        }

        // backgrounds
        if (this._prop.bg) {
            this._loadBg();
        }

    }

    _loadImages() {

        // get & load images
        let images = document.querySelectorAll("img");
        this._mediaTotal += images.length;

        // create pseudo images and load them
        for (let i = 0; i < images.length; i++) {
            let image = new Image();
            image.onload = this._mediaOnLoad.bind(this);
            image.onerror = this._mediaOnLoad.bind(this);
            image.src = images[i].src;
        }

    }

    _loadVideos() {

        // get & load videos
        let videos = document.querySelectorAll("videos");
        this._mediaTotal += videos.length;

        // load videos
        videos.forEach(video => {
            video.addEventListener("loadeddata", this._mediaOnLoad.bind(this));
            video.load();
        });

    }

    _loadBg() {

        // get & load images
        let bgs = document.querySelectorAll(this.prop.bgSelector),
            srcs = [];

        bgs.forEach(bg => {
            let style = bg.currentStyle || window.getComputedStyle(bg, false),
                image = style.backgroundImage;
            if (image != 'none') {
                image = image.slice(4, -1).replace(/"/g, "");
                srcs.push(image);
            }
        });
        this._mediaTotal += srcs.length;

        // // create pseudo images and load them
        for (let i = 0; i < srcs.length; i++) {
            let image = new Image();
            image.onload = this._mediaOnLoad.bind(this);
            image.onerror = this._mediaOnLoad.bind(this);
            image.src = srcs[i];
        }

    }

    _mediaOnLoad() {

        this._mediaLoaded++; 

        if (this._mediaLoaded >= this._mediaTotal){
            if (this._showAfterMedia) {
                this._m.show();
            }
        }       

    }



}