import { IOnResize } from '../../../utils';
import { Snap } from '..';
import { ISnapSlideProps } from './types';
export declare class SnapSlide {
    protected _element: HTMLElement | null;
    constructor(_element: HTMLElement | null, initProps?: ISnapSlideProps);
    /** Slide element */
    get element(): HTMLElement | null;
    /** Slide props */
    protected _props: Required<ISnapSlideProps>;
    /** Slide properties */
    get props(): Required<ISnapSlideProps>;
    /** Slide id */
    protected _id: string;
    /** Slide id */
    get id(): string;
    /** Slide index */
    protected _index: number;
    /** Slide index */
    get index(): number;
    /** Snap component */
    protected _snap?: Snap;
    /** Snap component */
    protected get snap(): Snap<import("..").ISnapCallbacksMap, import("..").ISnapStaticProps, import("..").ISnapMutableProps> | undefined;
    /** Events on slide resize */
    protected _onResize?: IOnResize;
    /** Size of the element */
    protected _domSize: undefined | number;
    /** Current coordinate */
    protected _coord: number;
    /** If the slide is appended */
    protected _isAppended: boolean;
    /** If the slide is visible */
    protected _isVisible: boolean;
    /** Static coordinate (as if the slide was never moved) */
    protected _staticCoord: number;
    /** Current progress of slide movement: from -1 to 1 */
    protected _progress: number;
    /** Current coordinate */
    get coord(): number;
    /** Current coordinate. Do not update it manually! */
    setCoord(value: number): void;
    /** Static coordinate (as if the slide was never moved) */
    get staticCoord(): number;
    /** Static coordinate (as if the slide was never moved). Do not update it manually! Alignment: start */
    setStaticCoord(value: number): void;
    /** Current progress of slide movement: from -1 to 1 */
    get progress(): number;
    /** Current progress of slide movement: from -1 to 1. Do not update it manually! */
    setProgress(value: number): void;
    /** Size property */
    get sizeProp(): string | number;
    /** Slide size in pixels */
    get size(): number;
    /** Check if the slide is visible */
    get isVisible(): boolean;
    /** Resize the slide & trigger snap reflow */
    resize(isManual?: boolean): void;
    /** Attach the slide to the Snap class */
    attach(snap: Snap, index: number): void;
    /** Detach the slide from the Snap class */
    detach(): void;
    /** Render the slide */
    render(): void;
    /** Toggle slide append/remove */
    protected _toggleAppend(): void;
    /** Get magnets with static coordinates but dynamic alignment */
    get magnets(): number[];
}
//# sourceMappingURL=index.d.ts.map