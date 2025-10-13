import { Timeline } from '../Timeline';
import { clamp, lerp } from '../../utils/math';
import { preloadImage } from './utils/preloadImage';
import { preloadVideo } from './utils/preloadVideo';
import { preloadCustomElement } from './utils/preloadCustomElement';
import { Preloader } from '../Preloader';
import { Raf } from '../Raf';
import { initVevet } from '../../global/initVevet';
export * from './types';
const PAGE_RESOURCE = `vevet-page-${Math.random()}`;
/**
 * Page preloader for calculating and displaying the loading progress of resources (images, videos, custom elements).
 * Provides smooth progress transitions.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/ProgressPreloader)
 *
 * @group Components
 */
export class ProgressPreloader extends Preloader {
    /**
     * Retrieves the default static properties.
     */
    _getStatic() {
        return Object.assign(Object.assign({}, super._getStatic()), { preloadImages: true, preloadVideos: false, customSelector: '.js-preload', ignoreClassName: 'js-preload-ignore', lerp: 0.1, endDuration: 500 });
    }
    /**
     * Retrieves the default mutable properties.
     */
    _getMutable() {
        return Object.assign({}, super._getMutable());
    }
    /**
     * The list of custom resources to preload.
     */
    get resources() {
        return this._resources;
    }
    /**
     * Calculates the total number of resources to preload, including their weight.
     */
    get totalWeight() {
        return this.resources.reduce((acc, { weight }) => acc + weight, 0);
    }
    /**
     * Loaded weight
     */
    get loadedWeight() {
        return this.resources.reduce((acc, { loaded }) => acc + loaded, 0);
    }
    /**
     * Current loading progress (0 to 1).
     */
    get loadProgress() {
        return this.loadedWeight / this.totalWeight;
    }
    /**
     * Gets the current progress value.
     */
    get progress() {
        return this._progress;
    }
    constructor(props) {
        super(props);
        /**
         * List of custom resources to preload based on selectors.
         */
        this._resources = [
            { id: PAGE_RESOURCE, weight: 1, loaded: 0 },
        ];
        /**
         * Current interpolated progress value for smooth transitions.
         */
        this._progress = 0;
        // Initialize animation frame if interpolation is enabled
        this._raf = new Raf();
        this._raf.on('frame', ({ lerpFactor }) => {
            this._handleUpdate(lerp(this._progress, this.loadProgress, lerpFactor(this.props.lerp)));
        });
        this._raf.play();
        // Start preloading resources
        this._fetchImages();
        this._fetchVideos();
        this._fetchResources();
        // Handle resources on page load
        initVevet().onLoad(() => this.resolveResource(PAGE_RESOURCE));
    }
    /** Preload images */
    _fetchImages() {
        if (!this.props.preloadImages) {
            return;
        }
        let list = Array.from(document.querySelectorAll('img'));
        list = list.filter((resource) => {
            const isIgnored = resource.classList.contains(this.props.ignoreClassName);
            return !isIgnored && resource.loading !== 'lazy';
        });
        this._resources.push(...list.map((resource) => ({
            id: resource,
            weight: 1,
            loaded: 0,
        })));
        list.forEach((element) => {
            preloadImage(element, () => this.resolveResource(element));
        });
    }
    /** Preload videos */
    _fetchVideos() {
        if (!this.props.preloadVideos) {
            return;
        }
        let list = Array.from(document.querySelectorAll('video'));
        list = list.filter((resource) => !resource.classList.contains(this.props.ignoreClassName));
        this._resources.push(...list.map((resource) => ({
            id: resource,
            weight: 1,
            loaded: 0,
        })));
        list.forEach((element) => {
            preloadVideo(element, () => this.resolveResource(element));
        });
    }
    /** Preload custom resources */
    _fetchResources() {
        let list = Array.from(document.querySelectorAll(this.props.customSelector));
        list = list.filter((resource) => !resource.classList.contains(this.props.ignoreClassName));
        list.forEach((element) => {
            let weight = parseInt(element.getAttribute('data-weight') || '1', 10);
            weight = Number.isNaN(weight) ? 1 : clamp(weight, 1, Infinity);
            const resource = {
                id: element,
                weight,
                loaded: 0,
            };
            this._resources.push(resource);
            preloadCustomElement(resource, (loadedWeight) => this.resolveResource(element, loadedWeight));
        });
    }
    /**
     * Adds a custom resource
     * @param id - The custom resource element or identifier to preload.
     * @param weight - The resource weight
     */
    addResource(id, weight = 1) {
        if (this.isDestroyed) {
            return;
        }
        const hasResource = this.resources.some((item) => item.id === id);
        if (hasResource) {
            throw new Error('Resource already exists');
        }
        this._resources.push({ id, weight, loaded: 0 });
    }
    /**
     * Emits a resource load event and updates the count of loaded resources.
     * @param id - The resource element or identifier being loaded.
     */
    resolveResource(id, loadedWeight) {
        if (this.isDestroyed) {
            return;
        }
        const resource = this.resources.find((item) => item.id === id);
        if (!resource) {
            return;
        }
        const targetWeight = loadedWeight !== null && loadedWeight !== void 0 ? loadedWeight : resource.weight;
        resource.loaded = clamp(targetWeight, 0, resource.weight);
        this.callbacks.emit('resource', resource);
    }
    /**
     * Handles updates to the preloader's progress, triggering events and animations as needed.
     * @param newProgress - The updated progress value.
     */
    _handleUpdate(newProgress) {
        var _a;
        this._progress = newProgress;
        this.callbacks.emit('progress', undefined);
        if (this.loadProgress < 1) {
            return;
        }
        (_a = this._raf) === null || _a === void 0 ? void 0 : _a.destroy();
        const startProgress = this.progress;
        if (startProgress >= 1) {
            return;
        }
        const endTimeline = new Timeline({ duration: this.props.endDuration });
        this.onDestroy(() => endTimeline.destroy());
        endTimeline.on('update', ({ progress }) => {
            const diff = 1 - startProgress;
            this._progress = startProgress + diff * progress;
            this.callbacks.emit('progress', undefined);
        });
        endTimeline.play();
    }
    /**
     * Resolves when the page and all resources are fully loaded.
     */
    _onLoaded(callback) {
        let isFinish = false;
        this.callbacks.on('progress', (() => {
            if (this.progress >= 1 && !isFinish) {
                isFinish = true;
                callback();
            }
        }), { protected: true, name: this.name });
    }
    /**
     * Cleans up resources and destroys the preloader instance.
     */
    _destroy() {
        super._destroy();
        this._raf.destroy();
    }
}
//# sourceMappingURL=index.js.map