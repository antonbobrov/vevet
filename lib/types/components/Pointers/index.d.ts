import { Module } from '../../base';
import { IPointersCallbacksMap, IPointersItem, IPointersMutableProps, IPointersStaticProps } from './types';
import { TRequiredProps } from '../../internal/requiredProps';
export * from './types';
/**
 * Manages pointer events, including tracking multiple pointers,
 * and emitting callbacks for pointer interactions.
 *
 * For proper functionality, ensure the container has an appropriate
 * [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) property.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Pointers)
 *
 * @group Components
 */
export declare class Pointers<CallbacksMap extends IPointersCallbacksMap = IPointersCallbacksMap, StaticProps extends IPointersStaticProps = IPointersStaticProps, MutableProps extends IPointersMutableProps = IPointersMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /**
     * Returns the default static properties.
     */
    _getStatic(): TRequiredProps<StaticProps>;
    /**
     * Returns the default mutable properties.
     */
    _getMutable(): TRequiredProps<MutableProps>;
    /**
     * Stores active event listeners for runtime interactions.
     */
    protected _listeners: (() => void)[];
    /** Indicates whether the `start` event has been triggered. */
    protected _isStarted: boolean;
    /** Indicates whether the `start` event has been triggered. */
    get isStarted(): boolean;
    /** Map of active pointers. */
    protected _pointersMap: Map<number, IPointersItem>;
    /** Returns the map of active pointers. */
    get pointersMap(): Map<number, IPointersItem>;
    /** Returns the container element handling events. */
    get container(): HTMLElement | SVGElement;
    /** Returns the minimum number of pointers required to trigger events. */
    get minPointers(): number;
    /** Returns the maximum number of pointers that can be tracked. */
    get maxPointers(): number;
    constructor(props?: StaticProps & MutableProps);
    /**
     * Attaches base event listeners to the container.
     */
    protected _setBaseEvents(): void;
    /**
     * Attaches runtime event listeners for active pointer interactions.
     */
    protected _setRuntimeEvents(): void;
    /**
     * Handles pointer down events (`pointerdown`).
     * Adds a new pointer if conditions are met and triggers the `pointerdown` callback.
     */
    protected _handlePointerDown(event: PointerEvent): void;
    /**
     * Handles pointer movement (`pointermove`).
     * Updates pointer positions and triggers the `pointermove` callback.
     */
    protected _handlePointerMove(event: PointerEvent): void;
    /**
     * Handles pointer release (`pointerup`).
     * Removes the pointer and triggers the `pointerup` callback.
     * If no active pointers remain, fires the `end` callback.
     */
    protected _handlePointerUp(event: PointerEvent): void;
    /**
     * Handles event cancellations (`pointercancel`, `blur`).
     * Triggers the `end` callback and cleans up all pointers.
     */
    protected _handleCancel(): void;
    /**
     * Prevents text selection during pointer interactions.
     */
    protected _resetSelection(): void;
    /**
     * Returns pointer coordinates relative to the container.
     */
    protected _decodeCoords(event: PointerEvent): {
        x: number;
        y: number;
    };
    /**
     * Cleans up event listeners, pointers, and injected styles.
     */
    protected _cleanup(): void;
    /**
     * Destroys the component and removes all event listeners.
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map