"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPageLoad = createPageLoad;
var Callbacks_1 = require("../../../base/Callbacks");
var listeners_1 = require("../../../utils/listeners");
function createPageLoad(_a) {
    var prefix = _a.prefix, applyClassNames = _a.applyClassNames;
    var callbacks = new Callbacks_1.Callbacks();
    var isLoaded = false;
    if (document.readyState === 'complete') {
        setTimeout(function () { return handleLoaded(); }, 0);
    }
    else {
        (0, listeners_1.addEventListener)(window, 'load', function () { return handleLoaded(); });
    }
    /** Callback on page loaded */
    function handleLoaded() {
        var html = document.documentElement;
        var body = document.body;
        isLoaded = true;
        if (applyClassNames) {
            html.classList.remove("".concat(prefix, "loading"));
            body.classList.remove("".concat(prefix, "loading"));
            html.classList.add("".concat(prefix, "loaded"));
        }
        callbacks.emit('loaded', undefined);
    }
    /** Add a callback on page load */
    function onLoad(callback) {
        if (isLoaded) {
            callback();
            return function () { };
        }
        return callbacks.on('loaded', function () { return callback(); });
    }
    return { onLoad: onLoad, getIsLoaded: function () { return isLoaded; } };
}
//# sourceMappingURL=index.js.map