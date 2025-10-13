"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onResize = onResize;
var initVevet_1 = require("../../global/initVevet");
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
function onResize(_a) {
    var callback = _a.callback, element = _a.element, _b = _a.viewportTarget, viewportTarget = _b === void 0 ? 'width' : _b, _c = _a.resizeDebounce, resizeDebounce = _c === void 0 ? 0 : _c, name = _a.name;
    var core = (0, initVevet_1.initVevet)();
    var timeout;
    var resizeObserver;
    var isFirstObserverCallback = true;
    var viewportCallback;
    var debounceResize = function (delay) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(function () { return callback(); }, delay !== null && delay !== void 0 ? delay : resizeDebounce);
    };
    // Initialize ResizeObserver if element is provided
    if (element) {
        resizeObserver = new ResizeObserver(function () {
            if (isFirstObserverCallback) {
                isFirstObserverCallback = false;
                return;
            }
            debounceResize(core.props.resizeDebounce + resizeDebounce);
        });
        (Array.isArray(element) ? element : [element]).forEach(function (el) {
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.observe(el);
        });
    }
    // Attach viewport event listeners if specified
    if (viewportTarget) {
        viewportCallback = core.onResize(viewportTarget, function () { return debounceResize(); }, {
            name: name,
        });
    }
    return {
        remove: function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
            viewportCallback === null || viewportCallback === void 0 ? void 0 : viewportCallback();
        },
        resize: function () { return callback(); },
        debounceResize: function () { return debounceResize(); },
    };
}
//# sourceMappingURL=onResize.js.map