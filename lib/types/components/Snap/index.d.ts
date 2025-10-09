import { Module } from '../../base';
import { Timeline } from '../Timeline';
import { ISnapCallbacksMap, ISnapMagnet, ISnapMutableProps, ISnapNexPrevArg, ISnapStaticProps, ISnapToSlideArg, ISnapTransitionArg } from './types';
import { TRequiredProps } from '../../internal/requiredProps';
import { Raf } from '../Raf';
import { IOnResize } from '../../utils';
import { SnapSlide } from './Slide';
import { SnapWheel } from './Wheel';
import { SnapSwipe } from './Swipe';
import { SnapTrack } from './Track';
import { SnapKeyboard } from './Keyboard';
export * from './types';
export * from './Slide';
/**
 * Snap/Carousel handler.
 * This class manages sliding progress with options like swipe, wheel interactions, and smooth transitions.
 *
 * Please not that the class does not apply any styles to the slides, it only handles the logic.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Snap)
 *
 * @group Components
 */
export declare class Snap<CallbacksMap extends ISnapCallbacksMap = ISnapCallbacksMap, StaticProps extends ISnapStaticProps = ISnapStaticProps, MutableProps extends ISnapMutableProps = ISnapMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /** Retrieves the default static properties. */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Retrieves the default mutable properties. */
    _getMutable(): TRequiredProps<MutableProps>;
    /** Animation frame for smooth animations */
    protected _raf: Raf;
    /** Wheel events */
    protected _wheel: SnapWheel;
    /** Swipe events */
    protected _swipe: SnapSwipe;
    /** Snap Track */
    protected _track: SnapTrack;
    /** Snap keyboard */
    protected _keyboard: SnapKeyboard;
    /** Container size */
    protected _domSize: number;
    /** All slides */
    protected _slides: SnapSlide[];
    /** Scrollable slides (which size is larger than the container) */
    protected _scrollableSlides: SnapSlide[];
    /** Timeline for smooth transitions */
    protected _timeline?: Timeline;
    /** Resize handler */
    protected _resizeHandler: IOnResize;
    /** Active slide index */
    protected _activeIndex: number;
    /** Target slide index */
    protected _targetIndex?: number;
    constructor(props?: StaticProps & MutableProps);
    /** Handles properties change */
    protected _handleProps(): void;
    /** Update slides list and attach them */
    protected _fetchSlides(): void;
    /** Request resize (handled with debounce timeout) */
    resize(isManual?: boolean): void;
    /** Resize the scene and reflow */
    protected _handleResize(): void;
    /** Get container */
    get container(): HTMLElement;
    /** Get events emitter */
    get eventsEmitter(): HTMLElement;
    /** Container size depending on direction (width or height) */
    get domSize(): number;
    /** All slides */
    get slides(): SnapSlide[];
    /** Scrollable slides (which size is larger than the container) */
    get scrollableSlides(): SnapSlide[];
    /** Active slide index */
    get activeIndex(): number;
    /** Active slide */
    get activeSlide(): SnapSlide;
    get isEmpty(): boolean;
    /** Get axis name depending on direction */
    get axis(): "x" | "y";
    /** Snap track */
    get track(): SnapTrack;
    /** If transition in progress */
    get isTransitioning(): boolean;
    /** If swipe in progress */
    get isSwiping(): boolean;
    /** Reflow: update static values of slides */
    protected _reflow(): void;
    /** Handle RAF update, interpolate track values */
    protected _handleRaf(): void;
    /** Render slides */
    render(frameDuration?: number): void;
    /** Update slides values */
    protected _updateSlidesCoords(): void;
    /** Get first slide size */
    get firstSlideSize(): number;
    /** Update slides progress */
    protected _updateSlidesProgress(): void;
    /** Get nearest magnet */
    protected get magnet(): ISnapMagnet | undefined;
    /** Get nearest magnet to the current position */
    getNearestMagnet(coord: number): ISnapMagnet | undefined;
    /** Cancel sticky behavior */
    cancelTransition(): void;
    /** Stick to the nearest magnet */
    stick(): void;
    /** Go to a definite coordinate */
    toCoord(coordinate: number, options?: ISnapTransitionArg): boolean;
    /** Go to a slide by index */
    toSlide(targetIndex: number, { direction, ...options }?: ISnapToSlideArg): boolean;
    /** Go to next slide */
    next({ skip, ...options }?: ISnapNexPrevArg): boolean;
    /** Go to previous slide */
    prev({ skip, ...options }?: ISnapNexPrevArg): boolean;
    /**
     * Destroys the component and clears all timeouts and resources.
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map