import { IViewportCallbacksMap } from '../../core/exported';
export type TOnResizeCallback = () => void;
export interface IOnResizeProps {
    /**
     * Callback to invoke on resize.
     */
    callback: TOnResizeCallback;
    /**
     * Elements to observe for size changes. If null, only viewport events are used.
     */
    element?: Element | Element[] | null;
    /**
     * Target viewport property for resize events (enables viewport listeners).
     * @default 'width'
     */
    viewportTarget?: keyof IViewportCallbacksMap;
    /**
     * Debounce delay (ms) for resize events.
     * @default 0
     */
    resizeDebounce?: number;
    /** Viewport callback name. Used for debugging */
    name?: string;
}
export interface IOnResize {
    /**
     * Remove all resize listeners.
     */
    remove: () => void;
    /**
     * Trigger the resize callback immediately.
     */
    resize: () => void;
    /**
     * Trigger the resize callback with `resizeDebounce` delay.
     */
    debounceResize: () => void;
}
/**
 * Adds resize listeners to elements (using `ResizeObserver`) and/or the viewport.
 *
 * @group Utils
 *
 * @example
 * const resizeWithElement = onResize({
 *   callback: () => console.log('Element resized'),
 *   element: document.getElementById('app'),
 * });
 *
 * const resizeWithViewport = onResize({
 *   callback: () => console.log('Viewport resized'),
 *   viewportTarget: 'width',
 * });
 *
 * const resizeWithBoth = onResize({
 *   callback: () => console.log('Both resized'),
 *   element: document.getElementById('app'),
 *   viewportTarget: 'any',
 * });
 */
export declare function onResize({ callback, element, viewportTarget, resizeDebounce, name, }: IOnResizeProps): IOnResize;
//# sourceMappingURL=onResize.d.ts.map