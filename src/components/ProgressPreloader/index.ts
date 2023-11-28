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

export type { NProgressPreloader };

/**
 * Page preloader with smooth progress calculation
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

  /** Images to be preloaded */
  protected _images: HTMLImageElement[];

  /** Images to be preloaded */
  get images() {
    return this._images;
  }

  /** Videos to be preloaded */
  protected _videos: HTMLVideoElement[];

  /** Videos to be preloaded */
  get videos() {
    return this._videos;
  }

  /** Custom resources to be preloaded */
  protected _customResources: NProgressPreloader.ICustomResourceData[];

  /** Custom resources to be preloaded */
  get customResources() {
    return this._customResources;
  }

  protected _resourcesQuantity: number;

  /** Quantity of resources to be preloader */
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

  /** Quantity of loaded resources  */
  protected _loadedResourcesQuantity: number;

  /** Quantity of loaded resources  */
  get loadedResourcesQuantity() {
    return clamp(this._loadedResourcesQuantity, [0, this.resourcesQuantity]);
  }

  /** Loading progress */
  get loadProgress() {
    return this.loadedResourcesQuantity / this.resourcesQuantity;
  }

  /** Preloader progress */
  protected _progress: number;

  /** Preloader progress */
  get progress() {
    return this._progress;
  }

  protected set progress(val: number) {
    this._progress = val;

    this._handleProgressChange();
  }

  /** Animation frame for smooth progress calculation */
  protected _animationFrame?: AnimationFrame;

  /** Timeline to finish progress animation */
  protected _endTimeline?: Timeline;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // set default vars
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

  protected _init() {
    this._getResources();

    super._init();
  }

  /** Set events */
  protected _setEvents() {
    super._setEvents();

    const { lerp: lerpProp } = this.props;

    // create animation frame if needed
    if (typeof lerpProp === 'number') {
      this._animationFrame = new AnimationFrame();

      this._animationFrame.addCallback('frame', () => {
        this.progress = lerp(this.progress, this.loadProgress, lerpProp);
      });

      this._animationFrame.play();
    }

    // iterate resources on page load
    this.app
      .onPageLoad()
      .then(() => this._handleLoadedResource({ isSuccess: true }))
      .catch(() => {});

    // preload resources
    this._preloadResources();
  }

  /** Get resources to be preloaded */
  protected _getResources() {
    const {
      canPreloadImages,
      canPreloadVideos,
      preloadCustomSelector,
      preloadIgnoreClassName,
    } = this.props;

    // get images
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

    // get videos
    if (canPreloadVideos) {
      const videos = selectAll('video');
      videos.forEach((video) => {
        if (!video.classList.contains(preloadIgnoreClassName)) {
          this._videos.push(video);
        }
      });
    }

    // get custom resources
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

  /** Catch the moment when the page is fully loaded */
  protected _onLoaded() {
    return new PCancelable((resolve: (...arg: any) => void) => {
      let isCallbackDone = false;

      this.callbacks.add(
        'progress',
        // @ts-ignore
        ({ progress }) => {
          if (progress >= 1 && !isCallbackDone) {
            isCallbackDone = true;

            resolve();
          }
        },
        { isProtected: true, name: this.name },
      );
    });
  }

  /** Preload all resources */
  protected _preloadResources() {
    this.images.forEach((image) =>
      preloadImage(image, (isSuccess) =>
        this._handleLoadedResource({ element: image, isSuccess }),
      ),
    );

    // preload videos
    this.videos.forEach((video) =>
      preloadVideo(video, (isSuccess) =>
        this._handleLoadedResource({ element: video, isSuccess }),
      ),
    );

    // preload custom resources
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

  /** Event on resource loaded */
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
    if (!this._animationFrame) {
      this.progress = this.loadProgress;
    }
  }

  /** Iterate quantity of loaded resources */
  public iterateLoadedResources(quantityProp = 1) {
    const quantity = Math.abs(quantityProp);

    for (let index = 0; index < quantity; index += 1) {
      this._handleLoadedResource({ isSuccess: true });
    }
  }

  /** Iterate quantity of total resources */
  public iterateResourcesQuantity(quantity = 1) {
    this._resourcesQuantity += quantity;
  }

  /** Event on progress change */
  protected _handleProgressChange() {
    this.callbacks.tbt('progress', {
      progress: this.progress,
      loadProgress: this.loadProgress,
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
      typeof this.props.forceEnd === 'number' &&
      this.loadProgress >= 1 &&
      !this._endTimeline
    ) {
      // destroy animation frame
      if (this._animationFrame) {
        this._animationFrame.destroy();
        this._animationFrame = undefined;
      }

      // create a timeline
      this._endTimeline = new Timeline({ duration: this.props.forceEnd });
      const startProgress = this.progress;

      this._endTimeline.addCallback('progress', (data) => {
        const diff = 1 - startProgress;
        this.progress = startProgress + diff * data.progress;
      });

      this._endTimeline.play();
    }
  }

  /** Destroy the component */
  protected _destroy() {
    super._destroy();

    this._animationFrame?.destroy();
    this._endTimeline?.destroy();
  }
}
