import { IScrollProgressBounds, IScrollProgressCallbacksMap, IScrollProgressMutableProps, IScrollProgressStaticProps } from './types';
import { Module } from '../../base';
import { TRequiredProps } from '../../internal/requiredProps';
export * from './types';
/**
 * `ScrollProgress` is a component that tracks the scroll progress of a specified section element.
 *
 * This component can be used for creating scroll-based animations such as parallax effects.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/ScrollProgress)
 *
 * @group Components
 */
export declare class ScrollProgress<CallbacksMap extends IScrollProgressCallbacksMap = IScrollProgressCallbacksMap, StaticProps extends IScrollProgressStaticProps = IScrollProgressStaticProps, MutableProps extends IScrollProgressMutableProps = IScrollProgressMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /** Retrieves the default static properties. */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Retrieves the default mutable properties. */
    _getMutable(): TRequiredProps<MutableProps>;
    /**
     * Returns the section element being tracked for scroll progress.
     */
    get section(): Element;
    /** Indicates whether the section is currently visible within the viewport or root element. */
    protected _isVisible: boolean;
    /** Indicates whether the section is currently visible within the viewport or root element. */
    get isVisible(): boolean;
    /** The bounds of the root element used for scroll calculations. */
    protected _rootBounds: IScrollProgressBounds;
    /** The bounds of the root element used for scroll calculations. */
    get rootBounds(): IScrollProgressBounds;
    /** The bounds of the section element relative to the root element. */
    protected _sectionBounds: IScrollProgressBounds;
    /** The bounds of the section element relative to the root element. */
    get sectionBounds(): IScrollProgressBounds;
    constructor(props?: StaticProps & MutableProps);
    /** Sets up events */
    protected _setup(): void;
    /**
     * Sets up an `IntersectionObserver` to track the visibility of the section.
     */
    protected _setupObserver(): void;
    /**
     * Sets up a scroll event listener to track and update progress.
     */
    protected _setupScroll(): void;
    /** Updates the section and root bounds, and emits an update callback. */
    update(): void;
    /**
     * Calculates the section scroll progress relative to the root element.
     *
     * The function takes top or left corner of the section as the reference point.
     *
     * @param topThreshold - Top threshold of the section position.
     * @param rightThreshold - Right threshold of the section position.
     * @param bottomThreshold - Bottom threshold of the section position.
     * @param leftThreshold - Left threshold of the section position.
     * @returns The scroll progress along the x and y axes.
     *
     * @example
     *
     * const progress = getProgress(0, vevet.width, vevet.height / 2, 0)
     *
     * // `progress.y` is `0` when the top corner of the section is at the beginning of the viewport or root element
     * // `progress.y` is `1` when the top corner of the section is at the center of the viewport or root element
     */
    getProgress(topThreshold: number, rightThreshold: number, bottomThreshold: number, leftThreshold: number): {
        x: number;
        y: number;
    };
    /** Calculates the progress of the section entering the root element. */
    get inProgress(): {
        x: number;
        y: number;
    };
    /** Calculates the progress of the section leaving the root element. */
    get outProgress(): {
        x: number;
        y: number;
    };
    /** Calculates the progress of the section's movement within the root element. */
    get moveProgress(): {
        x: number;
        y: number;
    };
    /** Calculates the global scroll progress of the section relative to the root element. */
    get progress(): {
        x: number;
        y: number;
    };
}
//# sourceMappingURL=index.d.ts.map