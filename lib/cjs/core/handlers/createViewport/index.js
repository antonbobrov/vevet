"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViewport = createViewport;
var Callbacks_1 = require("../../../base/Callbacks");
var listeners_1 = require("../../../utils/listeners");
function createViewport(_a) {
    var prefix = _a.prefix, props = _a.props, isMobile = _a.isMobile;
    var html = document.documentElement;
    var styles = document.getElementById('vevet_css_preset');
    if (!styles) {
        styles = document.createElement('style');
        styles.id = 'vevet_css_preset';
        document.body.appendChild(styles);
    }
    var mqDesktop = window.matchMedia("(min-width: ".concat(props.md + 0.001, "px)"));
    var mqTablet = window.matchMedia("(min-width: ".concat(props.sm + 0.001, "px) and (max-width: ").concat(props.md, "px)"));
    var mqPhone = window.matchMedia("(max-width: ".concat(props.sm, "px)"));
    // create callbacks
    var callbacks = new Callbacks_1.Callbacks();
    // default data
    var data = {
        width: 0,
        height: 0,
        sHeight: 0,
        vw: 0,
        vh: 0,
        svh: 0,
        scrollbarWidth: 0,
        rem: 16,
        landscape: false,
        portrait: false,
        dpr: window.devicePixelRatio,
        lowerDpr: window.devicePixelRatio,
        sm: true,
        md: false,
        lg: false,
    };
    // update values for the first time
    updateValues();
    updateClassNames();
    updateCSSVars();
    // add resize events
    var debounce;
    function debounceResize() {
        if (debounce) {
            clearTimeout(debounce);
            debounce = undefined;
        }
        if (props.resizeDebounce) {
            debounce = setTimeout(function () { return onResize(); }, props.resizeDebounce);
        }
        else {
            onResize();
        }
    }
    (0, listeners_1.addEventListener)(window, 'resize', function () { return debounceResize(); });
    var observer = new ResizeObserver(function () { return debounceResize(); });
    observer.observe(document.documentElement);
    observer.observe(document.body);
    /** Event on window resize */
    function onResize() {
        var prevWidth = data.width, prevHeight = data.height;
        updateValues();
        updateClassNames();
        updateCSSVars();
        var width = data.width, height = data.height;
        callbacks.emit('trigger', undefined);
        if (width !== prevWidth || height !== prevHeight) {
            callbacks.emit('any', undefined);
        }
        if (width !== prevWidth && height === prevHeight) {
            callbacks.emit('onlyWidth', undefined);
        }
        if (height !== prevHeight && width === prevWidth) {
            callbacks.emit('onlyHeight', undefined);
        }
        if (width !== prevWidth && height !== prevHeight) {
            callbacks.emit('both', undefined);
        }
        if (width !== prevWidth) {
            callbacks.emit('width', undefined);
        }
        if (height !== prevHeight) {
            callbacks.emit('height', undefined);
        }
    }
    /** Update viewport values */
    function updateValues() {
        var prevWidth = data.width;
        var root = document.documentElement;
        var rootStyles = getComputedStyle(root);
        data.width = window.innerWidth;
        data.height = window.innerHeight;
        data.scrollbarWidth = window.innerWidth - root.clientWidth;
        data.vw = data.width / 100;
        data.vh = data.height / 100;
        data.rem = parseFloat(rootStyles.fontSize);
        data.landscape = data.width > data.height;
        data.portrait = data.width < data.height;
        data.dpr = window.devicePixelRatio;
        data.lowerDpr = !isMobile ? 1 : Math.min(data.dpr, 2);
        data.sm = false;
        data.md = false;
        data.lg = false;
        if (mqPhone.matches) {
            data.sm = true;
        }
        else if (mqTablet.matches) {
            data.md = true;
        }
        else if (mqDesktop.matches) {
            data.lg = true;
        }
        // update sHeight && svh only when the width changes
        // or for desktop
        if (prevWidth !== data.width || !data.sHeight || !isMobile) {
            data.sHeight = root.clientHeight;
            data.svh = data.sHeight / 100;
        }
    }
    /** Update page classnames according to the viewport data */
    function updateClassNames() {
        if (!props.applyClassNames) {
            return;
        }
        html.classList.toggle("".concat(prefix, "lg"), data.lg);
        html.classList.toggle("".concat(prefix, "md"), data.md);
        html.classList.toggle("".concat(prefix, "sm"), data.sm);
        html.classList.toggle("".concat(prefix, "landscape"), data.landscape);
        html.classList.toggle("".concat(prefix, "portrait"), data.portrait);
    }
    /** Update CSS variables */
    function updateCSSVars() {
        styles.innerHTML = "\n      html {\n        --vw: ".concat(data.vw, "px;\n        --vh: ").concat(data.vh, "px;\n        --svh: ").concat(data.svh, "px;\n        --scrollbar-width: ").concat(data.scrollbarWidth, "px;\n      }\n    ");
    }
    return { data: data, callbacks: callbacks };
}
//# sourceMappingURL=index.js.map