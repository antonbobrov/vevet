import { Callbacks } from '../../../base/Callbacks';
import { addEventListener } from '../../../utils/listeners';
export function createViewport({ prefix, props, isMobile }) {
    const html = document.documentElement;
    let styles = document.getElementById('vevet_css_preset');
    if (!styles) {
        styles = document.createElement('style');
        styles.id = 'vevet_css_preset';
        document.body.appendChild(styles);
    }
    const mqDesktop = window.matchMedia(`(min-width: ${props.md + 0.001}px)`);
    const mqTablet = window.matchMedia(`(min-width: ${props.sm + 0.001}px) and (max-width: ${props.md}px)`);
    const mqPhone = window.matchMedia(`(max-width: ${props.sm}px)`);
    // create callbacks
    const callbacks = new Callbacks();
    // default data
    const data = {
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
    let debounce;
    function debounceResize() {
        if (debounce) {
            clearTimeout(debounce);
            debounce = undefined;
        }
        if (props.resizeDebounce) {
            debounce = setTimeout(() => onResize(), props.resizeDebounce);
        }
        else {
            onResize();
        }
    }
    addEventListener(window, 'resize', () => debounceResize());
    const observer = new ResizeObserver(() => debounceResize());
    observer.observe(document.documentElement);
    observer.observe(document.body);
    /** Event on window resize */
    function onResize() {
        const { width: prevWidth, height: prevHeight } = data;
        updateValues();
        updateClassNames();
        updateCSSVars();
        const { width, height } = data;
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
        const { width: prevWidth } = data;
        const root = document.documentElement;
        const rootStyles = getComputedStyle(root);
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
        html.classList.toggle(`${prefix}lg`, data.lg);
        html.classList.toggle(`${prefix}md`, data.md);
        html.classList.toggle(`${prefix}sm`, data.sm);
        html.classList.toggle(`${prefix}landscape`, data.landscape);
        html.classList.toggle(`${prefix}portrait`, data.portrait);
    }
    /** Update CSS variables */
    function updateCSSVars() {
        styles.innerHTML = `
      html {
        --vw: ${data.vw}px;
        --vh: ${data.vh}px;
        --svh: ${data.svh}px;
        --scrollbar-width: ${data.scrollbarWidth}px;
      }
    `;
    }
    return { data, callbacks };
}
//# sourceMappingURL=index.js.map