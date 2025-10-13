import { TRequiredProps } from '../../internal/requiredProps';
import { Module } from '../../base';
import { IScrollbarCallbacksMap, IScrollbarMutableProps, IScrollbarStaticProps } from './types';
import { ISwipeCoords } from '../Swipe';
export * from './types';
/**
 * A custom scrollbar component. Supports both `window` and `HTMLElement` containers.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Scrollbar)
 *
 * @group Components
 */
export declare class Scrollbar<CallbacksMap extends IScrollbarCallbacksMap = IScrollbarCallbacksMap, StaticProps extends IScrollbarStaticProps = IScrollbarStaticProps, MutableProps extends IScrollbarMutableProps = IScrollbarMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /** Get default static properties. */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Get default mutable properties. */
    _getMutable(): TRequiredProps<MutableProps>;
    get prefix(): string;
    /**
     * The element to which the scrollbar is applied.
     */
    get container(): Window | HTMLElement;
    /**
     * Scrollbar outer element.
     */
    protected _outer: HTMLElement;
    /**
     * Scrollbar outer element
     */
    get outer(): HTMLElement;
    /**
     * Scrollbar track element (the container of the thumb).
     */
    protected _track: HTMLElement;
    /**
     * Scrollbar track element (the container of the thumb).
     */
    get track(): HTMLElement;
    /**
     * Scrollbar thumb element (draggable handle).
     */
    protected _thumb: HTMLElement;
    /**
     * Scrollbar thumb element (draggable handle).
     */
    get thumb(): HTMLElement;
    /** Save scroll value on swipe start */
    protected _valueOnSwipeStart: number;
    /** Timeout for scroll action */
    protected _addInActionTimeout?: NodeJS.Timeout;
    /** Timeout for scroll action */
    protected _removeInActionTimeout?: NodeJS.Timeout;
    /** Previous scroll value */
    protected _prevScrollValue: number;
    constructor(props?: StaticProps & MutableProps);
    /** Handles property mutations */
    protected _handleProps(): void;
    /** Scroll axis */
    get axis(): "x" | "y";
    /**
     * The element where the scrollbar is appended.
     * If `parent` is not set, it defaults to `container` or `document.body` (if applied to `window`).
     */
    get parent(): HTMLElement;
    /**
     * The actual scrollable element.
     * Returns `document.documentElement` for `window`, otherwise the `container` itself.
     */
    get scrollElement(): HTMLElement;
    /**
     * Returns the total scroll width/height of the content.
     */
    get scrollSize(): number;
    /**
     * Returns the total scrollable distance.
     */
    get scrollableSize(): number;
    /**
     * Returns scrollTop or scrollLeft of the scrollable element.
     */
    get scrollValue(): number;
    /** Returns the current track size. */
    get trackSize(): number;
    /** Returns the current thumb size. */
    get thumbSize(): number;
    /** Create elements */
    protected _create(): void;
    /** Create outer element */
    protected _createOuter(): HTMLDivElement;
    /** Create track element */
    protected _createTrack(): HTMLDivElement;
    /** Create thumb element */
    protected _createThumb(): HTMLDivElement;
    /** Set resize events */
    protected _setResize(): void;
    /** Set scroll events */
    protected _setOnscroll(): void;
    /** Set swipe events */
    protected _setSwipe(): void;
    /** Resize the scrollbar. */
    resize(): void;
    /** Render the scrollbar. */
    protected _render(): void;
    /** Handle scroll update */
    protected _onScroll(): void;
    /** Handle swipe move */
    protected _onSwipeMove({ diff }: ISwipeCoords): void;
    /**
     * Destroys the component and cleans up resources.
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map