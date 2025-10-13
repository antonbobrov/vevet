import { detect } from 'detect-browser';
import isMobileJs from 'ismobilejs';
import manifest from '../manifest.json';
import { createPageLoad } from './handlers/createPageLoad';
import { createViewport } from './handlers/createViewport';
export function Core(input) {
    // set default properties
    var _a;
    const defaultProps = {
        md: 1199,
        sm: 999,
        resizeDebounce: 0,
        easing: [0.25, 0.1, 0.25, 1],
        applyClassNames: false,
    };
    const props = Object.assign(Object.assign({}, defaultProps), input);
    const prefix = 'v-';
    // device info
    const browserData = detect();
    const device = isMobileJs();
    const osName = (_a = ((browserData === null || browserData === void 0 ? void 0 : browserData.os) || '')) === null || _a === void 0 ? void 0 : _a.split(' ')[0].toLowerCase();
    const browserName = ((browserData === null || browserData === void 0 ? void 0 : browserData.name) || '').toLowerCase();
    const isMobile = device.phone || device.tablet;
    // events
    const pageLoad = createPageLoad({
        prefix,
        applyClassNames: props.applyClassNames,
    });
    const viewport = createViewport({ prefix, props, isMobile });
    // output
    const output = Object.assign(Object.assign({}, viewport.data), { viewportCallbacks: viewport.callbacks, version: manifest.version, props,
        prefix, phone: device.phone, tablet: device.tablet, mobile: isMobile, osName,
        browserName, doc: document, html: document.documentElement, body: document.body, loaded: false, onLoad: pageLoad.onLoad, onResize: (...params) => viewport.callbacks.on(...params) });
    // update props on page load
    pageLoad.onLoad(() => {
        output.loaded = true;
    });
    // update props on viewport change
    viewport.callbacks.add('trigger', () => {
        const keys = Object.keys(viewport.data);
        keys.forEach((key) => {
            // @ts-ignore
            output[key] = viewport.data[key];
        });
    }, { protected: true, name: 'vevet core' });
    // set device features
    (function setDeviceFeatures() {
        if (!props.applyClassNames) {
            return;
        }
        const { html } = output;
        html.classList.add(`${prefix}os-${osName}`);
        html.classList.add(`${prefix}browser-${browserName}`);
        html.classList.toggle(`${prefix}phone`, output.phone);
        html.classList.toggle(`${prefix}tablet`, output.tablet);
        html.classList.toggle(`${prefix}mobile`, output.mobile);
    })();
    return output;
}
//# sourceMappingURL=index.js.map