import { TRequiredProps } from '../../internal/requiredProps';
import { IProgressPreloaderCallbacksMap, IProgressPreloaderResource, IProgressPreloaderMutableProps, IProgressPreloaderStaticProps } from './types';
import { Preloader } from '../Preloader';
import { Raf } from '../Raf';
export * from './types';
/**
 * Page preloader for calculating and displaying the loading progress of resources (images, videos, custom elements).
 * Provides smooth progress transitions.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/ProgressPreloader)
 *
 * @group Components
 */
export declare class ProgressPreloader<CallbacksMap extends IProgressPreloaderCallbacksMap = IProgressPreloaderCallbacksMap, StaticProps extends IProgressPreloaderStaticProps = IProgressPreloaderStaticProps, MutableProps extends IProgressPreloaderMutableProps = IProgressPreloaderMutableProps> extends Preloader<CallbacksMap, StaticProps, MutableProps> {
    /**
     * Retrieves the default static properties.
     */
    _getStatic(): TRequiredProps<StaticProps>;
    /**
     * Retrieves the default mutable properties.
     */
    _getMutable(): TRequiredProps<MutableProps>;
    /**
     * List of custom resources to preload based on selectors.
     */
    protected _resources: IProgressPreloaderResource[];
    /**
     * The list of custom resources to preload.
     */
    get resources(): IProgressPreloaderResource[];
    /**
     * Calculates the total number of resources to preload, including their weight.
     */
    get totalWeight(): number;
    /**
     * Loaded weight
     */
    get loadedWeight(): number;
    /**
     * Current loading progress (0 to 1).
     */
    get loadProgress(): number;
    /**
     * Current interpolated progress value for smooth transitions.
     */
    protected _progress: number;
    /**
     * Gets the current progress value.
     */
    get progress(): number;
    /** Animation frame instance for managing smooth progress updates. */
    protected _raf: Raf;
    constructor(props?: StaticProps & MutableProps);
    /** Preload images */
    protected _fetchImages(): void;
    /** Preload videos */
    protected _fetchVideos(): void;
    /** Preload custom resources */
    protected _fetchResources(): void;
    /**
     * Adds a custom resource
     * @param id - The custom resource element or identifier to preload.
     * @param weight - The resource weight
     */
    addResource(id: Element | string, weight?: number): void;
    /**
     * Emits a resource load event and updates the count of loaded resources.
     * @param id - The resource element or identifier being loaded.
     */
    resolveResource(id: Element | string, loadedWeight?: number): void;
    /**
     * Handles updates to the preloader's progress, triggering events and animations as needed.
     * @param newProgress - The updated progress value.
     */
    protected _handleUpdate(newProgress: number): void;
    /**
     * Resolves when the page and all resources are fully loaded.
     */
    protected _onLoaded(callback: () => void): void;
    /**
     * Cleans up resources and destroys the preloader instance.
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map