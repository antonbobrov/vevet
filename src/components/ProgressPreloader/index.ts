import { selectAll } from 'vevet-dom';
import { PCancelable } from '@/utils/common/PCancelable';
import { AnimationFrame } from '../AnimationFrame';
import { Preloader } from '../Preloader';
import { Timeline } from '../Timeline';
import { NProgressPreloader } from './types';
import { clamp, lerp } from '@/utils/math';
import { preloadImage } from './utils/preloadImage';
import { preloadVideo } from './utils/preloadVideo';
import { preloadCustomElement } from './utils/preloadCustomElement';
import { getApp } from '@/utils/internal/getApp';

export type { NProgressPreloader };

/**
 * Page preloader that calculates the loading progress of page resources such as images, videos, and custom elements.
 * Provides smooth progress calculation using an animation frame and optionally a timeline for forced completion.
 *
 * @requires Requires styles: `@import '~vevet/lib/styles/components/Preloader';`
 */
export class ProgressPreloader<
  StaticProps extends
    NProgressPreloader.IStaticProps = NProgressPreloader.IStaticProps,
  ChangeableProps extends
    NProgressPreloader.IChangeableProps = NProgressPreloader.IChangeableProps,
  CallbacksTypes extends
    NProgressPreloader.ICallbacksTypes = NProgressPreloader.ICallbacksTypes,
> extends Preloader<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      resourcesQuantity: 0,
      canPreloadImages: true,
      canPreloadVideos: false,
      preloadCustomSelector: '.js-preload',
      preloadIgnoreClassName: 'js-preload-ignore',
      lerp: 0.1,
      forceEnd: 500,
    };
  }

  /**
   * List of images to be preloaded.
   */
  protected _images: HTMLImageElement[];

  /**
   * Returns the list of images to be preloaded.
   */
  get images() {
    return this._images;
  }

  /**
   * List of videos to be preloaded.
   */
  protected _videos: HTMLVideoElement[];

  /**
   * Returns the list of videos to be preloaded.
   */
  get videos() {
    return this._videos;
  }

  /**
   * List of custom resources to be preloaded based on custom selectors.
   */
  protected _customResources: NProgressPreloader.ICustomResourceData[];

  /**
   * Returns the list of custom resources to be preloaded.
   */
  get customResources() {
    return this._customResources;
  }

  /**
   * The total quantity of resources to be preloaded, including images, videos, custom elements, and user-defined amounts.
   */
  protected _resourcesQuantity: number;

  /**
   * Returns the total number of resources to be preloaded, accounting for user-defined resources and automatic resources.
   */
  get resourcesQuantity() {
    return (
      this._resourcesQuantity +
      this.props.resourcesQuantity +
      this.images.length +
      this.videos.length +
      this.customResources.length +
      1
    );
  }

  /**
   * The quantity of loaded resources.
   */
  protected _loadedResourcesQuantity: number;

  /**
   * Returns the number of resources that have been successfully loaded.
   */
  get loadedResourcesQuantity() {
    return clamp(this._loadedResourcesQuantity, [0, this.resourcesQuantity]);
  }

  /**
   * The current loading progress as a fraction between 0 and 1.
   */
  get loadProgress() {
    return this.loadedResourcesQuantity / this.resourcesQuantity;
  }

  /**
   * The preloader's current progress value.
   */
  protected _progress: number;

  /**
   * Returns the current preloader progress value.
   */
  get progress() {
    return this._progress;
  }

  /**
   * Sets the preloader's progress value and triggers progress change handling.
   */
  protected set progress(val: number) {
    this._progress = val;

    this._handleProgressChange();
  }

  /**
   * Animation frame instance used for smooth progress calculation.
   */
  protected _raf?: AnimationFrame;

  /**
   * Timeline used to finish progress animation if forced.
   */
  protected _endTimeline?: Timeline;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    this._images = [];
    this._videos = [];
    this._customResources = [];
    this._resourcesQuantity = 0;
    this._loadedResourcesQuantity = 0;
    this._progress = 0;

    if (canInit) {
      this.init();
    }
  }

  /**
   * Initializes the preloader and retrieves the resources to be preloaded.
   */
  protected _init() {
    this._getResources();

    super._init();
  }

  /**
   * Sets up event listeners and handles resource preloading.
   */
  protected _setEvents() {
    super._setEvents();

    const { lerp: lerpProp } = this.props;

    // create animation frame if needed
    if (typeof lerpProp === 'number' && lerpProp < 1) {
      this._raf = new AnimationFrame();

      this._raf.addCallback('frame', () => {
        this.progress = lerp(this.progress, this.loadProgress, lerpProp);
      });

      this._raf.play();
    }

    // iterate resources on page load
    getApp()
      .onPageLoad()
      .then(() => this._handleLoadedResource({ isSuccess: true }))
      .catch(() => {});

    // preload resources
    this._preloadResources();
  }

  /**
   * Searches for all the images, videos, and custom elements that need to be preloaded.
   */
  protected _getResources() {
    const {
      canPreloadImages,
      canPreloadVideos,
      preloadCustomSelector,
      preloadIgnoreClassName,
    } = this.props;

    // Get images
    if (canPreloadImages) {
      const images = selectAll('img');
      images.forEach((image) => {
        const shouldPreload =
          !image.classList.contains(preloadIgnoreClassName) &&
          image.loading !== 'lazy';

        if (shouldPreload) {
          this._images.push(image);
        }
      });
    }

    // Get videos
    if (canPreloadVideos) {
      const videos = selectAll('video');
      videos.forEach((video) => {
        if (!video.classList.contains(preloadIgnoreClassName)) {
          this._videos.push(video);
        }
      });
    }

    // Get custom resources
    if (preloadCustomSelector) {
      Array.from(selectAll(preloadCustomSelector)).forEach((element) => {
        if (element.classList.contains(preloadIgnoreClassName)) {
          return;
        }

        let loadCount = parseInt(
          element.getAttribute('data-load-count') || '1',
          10,
        );

        loadCount = Number.isNaN(loadCount)
          ? 1
          : clamp(loadCount, [1, Infinity]);

        for (let index = 1; index <= loadCount; index += 1) {
          const targetProgress = index / loadCount;

          this._customResources.push({
            element,
            targetProgress,
          });
        }
      });
    }
  }

  /** Catch the moment when the page is fully loaded. */
  protected _onLoaded() {
    return new PCancelable((resolve: (...arg: any) => void) => {
      let isCallbackDone = false;

      this.callbacks.add(
        'progress',
        // @ts-ignore
        (data) => {
          if (data.progress >= 1 && !isCallbackDone) {
            isCallbackDone = true;

            resolve();
          }
        },
        { isProtected: true, name: this.name },
      );
    });
  }

  /**
   * Preloads all gathered resources including images, videos, and custom elements.
   */
  protected _preloadResources() {
    this.images.forEach((image) =>
      preloadImage(image, (isSuccess) =>
        this._handleLoadedResource({ element: image, isSuccess }),
      ),
    );

    this.videos.forEach((video) =>
      preloadVideo(video, (isSuccess) =>
        this._handleLoadedResource({ element: video, isSuccess }),
      ),
    );

    this._customResources.forEach((data) => {
      preloadCustomElement(data, this)
        .then(() =>
          this._handleLoadedResource({
            element: data.element,
            isSuccess: true,
          }),
        )
        .catch(() => {});
    });
  }

  /**
   * Handles a resource being fully loaded and updates the loaded resource count.
   */
  protected _handleLoadedResource({
    element,
    isSuccess,
  }: NProgressPreloader.IHandleLoadedResourceParameter) {
    if (this.loadProgress >= 1) {
      return;
    }

    this._loadedResourcesQuantity += 1;
    this.callbacks.tbt('resourceLoad', {
      element,
      atProgress: this.progress,
      loadProgress: this.loadProgress,
      isSuccess,
    });

    // update progress if no animation frame
    if (!this._raf) {
      this.progress = this.loadProgress;
    }
  }

  /**
   * Increments the loaded resources count by a given quantity.
   *
   * @param quantity - The number of resources to consider as loaded.
   */
  public iterateLoadedResources(quantityProp = 1) {
    const quantity = Math.abs(quantityProp);

    for (let index = 0; index < quantity; index += 1) {
      this._handleLoadedResource({ isSuccess: true });
    }
  }

  /**
   * Increments the total resource count by a given quantity.
   *
   * @param quantity - The number of resources to add to the total.
   */
  public iterateResourcesQuantity(quantity = 1) {
    this._resourcesQuantity += quantity;
  }

  /**
   * Handles the change in preloader progress, triggering callbacks and determining when to hide the preloader.
   */
  protected _handleProgressChange() {
    this.callbacks.tbt('progress', {
      progress: this.progress,
      loadProgress: this.loadProgress,
    });

    // if full progress,
    // we hide the preloader
    if (this.progress >= 1) {
      // destroy animations
      if (this._raf) {
        this._raf.destroy();
        this._raf = undefined;
      }

      return;
    }

    // otherwise, we check if there's a need to launch a timeline to finish the animation
    if (
      typeof this.props.forceEnd === 'number' &&
      this.loadProgress >= 1 &&
      !this._endTimeline
    ) {
      // destroy the animation frame
      if (this._raf) {
        this._raf.destroy();
        this._raf = undefined;
      }

      // create a timeline
      this._endTimeline = new Timeline({ duration: this.props.forceEnd });
      const startProgress = this.progress;

      this._endTimeline.addCallback('progress', ({ p }) => {
        const diff = 1 - startProgress;
        this.progress = startProgress + diff * p;
      });

      this._endTimeline.play();
    }
  }

  /**
   * Destroys the component and cleans up any remaining resources or animations.
   */
  protected _destroy() {
    super._destroy();

    this._raf?.destroy();
    this._endTimeline?.destroy();
  }
}
