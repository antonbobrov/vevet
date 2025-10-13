"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadCustomElement = preloadCustomElement;
var math_1 = require("../../../utils/math");
/**
 * Retrieves the load progress of a custom resource element based on its attributes.
 */
function getLoaded(element) {
    var loaded = parseFloat(element.getAttribute('data-loaded') || '0');
    loaded = Number.isNaN(loaded) ? 0 : (0, math_1.clamp)(loaded, 0, Infinity);
    return loaded;
}
/**
 * Preloads a custom resource element by recursively checking its load progress until the target progress is reached.
 */
function preloadCustomElement(_a, onLoad) {
    var id = _a.id, weight = _a.weight;
    if (!(id instanceof Element)) {
        return;
    }
    // If the load progress has reached or exceeded the target, resolve the promise
    if (getLoaded(id) >= weight) {
        onLoad(weight);
        return;
    }
    // Set up a mutation observer to monitor changes in the 'data-loaded' attribute
    var observer = new MutationObserver(function () {
        var loaded = getLoaded(id);
        onLoad(loaded);
        if (loaded >= weight) {
            observer.disconnect();
        }
    });
    observer.observe(id, {
        attributes: true,
        attributeFilter: ['data-loaded'],
    });
}
//# sourceMappingURL=preloadCustomElement.js.map