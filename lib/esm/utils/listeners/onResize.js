import { initVevet } from '../../global/initVevet';
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
export function onResize({ callback, element, viewportTarget = 'width', resizeDebounce = 0, name, }) {
    const core = initVevet();
    let timeout;
    let resizeObserver;
    let isFirstObserverCallback = true;
    let viewportCallback;
    const debounceResize = (delay) => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(() => callback(), delay !== null && delay !== void 0 ? delay : resizeDebounce);
    };
    // Initialize ResizeObserver if element is provided
    if (element) {
        resizeObserver = new ResizeObserver(() => {
            if (isFirstObserverCallback) {
                isFirstObserverCallback = false;
                return;
            }
            debounceResize(core.props.resizeDebounce + resizeDebounce);
        });
        (Array.isArray(element) ? element : [element]).forEach((el) => {
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.observe(el);
        });
    }
    // Attach viewport event listeners if specified
    if (viewportTarget) {
        viewportCallback = core.onResize(viewportTarget, () => debounceResize(), {
            name,
        });
    }
    return {
        remove: () => {
            if (timeout) {
                clearTimeout(timeout);
            }
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
            viewportCallback === null || viewportCallback === void 0 ? void 0 : viewportCallback();
        },
        resize: () => callback(),
        debounceResize: () => debounceResize(),
    };
}
//# sourceMappingURL=onResize.js.map