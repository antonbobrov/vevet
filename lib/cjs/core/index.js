"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = Core;
var detect_browser_1 = require("detect-browser");
var ismobilejs_1 = __importDefault(require("ismobilejs"));
var manifest_json_1 = __importDefault(require("../manifest.json"));
var createPageLoad_1 = require("./handlers/createPageLoad");
var createViewport_1 = require("./handlers/createViewport");
function Core(input) {
    // set default properties
    var _a;
    var defaultProps = {
        md: 1199,
        sm: 999,
        resizeDebounce: 0,
        easing: [0.25, 0.1, 0.25, 1],
        applyClassNames: false,
    };
    var props = __assign(__assign({}, defaultProps), input);
    var prefix = 'v-';
    // device info
    var browserData = (0, detect_browser_1.detect)();
    var device = (0, ismobilejs_1.default)();
    var osName = (_a = ((browserData === null || browserData === void 0 ? void 0 : browserData.os) || '')) === null || _a === void 0 ? void 0 : _a.split(' ')[0].toLowerCase();
    var browserName = ((browserData === null || browserData === void 0 ? void 0 : browserData.name) || '').toLowerCase();
    var isMobile = device.phone || device.tablet;
    // events
    var pageLoad = (0, createPageLoad_1.createPageLoad)({
        prefix: prefix,
        applyClassNames: props.applyClassNames,
    });
    var viewport = (0, createViewport_1.createViewport)({ prefix: prefix, props: props, isMobile: isMobile });
    // output
    var output = __assign(__assign({}, viewport.data), { viewportCallbacks: viewport.callbacks, version: manifest_json_1.default.version, props: props, prefix: prefix, phone: device.phone, tablet: device.tablet, mobile: isMobile, osName: osName, browserName: browserName, doc: document, html: document.documentElement, body: document.body, loaded: false, onLoad: pageLoad.onLoad, onResize: function () {
            var _a;
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return (_a = viewport.callbacks).on.apply(_a, params);
        } });
    // update props on page load
    pageLoad.onLoad(function () {
        output.loaded = true;
    });
    // update props on viewport change
    viewport.callbacks.add('trigger', function () {
        var keys = Object.keys(viewport.data);
        keys.forEach(function (key) {
            // @ts-ignore
            output[key] = viewport.data[key];
        });
    }, { protected: true, name: 'vevet core' });
    // set device features
    (function setDeviceFeatures() {
        if (!props.applyClassNames) {
            return;
        }
        var html = output.html;
        html.classList.add("".concat(prefix, "os-").concat(osName));
        html.classList.add("".concat(prefix, "browser-").concat(browserName));
        html.classList.toggle("".concat(prefix, "phone"), output.phone);
        html.classList.toggle("".concat(prefix, "tablet"), output.tablet);
        html.classList.toggle("".concat(prefix, "mobile"), output.mobile);
    })();
    return output;
}
//# sourceMappingURL=index.js.map