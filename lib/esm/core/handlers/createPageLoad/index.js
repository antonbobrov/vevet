import { Callbacks } from '../../../base/Callbacks';
import { addEventListener } from '../../../utils/listeners';
export function createPageLoad({ prefix, applyClassNames }) {
    const callbacks = new Callbacks();
    let isLoaded = false;
    if (document.readyState === 'complete') {
        setTimeout(() => handleLoaded(), 0);
    }
    else {
        addEventListener(window, 'load', () => handleLoaded());
    }
    /** Callback on page loaded */
    function handleLoaded() {
        const html = document.documentElement;
        const { body } = document;
        isLoaded = true;
        if (applyClassNames) {
            html.classList.remove(`${prefix}loading`);
            body.classList.remove(`${prefix}loading`);
            html.classList.add(`${prefix}loaded`);
        }
        callbacks.emit('loaded', undefined);
    }
    /** Add a callback on page load */
    function onLoad(callback) {
        if (isLoaded) {
            callback();
            return () => { };
        }
        return callbacks.on('loaded', () => callback());
    }
    return { onLoad, getIsLoaded: () => isLoaded };
}
//# sourceMappingURL=index.js.map