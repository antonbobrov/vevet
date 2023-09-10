import { NPreloader } from '../Preloader';

export namespace NProgressPreloader {
  export interface IStaticProps extends NPreloader.IStaticProps {
    /**
     * Default resources quantity
     * @default 0
     */
    resourcesQuantity?: number;
    /**
     * Preload images
     * @default true
     */
    canPreloadImages?: boolean;
    /**
     * Preload videos
     * @default false
     */
    canPreloadVideos?: boolean;
    /**
     * Preload custom resources by selector
     * These elements should have such properties as `isLoaded` or `isComplete` (all boolean or float - from 0 to 1)
     * or the attribute `data-is-loaded` (string with float or non-empty string for true).
     * Custom elements may also have the attribute `data-load-count` (number) which means the element weight.
     * @default '.js-preload'
     */
    preloadCustomSelector?: string;
    /**
     * If you enable images, video, or custom loaders,
     * all these resources will be preloaded. In cases when you may want not
     * to preload some resources, you may add to it the classname specified here.
     * @default 'js-preload-ignore'
     */
    preloadIgnoreClassName?: string;
    /**
     * Linear interpolation. If `false`, animation will not be used.
     * @default 0.1
     */
    lerp?: number | false;
    /**
     * If `true` and `lerp` is less than `1`, interpolation will be stopped
     * and a `Timeline` will be launched to end the progress calculation.
     * If `false`, the progress smooth calculation will end via linear interpolation.
     * @default 500
     */
    forceEnd?: number | false;
  }

  export interface IChangeableProps extends NPreloader.IChangeableProps {}

  export interface ICallbacksTypes extends NPreloader.ICallbacksTypes {
    progress: IProgressParameter;
    resourceLoad: IResourceLoadParameter;
  }

  export interface IProgressParameter {
    progress: number;
    loadProgress: number;
  }

  export interface IResourceLoadParameter {
    element?: Element;
    atProgress: number;
    loadProgress: number;
    isSuccess: boolean;
  }

  export interface IHandleLoadedResourceParameter {
    element?: Element;
    isSuccess: boolean;
  }

  export interface ICustomResource extends Element {
    isLoaded?: boolean | number;
    isComplete?: boolean | number;
  }

  export interface ICustomResourceData {
    element: ICustomResource;
    targetProgress: number;
  }
}
