import { TRequiredProps } from '../../internal/requiredProps';
import { IMarqueeCallbacksMap, IMarqueeMutableProps, IMarqueeStaticProps } from './types';
import { Module } from '../../base/Module';
import { Raf } from '../Raf';
export * from './types';
/**
 * A custom marquee component that smoothly scrolls its child elements.
 *
 * This component is designed to loop elements horizontally within a container,
 * with support for customization such as speed, gap, pause on hover, and more.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Marquee)
 *
 * @group Components
 */
export declare class Marquee<CallbacksMap extends IMarqueeCallbacksMap = IMarqueeCallbacksMap, StaticProps extends IMarqueeStaticProps = IMarqueeStaticProps, MutableProps extends IMarqueeMutableProps = IMarqueeMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /** Get default static properties. */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Get default mutable properties. */
    _getMutable(): TRequiredProps<MutableProps>;
    /** Current container width */
    protected _width: number;
    /** Initial child nodes of the container */
    protected _initialNodes: ChildNode[];
    /** Array of marquee element nodes */
    protected _elements: HTMLElement[];
    /** Array of widths of each child element */
    protected _widths: number[];
    /** Total width of all elements in the marquee */
    protected _totalWidth: number;
    /** Total width of all elements in the marquee */
    get totalWidth(): number;
    /** Last setup handler for teardown */
    protected _lastSetup?: () => void;
    /** The current X coordinate of the marquee. */
    protected _x: number;
    /** The current X coordinate of the marquee. */
    get x(): number;
    set x(value: number);
    /** Raf instance */
    protected _raf: Raf;
    /** Intersection observer */
    protected _intersection?: IntersectionObserver;
    constructor(props?: StaticProps & MutableProps);
    /** Handles property changes  */
    protected _handleProps(): void;
    /** Initializes the marquee setup, including resizing and cloning elements */
    protected _setup(): void;
    /**
     * Wraps the first text node in the container in a span if no other elements exist.
     */
    protected _wrapTextNode(): void;
    /**
     * Adds necessary styles to a given element.
     */
    protected _applyNodeStyles(element: HTMLElement, isAbsolute: boolean): void;
    /** Resizes the marquee, recalculating element positions and cloning if necessary. */
    resize(): void;
    /** Renders the marquee, adjusting element positions. */
    render(step?: number): void;
    /**
     * Renders the marquee, calculating element positions based on the provided speed.
     */
    protected _render(step?: string | number): void;
    /**
     * Handle intersection observer
     */
    protected _handleIntersection(entries: IntersectionObserverEntry[]): void;
    /** Destroys the instance and cleans up resources */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map