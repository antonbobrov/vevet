import { IModuleCallbacksMap, IModuleMutableProps, IModuleStaticProps } from '../../base/Module';
/**
 * Static properties for the Preloader module.
 */
export interface IPreloaderStaticProps extends IModuleStaticProps {
    /**
     * The container for the preloader. Set it to `null` if you only need the preloader logic.
     */
    container: HTMLElement | null;
    /**
     * Defines whether to automatically hide the preloader container.
     * - `false`: Disables the hiding animation, allowing you to manage it manually.
     * - `number`: Specifies the animation duration in milliseconds.
     *   This works only if the container is an HTML element.
     *
     * @default 250
     */
    hide?: false | number;
}
/**
 * Mutable properties for the Preloader module.
 */
export interface IPreloaderMutableProps extends IModuleMutableProps {
}
/**
 * Callbacks map for the Preloader module.
 */
export interface IPreloaderCallbacksMap extends IModuleCallbacksMap {
    /**
     * Triggered when the page is fully loaded.
     */
    loaded: undefined;
    /**
     * Triggered when the preloader starts hiding.
     */
    hide: undefined;
    /**
     * Triggered when the preloader is completely hidden.
     */
    hidden: undefined;
}
//# sourceMappingURL=types.d.ts.map