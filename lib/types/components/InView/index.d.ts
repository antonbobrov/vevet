import { TRequiredProps } from '../../internal/requiredProps';
import { IInViewCallbacksMap, IInViewElement, IInViewMutableProps, IInViewStaticProps } from './types';
import { Module } from '../../base/Module';
export * from './types';
/**
 * InView is a visibility detection utility that leverages the `IntersectionObserver` API to monitor when elements enter or leave the viewport.
 * It provides customizable options for triggering events, delaying visibility changes, and dynamically adding CSS classes to elements based on their visibility state.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/InView)
 *
 * @group Components
 */
export declare class InView<CallbacksMap extends IInViewCallbacksMap = IInViewCallbacksMap, StaticProps extends IInViewStaticProps = IInViewStaticProps, MutableProps extends IInViewMutableProps = IInViewMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /**
     * Returns default static properties.
     */
    _getStatic(): TRequiredProps<StaticProps>;
    /**
     * Returns default mutable properties.
     */
    _getMutable(): TRequiredProps<MutableProps>;
    /** Intersection observer for detecting elements entering the viewport. */
    protected _observerIn?: IntersectionObserver;
    /** Intersection observer for detecting elements leaving the viewport. */
    protected _observerOut?: IntersectionObserver;
    /** Tracks whether this is the first time the elements are being observed. */
    protected _isInitialStart: boolean;
    /**
     * Indicates whether the observation has started for the first time.
     */
    get isInitialStart(): boolean;
    /** Stores the elements being observed. */
    protected _elements: IInViewElement[];
    /**
     * Returns all elements currently being observed.
     */
    get elements(): IInViewElement[];
    /**
     * Initializes the `InView` module.
     */
    constructor(props?: StaticProps & MutableProps);
    /**
     * Handles property mutations and updates observation events accordingly.
     */
    protected _handleProps(): void;
    /**
     * Configures or reconfigures the view observation events.
     */
    protected _setup(): void;
    /**
     * Removes all observation events and disconnects observers.
     */
    protected _removeViewEvents(): void;
    /**
     * Sets up `IntersectionObserver` instances to detect visibility changes.
     */
    protected _setViewEvents(): void;
    /**
     * Handles elements entering the viewport.
     */
    protected _handleIn(data: IntersectionObserverEntry[]): void;
    /**
     * Handles elements leaving the viewport.
     */
    protected _handleOut(data: IntersectionObserverEntry[]): void;
    /**
     * Toggles visibility classes and emits events for visibility changes.
     */
    protected _handleInOut(element: IInViewElement, isInView: boolean): void;
    /**
     * Calculates the delay before triggering an element's visibility event.
     */
    protected _getElementDelay(element: IInViewElement): number;
    /**
     * Registers an element for visibility observation.
     *
     * If the element has a `data-in-view-class` attribute, the specified class will be applied upon entering the viewport.
     *
     * @returns A function to stop observing the element.
     */
    addElement(element: Element): () => void;
    /**
     * Removes an element from observation, preventing further visibility tracking.
     */
    removeElement(element: Element): void;
    /**
     * Cleans up the module and disconnects all observers and listeners.
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map