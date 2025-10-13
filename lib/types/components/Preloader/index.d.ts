import { TRequiredProps } from '../../internal/requiredProps';
import { IPreloaderCallbacksMap, IPreloaderMutableProps, IPreloaderStaticProps } from './types';
import { Module } from '../../base/Module';
export * from './types';
/**
 * Page preloader component that manages the visibility and lifecycle of a loading screen.
 * The module does not provide styling for the container.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Preloader)
 *
 * @group Components
 */
export declare class Preloader<CallbacksMap extends IPreloaderCallbacksMap = IPreloaderCallbacksMap, StaticProps extends IPreloaderStaticProps = IPreloaderStaticProps, MutableProps extends IPreloaderMutableProps = IPreloaderMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /**
     * Retrieves the default static properties.
     */
    _getStatic(): TRequiredProps<StaticProps>;
    /**
     * Retrieves the default mutable properties.
     */
    _getMutable(): TRequiredProps<MutableProps>;
    /** Indicates if the preloader is in the process of being hidden. */
    protected _shouldHide: boolean;
    /** Indicates if the preloader has already been hidden. */
    protected _isHidden: boolean;
    /** Indicates if the page is fully loaded. */
    protected _isLoaded: boolean;
    /**
     * Returns whether the preloader is currently hidden.
     */
    get isHidden(): boolean;
    constructor(props?: StaticProps & MutableProps);
    /**
     * Handles the page load event, triggering when the page is fully loaded.
     */
    protected _onLoaded(callback: () => void): void;
    /**
     * Handles the logic that occurs after the page is fully loaded.
     */
    protected _handleLoaded(): void;
    /**
     * Hides the preloader with a custom animation duration.
     *
     * @param duration - The duration of the hide animation (in milliseconds). Applies only when the container is used.
     * @param callback - The callback to execute when the hide animation is complete.
     *
     * @returns Returns an action destructor.
     */
    hide(duration: number, callback?: () => void): (() => void) | undefined;
    /**
     * Executes the hiding animation for the preloader container.
     */
    protected _hideContainer(onHidden: () => void, duration: number): void;
    /**
     * Handles actions when the preloader is fully hidden.
     */
    protected _onHidden(): void;
    /**
     * Registers a callback for when the preloader starts hiding.
     *
     * @param action - The callback function to execute.
     * @returns A destructor.
     */
    onHide(action: () => void): () => void;
    /**
     * Registers a callback for when the preloader is fully hidden.
     *
     * @param action - The callback function to execute.
     * @returns A destructor.
     */
    onHidden(action: () => void): () => void;
}
//# sourceMappingURL=index.d.ts.map