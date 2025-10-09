import { TRequiredProps } from '../../internal/requiredProps';
import { ICursorCallbacksMap, ICursorFullCoords, ICursorHoveredElement, ICursorMutableProps, ICursorStaticProps, ICursorType } from './types';
import { Module } from '../../base/Module';
import { Raf } from '../Raf';
export * from './types';
/**
 * A customizable custom cursor component with smooth animations and hover interactions.
 * Supports dynamic appearance changes and enhanced user interaction.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Cursor)
 *
 * @group Components
 */
export declare class Cursor<CallbacksMap extends ICursorCallbacksMap = ICursorCallbacksMap, StaticProps extends ICursorStaticProps = ICursorStaticProps, MutableProps extends ICursorMutableProps = ICursorMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /** Get default static properties */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Get default mutable properties */
    _getMutable(): TRequiredProps<MutableProps>;
    /**
     * Classname prefix for styling elements.
     */
    get prefix(): string;
    /** The cursor container */
    get container(): Element | Window;
    /** Returns the DOM parent for the cursor element. */
    get domContainer(): HTMLElement;
    /** The outer element of the custom cursor */
    protected _outer: HTMLElement;
    /**
     * The outer element of the custom cursor.
     * This is the visual element that represents the cursor on screen.
     */
    get outer(): HTMLElement;
    /** The inner element of the custom cursor. */
    protected _inner: HTMLElement;
    /**
     * The inner element of the custom cursor.
     * This element is nested inside the outer element and can provide additional styling.
     */
    get inner(): HTMLElement;
    /** The currently hovered element */
    protected _hoveredElement?: ICursorHoveredElement;
    /**
     * The currently hovered element.
     * Stores information about the element that the cursor is currently interacting with.
     */
    get hoveredElement(): ICursorHoveredElement | undefined;
    set hoveredElement(value: ICursorHoveredElement | undefined);
    /** Request animation frame handler */
    protected _raf: Raf;
    /** The current coordinates */
    protected _coords: ICursorFullCoords;
    /**
     * The current coordinates (x, y, width, height).
     * These are updated during cursor movement.
     */
    get coords(): ICursorFullCoords;
    /** Target coordinates of the cursor (without smooth interpolation). */
    protected _targetCoords: ICursorFullCoords;
    /** Target coordinates of the cursor (without smooth interpolation). */
    get targetCoords(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** Defines if the cursor has been moved after initialization */
    protected _isFirstMove: boolean;
    /** Cursor types */
    protected _types: ICursorType[];
    /** Active cursor types */
    protected _activeTypes: string[];
    constructor(props?: StaticProps & MutableProps);
    /** Creates the custom cursor and appends it to the DOM. */
    protected _createElements(): void;
    /** Sets up the various event listeners for the cursor, such as mouse movements and clicks. */
    protected _setEvents(): void;
    /** Handles property mutations */
    protected _handleProps(): void;
    /** Enables cursor animation. */
    protected _toggle(enabled: boolean): void;
    /** Handles mouse enter events. */
    protected _handleMouseEnter(evt: MouseEvent): void;
    /** Handles mouse leave events. */
    protected _handleMouseLeave(): void;
    /** Handles mouse move events. */
    protected _handleMouseMove(evt: MouseEvent): void;
    /** Handles mouse down events. */
    protected _handleMouseDown(evt: MouseEvent): void;
    /** Handles mouse up events. */
    protected _handleMouseUp(): void;
    /** Handles window blur events. */
    protected _handleWindowBlur(): void;
    /**
     * Registers an element to interact with the cursor, enabling dynamic size and position changes based on hover effects.
     * @param settings The settings for the hovered element.
     * @param {number} [enterTimeout=100] The timeout before the hover effect is applied.
     * @returns Returns a destructor
     */
    attachElement(settings: ICursorHoveredElement, enterTimeout?: number): () => void;
    /** Handle element enter */
    protected _handleElementEnter(data: ICursorHoveredElement): void;
    /** Handle element leave */
    protected _handleElementLeave(data: ICursorHoveredElement): void;
    /**
     * Registers a cursor type.
     */
    attachCursor({ element, type }: ICursorType): void;
    /** Enable or disable a cursor type */
    protected _toggleType(type: string, isEnabled: boolean): void;
    /**
     * Checks if all coordinates are interpolated.
     * @returns {boolean} True if all coordinates are interpolated, false otherwise.
     */
    protected get isInterpolated(): boolean;
    /** Renders the cursor. */
    render(): void;
    /** Recalculates current coordinates. */
    protected _calculate(): void;
    /**
     * Performs linear interpolation.
     * @param {number} current The current value.
     * @param {number} target The target value.
     * @returns {number} The interpolated value.
     */
    protected _lerp(current: number, target: number): number;
    /** Renders the cursor elements. */
    protected _renderElements(): void;
}
//# sourceMappingURL=index.d.ts.map