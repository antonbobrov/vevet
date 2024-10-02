import { NPreloader } from '../Preloader';

export namespace NProgressPreloader {
  export interface IStaticProps extends NPreloader.IStaticProps {
    /**
     * The default number of resources to preload. This can be incremented using custom logic.
     * @default 0
     */
    resourcesQuantity?: number;

    /**
     * Whether to preload images automatically.
     * @default true
     */
    canPreloadImages?: boolean;

    /**
     * Whether to preload videos automatically.
     * @default false
     */
    canPreloadVideos?: boolean;

    /**
     * The selector for custom resources to be preloaded. These elements should have properties such as `isLoaded`, `isComplete`, or the attribute `data-is-loaded` (from 0 to 1 or a boolean) for tracking loading status.
     * Custom elements may also use the `data-load-count` attribute to indicate their weight.
     *
     * @default '.js-preload'
     */
    preloadCustomSelector?: string;

    /**
     * A class name that can be added to elements (such as images, videos, or custom resources) that should be ignored during the preload process.
     * @default 'js-preload-ignore'
     */
    preloadIgnoreClassName?: string;

    /**
     * The amount of linear interpolation to apply to the loading progress. If set to `false`, no interpolation will be used, and the progress will update instantly.
     * @default 0.1
     */
    lerp?: number | false;

    /**
     * If `true` and the animated progress is less than `1`, a timeline will automatically complete the progress when nearing the end. If `false`, progress will continue using linear interpolation until it completes.
     * @default 500
     */
    forceEnd?: number | false;
  }

  export interface IChangeableProps extends NPreloader.IChangeableProps {}

  export interface ICallbacksTypes extends NPreloader.ICallbacksTypes {
    /**
     * Triggered when the preloader's progress is updated.
     */
    progress: IProgressParameter;

    /**
     * Triggered each time a resource is loaded during the preload process.
     */
    resourceLoad: IResourceLoadParameter;
  }

  export interface IProgressParameter {
    /**
     * The current preloader progress (between 0 and 1).
     */
    progress: number;

    /**
     * The current progress based on loaded resources (between 0 and 1).
     */
    loadProgress: number;
  }

  export interface IResourceLoadParameter {
    /**
     * The resource element that was loaded, if applicable.
     */
    element?: Element;

    /**
     * The progress value when the resource was loaded.
     */
    atProgress: number;

    /**
     * The overall load progress when this resource was loaded.
     */
    loadProgress: number;

    /**
     * Whether the resource was successfully loaded.
     */
    isSuccess: boolean;
  }

  export interface IHandleLoadedResourceParameter {
    /**
     * The resource element that was loaded, if applicable.
     */
    element?: Element;

    /**
     * Whether the resource was successfully loaded.
     */
    isSuccess: boolean;
  }

  export interface ICustomResource extends Element {
    /**
     * Indicates whether the custom resource has been fully loaded. Can be a boolean or a number representing the loading progress.
     */
    isLoaded?: boolean | number;

    /**
     * Indicates whether the custom resource is complete. Can be a boolean or a number representing the loading progress.
     */
    isComplete?: boolean | number;
  }

  export interface ICustomResourceData {
    /**
     * The custom resource element to be preloaded.
     */
    element: ICustomResource;

    /**
     * The target progress value (between 0 and 1) for this resource, based on its `data-load-count` attribute.
     */
    targetProgress: number;
  }
}
