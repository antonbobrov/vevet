import { selectAll } from 'vevet-dom';
import { AnimationFrame } from '../animation-frame/AnimationFrame';
import { RequiredModuleProp } from '../../utils/types/utility';
import lerp from '../../utils/math/lerp';
import { Preloader, NPreloader } from './Preloader';
import { Timeline } from '../timeline/Timeline';



export namespace NProgressPreloader {

    /**
     * Static properties
     */
    export interface StaticProp extends NPreloader.StaticProp {
        /**
         * Default resources quantity
         * @default 0
         */
        resources?: number;
        /**
         * What elements to preload
         */
        loaders?: {
            /**
             * Preload images
             * @default true
             */
            img?: boolean;
            /**
             * Preload videos. Only metadata
             * @default true
             */
            video?: boolean;
            /**
             * Selector for elements to be preloaded.
             * These elements must have the property 'isLoaded' or 'isComplete'.
             * @default '.js-preload'
             */
            custom?: string | false;
        };
        /**
         * Smooth calculation settings
         */
        calc?: {
            /**
             * Linear interpolation speed. If false, animation will not be used.
             * @default 0.1
             */
            lerp?: number | false;
            /**
             * If true and 'lerp' is less than 1, the animation will be stopped
             * and an animation Timeline will be launched to end the progress calculation.
             * If false, the progress smooth calculation will end through
             * linear interpolation.
             * @default 500
             */
            forceEnd?: number | false;
        };
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NPreloader.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NPreloader.CallbacksTypes {
        'resourceLoad': false;
        'progress': {
            progress: number;
        };
    }

    export interface CustomResource extends Element {
        isLoaded?: boolean;
        isComplete?: boolean;
    }

}



/**
 * A page preloader with smooth progress calculation
 */
export class ProgressPreloader <
    StaticProp extends NProgressPreloader.StaticProp = NProgressPreloader.StaticProp,
    ChangeableProp extends NProgressPreloader.ChangeableProp = NProgressPreloader.ChangeableProp,
    CallbacksTypes extends NProgressPreloader.CallbacksTypes = NProgressPreloader.CallbacksTypes,
> extends Preloader <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            resources: 0,
            loaders: {
                img: true,
                video: true,
                custom: '.js-preload',
            },
            calc: {
                lerp: 0.1,
                forceEnd: 500,
            },
        };
    }



    /**
     * Image resources
     */
    get imgs () {
        return this._imgs;
    }
    protected _imgs: HTMLImageElement[];

    /**
     * Video resources
     */
    get videos () {
        return this._videos;
    }
    protected _videos: HTMLVideoElement[];

    /**
     * Custom resources
     */
    get customResources () {
        return this._customResources;
    }
    protected _customResources: NProgressPreloader.CustomResource[];



    /**
     * Quantity of resources to be preloader
     */
    get resourcesTotal () {
        return this._resourcesTotal;
    }
    protected _resourcesTotal: number;

    /**
     * Quantity of resources been already loaded
     */
    get resourcesLoaded () {
        return this._resourcesLoaded;
    }
    protected _resourcesLoaded: number;

    /**
     * Progress of resources loaded
     */
    get loadProgress () {
        return this.resourcesLoaded / this.resourcesTotal;
    }

    /**
     * Preloader progress
     */
    get progress () {
        return this._progress;
    }
    protected set progress (val: number) {
        this._progress = val;
        this._handleProgress();
    }
    protected _progress: number;



    /**
     * Animation progress. For smooth progress calculation
     */
    protected _animationFrame?: AnimationFrame;

    /**
     * A timeline to finish progress animation
     */
    protected _endTimeline?: Timeline;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // set default vars
        this._imgs = [];
        this._videos = [];
        this._customResources = [];
        this._resourcesTotal = 1 + this.prop.resources;
        this._resourcesLoaded = 0;
        this._progress = 0;

        // initialize the class
        if (init) {
            this.init();
        }
    }

    protected _constructor () {
        super._constructor();
        this._getResources();
    }

    protected _setEvents () {
        super._setEvents();

        const { calc } = this.prop;
        const { lerp: lerpVal } = calc;

        // create animation frame if needed
        if (typeof lerpVal === 'number') {
            this._animationFrame = new AnimationFrame();
            this._animationFrame.addCallback('frame', () => {
                this.progress = lerp(
                    this.progress,
                    this.loadProgress,
                    lerpVal,
                );
            });
            this._animationFrame.play();
        }

        // preload resources
        this._preloadResources();

        // iterate resources on page load
        this._app.onPageLoaded().then(() => {
            this._handleLoadedResource();
        });
    }

    /**
     * Seek the moment when the page is fully loaded
     */
    protected _onLoaded () {
        return new Promise((
            resolve: (...arg: any) => void,
        ) => {
            let callbackLaunched = false;
            this.callbacks.add('progress', (data) => {
                if (data.progress >= 1 && !callbackLaunched) {
                    resolve();
                    callbackLaunched = true;
                }
            }, {
                protected: true,
            });
        });
    }



    /**
     * Get resources to be preloader
     */
    protected _getResources () {
        const { loaders } = this.prop;
        // get images
        if (loaders.img) {
            const imgs = selectAll('img');
            imgs.forEach((img) => {
                this._imgs.push(img);
                this._resourcesTotal += 1;
            });
        }

        // get videos
        if (loaders.video) {
            const videos = selectAll('video');
            videos.forEach((video) => {
                this._videos.push(video);
                this._resourcesTotal += 1;
            });
        }

        // get custom resources
        if (loaders.custom) {
            this._customResources = Array.from(selectAll(loaders.custom));
            this._resourcesTotal += this._customResources.length;
        }
    }

    /**
     * Preload all resources
     */
    protected _preloadResources () {
        // check if no resources
        if (this._resourcesTotal === 0) {
            this._resourcesTotal = 1;
            this._handleLoadedResource();
        }

        // preload images
        this._imgs.forEach((img) => {
            if (img.complete) {
                this._handleLoadedResource();
            } else {
                const image = new Image();
                img.addEventListener('load', () => {
                    this._handleLoadedResource();
                });
                img.addEventListener('error', () => {
                    this._handleLoadedResource();
                });
                image.src = img.src;
            }
        });

        // preload videos
        this._videos.forEach((video) => {
            if (video.readyState > 0) {
                this._handleLoadedResource();
            } else {
                if (video.preload === 'none') {
                    this._handleLoadedResource();
                    return;
                }
                video.addEventListener('error', () => {
                    this._handleLoadedResource();
                });
                video.addEventListener('loadedmetadata', () => {
                    this._handleLoadedResource();
                });
            }
        });

        // preload custom resources
        this._customResources.forEach((el) => {
            this._seekCustomResourceLoaded(el).then(() => {
                this._handleLoadedResource();
            });
        });
    }

    /**
     * Seek the moment when a custom resource is loaded
     */
    protected _seekCustomResourceLoaded (
        el: NProgressPreloader.CustomResource,
    ) {
        return new Promise((
            resolve: (...arg: any) => void,
        ) => {
            if (el.isComplete || el.isLoaded) {
                resolve();
                return;
            }
            setTimeout(() => {
                if (this.destroyed) {
                    return;
                }
                this._seekCustomResourceLoaded(el).then(() => {
                    resolve();
                });
            }, 50);
        });
    }

    /**
     * Iterate quantity of loaded resources.
     * @param quantity - Only integers
     */
    public addResourcesLoaded (
        quantity = 1,
    ) {
        for (let index = 0; index < quantity; index += 1) {
            this._handleLoadedResource();
        }
    }

    /**
     * Iterate quantity of total resources.
     * @param quantity - Only integers
     */
    public addResourcesTotal (
        quantity = 1,
    ) {
        this._resourcesTotal += quantity;
    }



    /**
     * Event on resource loaded
     */
    protected _handleLoadedResource () {
        if (this.loadProgress >= 1) {
            return;
        }

        this._resourcesLoaded += 1;
        this.callbacks.tbt('resourceLoad', false);

        // update current preloader progress if no animation set
        if (!this._animationFrame) {
            this.progress = this.loadProgress;
        }
    }

    /**
     * Event on progress change
     */
    protected _handleProgress () {
        // launch callback
        this.callbacks.tbt('progress', {
            progress: this._progress,
        });

        // if full progress,
        // we hide the preloader
        if (this.progress >= 1) {
            // destroy animations
            if (this._animationFrame) {
                this._animationFrame.destroy();
                this._animationFrame = undefined;
            }
            return;
        }

        // otherwise, we check if there's a need to launch a timeline
        // to end the animation
        if (
            typeof this.prop.calc.forceEnd === 'number'
            && this.loadProgress >= 1
            && !this._endTimeline
        ) {
            // destroy animation frame
            if (this._animationFrame) {
                this._animationFrame.destroy();
                this._animationFrame = undefined;
            }
            // create a timeline
            this._endTimeline = new Timeline({
                duration: this.prop.calc.forceEnd,
            });
            const startProgress = this.progress;
            this._endTimeline.addCallback('progress', (data) => {
                const diff = 1 - startProgress;
                this.progress = startProgress + (diff * data.progress);
            });
            this._endTimeline.play();
        }

        // and since some time the preloader will be hidden automatically.
        // See '_onLoaded' method.
    }



    /**
     * Destroy the component
     */
    protected _destroy () {
        super._destroy();
        if (this._animationFrame) {
            this._animationFrame.destroy();
        }
    }
}
