import { TRequiredProps } from '@/internal/requiredProps';
import { Timeline } from '../Timeline';
import { clamp, lerp } from '@/utils/math';
import { preloadImage } from './utils/preloadImage';
import { preloadVideo } from './utils/preloadVideo';
import { preloadCustomElement } from './utils/preloadCustomElement';
import {
  IProgressPreloaderCallbacksMap,
  IProgressPreloaderResource,
  IProgressPreloaderMutableProps,
  IProgressPreloaderStaticProps,
} from './types';
import { Preloader } from '../Preloader';
import { Raf } from '../Raf';
import { initVevet } from '@/global/initVevet';

export * from './types';

/**
 * Page preloader for calculating and displaying the loading progress of resources (images, videos, custom elements).
 * Provides smooth progress transitions.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/ProgressPreloader)
 *
 * @group Components
 */
export class ProgressPreloader<
  CallbacksMap extends
    IProgressPreloaderCallbacksMap = IProgressPreloaderCallbacksMap,
  StaticProps extends
    IProgressPreloaderStaticProps = IProgressPreloaderStaticProps,
  MutableProps extends
    IProgressPreloaderMutableProps = IProgressPreloaderMutableProps,
> extends Preloader<CallbacksMap, StaticProps, MutableProps> {
  /**
   * Retrieves the default static properties.
   */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      preloadImages: true,
      preloadVideos: false,
      customSelector: '.js-preload',
      ignoreClassName: 'js-preload-ignore',
      lerp: 0.1,
      endDuration: 500,
    } as TRequiredProps<StaticProps>;
  }

  /**
   * Retrieves the default mutable properties.
   */
  public _getMutable(): TRequiredProps<MutableProps> {
    return { ...super._getMutable() } as TRequiredProps<MutableProps>;
  }

  /**
   * List of custom resources to preload based on selectors.
   */
  protected _resources: IProgressPreloaderResource[] = [
    { id: 'page', weight: 1, loaded: 0 },
  ];

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
   * Current interpolated progress value for smooth transitions.
   */
  protected _progress = 0;

  /**
   * Gets the current progress value.
   */
  get progress() {
    return this._progress;
  }

  /** Animation frame instance for managing smooth progress updates. */
  protected _raf: Raf;

  constructor(props?: StaticProps & MutableProps) {
    super(props);

    // Initialize animation frame if interpolation is enabled
    this._raf = new Raf();
    this._raf.on('frame', ({ lerpFactor }) => {
      this._handleUpdate(
        lerp(this._progress, this.loadProgress, lerpFactor(this.props.lerp)),
      );
    });
    this._raf.play();

    // Start preloading resources
    this._fetchImages();
    this._fetchVideos();
    this._fetchResources();

    // Handle resources on page load
    initVevet().onLoad(() => this.resolveResource('page'));
  }

  /** Preload images */
  protected _fetchImages() {
    if (!this.props.preloadImages) {
      return;
    }

    let list = Array.from(document.querySelectorAll('img'));
    list = list.filter((resource) => {
      const isIgnored = resource.classList.contains(this.props.ignoreClassName);

      return !isIgnored && resource.loading !== 'lazy';
    });

    this._resources.push(
      ...list.map((resource) => ({
        id: resource,
        weight: 1,
        loaded: 0,
      })),
    );

    list.forEach((element) => {
      preloadImage(element, () => this.resolveResource(element));
    });
  }

  /** Preload videos */
  protected _fetchVideos() {
    if (!this.props.preloadVideos) {
      return;
    }

    let list = Array.from(document.querySelectorAll('video'));
    list = list.filter(
      (resource) => !resource.classList.contains(this.props.ignoreClassName),
    );

    this._resources.push(
      ...list.map((resource) => ({
        id: resource,
        weight: 1,
        loaded: 0,
      })),
    );

    list.forEach((element) => {
      preloadVideo(element, () => this.resolveResource(element));
    });
  }

  /** Preload custom resources */
  protected _fetchResources() {
    let list = Array.from(document.querySelectorAll(this.props.customSelector));
    list = list.filter(
      (resource) => !resource.classList.contains(this.props.ignoreClassName),
    );

    list.forEach((element) => {
      let weight = parseInt(element.getAttribute('data-weight') || '1', 10);
      weight = Number.isNaN(weight) ? 1 : clamp(weight, 1, Infinity);

      const resource = {
        id: element,
        weight,
        loaded: 0,
      };

      this._resources.push(resource);

      preloadCustomElement(resource, () => this.resolveResource(element));
    });
  }

  /**
   * Adds a custom resource
   * @param id - The custom resource element or identifier to preload.
   * @param weight - The resource weight
   */
  public addResource(id: Element | string, weight = 1) {
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
  public resolveResource(id: Element | string, loadedWeight?: number) {
    if (this.isDestroyed) {
      return;
    }

    const resource = this.resources.find((item) => item.id === id);
    if (!resource) {
      return;
    }

    resource.loaded = loadedWeight ?? resource.weight;

    this.callbacks.emit('resource', resource);
  }

  /**
   * Handles updates to the preloader's progress, triggering events and animations as needed.
   * @param newProgress - The updated progress value.
   */
  protected _handleUpdate(newProgress: number) {
    this._progress = newProgress;

    this.callbacks.emit('progress', undefined);

    if (this.loadProgress < 1) {
      return;
    }

    this._raf?.destroy();

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
  protected _onLoaded(callback: () => void) {
    let isFinish = false;

    this.callbacks.on(
      'progress',
      (() => {
        if (this.progress >= 1 && !isFinish) {
          isFinish = true;
          callback();
        }
      }) as any,
      { protected: true, name: this.name },
    );
  }

  /**
   * Cleans up resources and destroys the preloader instance.
   */
  protected _destroy() {
    super._destroy();

    this._raf.destroy();
  }
}
