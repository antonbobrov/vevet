import {
  IPreloaderCallbacksMap,
  IPreloaderMutableProps,
  IPreloaderStaticProps,
} from '../Preloader';

/**
 * Static properties for configuring the progress preloader.
 */
export interface IProgressPreloaderStaticProps extends IPreloaderStaticProps {
  /**
   * Container source for preloader resources.
   * @default null
   */
  resourceContainer?: HTMLElement | null;

  /**
   * Enables automatic preloading of images.
   * @default true
   */
  preloadImages?: boolean;

  /**
   * Enables automatic preloading of videos.
   * @default false
   */
  preloadVideos?: boolean;

  /**
   * Selector for custom resources to preload. Elements should include `data-weight` and `data-loaded` attributes.
   * Example: `data-weight="10"` for a weight of 10, `data-loaded="10"` when loaded.
   * @default '.js-preload'
   */
  customSelector?: string;

  /**
   * Class name for elements to exclude from preloading.
   * @default 'js-preload-ignore'
   */
  ignoreClassName?: string;

  /**
   * Linear interpolation factor for smooth progress updates. `1` disables interpolation for instant updates.
   * @default 0.1
   */
  lerp?: number;

  /**
   * Duration (ms) to complete the preloader if resources are loaded but progress < 1.
   * @default 500
   */
  endDuration?: number;
}

/**
 * Mutable properties for the progress preloader.
 */
export interface IProgressPreloaderMutableProps
  extends IPreloaderMutableProps {}

/**
 * Callback events for the progress preloader.
 */
export interface IProgressPreloaderCallbacksMap extends IPreloaderCallbacksMap {
  /**
   * Fired when the preloader's progress updates.
   */
  progress: undefined;

  /**
   * Fired each time a resource is loaded during preloading.
   */
  resource: IProgressPreloaderResource;
}

/**
 * Data structure for custom resources to preload.
 */
export interface IProgressPreloaderResource {
  /**
   * The custom resource identifier.
   */
  id: Element | string;

  /**
   * A resource may be split into multiple parts. This is the resource weight
   */
  weight: number;

  /**
   * Loaded weight
   */
  loaded: number;
}
