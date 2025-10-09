import { clamp } from '../../utils/math';
import { Module } from '../../base/Module';
import { initVevet } from '../../global/initVevet';
export * from './types';
/**
 * InView is a visibility detection utility that leverages the `IntersectionObserver` API to monitor when elements enter or leave the viewport.
 * It provides customizable options for triggering events, delaying visibility changes, and dynamically adding CSS classes to elements based on their visibility state.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/InView)
 *
 * @group Components
 */
export class InView extends Module {
    /**
     * Returns default static properties.
     */
    _getStatic() {
        return Object.assign(Object.assign({}, super._getStatic()), { hasOut: true, maxInitialDelay: 1000, scrollDirection: 'vertical' });
    }
    /**
     * Returns default mutable properties.
     */
    _getMutable() {
        return Object.assign(Object.assign({}, super._getMutable()), { enabled: true, rootMargin: '0% 0% -5% 0%' });
    }
    /**
     * Indicates whether the observation has started for the first time.
     */
    get isInitialStart() {
        return this._isInitialStart;
    }
    /**
     * Returns all elements currently being observed.
     */
    get elements() {
        return this._elements;
    }
    /**
     * Initializes the `InView` module.
     */
    constructor(props) {
        super(props);
        /** Tracks whether this is the first time the elements are being observed. */
        this._isInitialStart = true;
        /** Stores the elements being observed. */
        this._elements = [];
        this._setup();
    }
    /**
     * Handles property mutations and updates observation events accordingly.
     */
    _handleProps() {
        super._handleProps();
        this._setup();
    }
    /**
     * Configures or reconfigures the view observation events.
     */
    _setup() {
        this._removeViewEvents();
        if (this.props.enabled) {
            this._setViewEvents();
        }
    }
    /**
     * Removes all observation events and disconnects observers.
     */
    _removeViewEvents() {
        var _a, _b;
        (_a = this._observerIn) === null || _a === void 0 ? void 0 : _a.disconnect();
        this._observerIn = undefined;
        (_b = this._observerOut) === null || _b === void 0 ? void 0 : _b.disconnect();
        this._observerOut = undefined;
    }
    /**
     * Sets up `IntersectionObserver` instances to detect visibility changes.
     */
    _setViewEvents() {
        const { isInitialStart, props } = this;
        const rootMargin = isInitialStart ? '0% 0% 0% 0%' : props.rootMargin;
        this._observerIn = new IntersectionObserver((data) => this._handleIn(data), { root: null, threshold: 0, rootMargin });
        this.elements.forEach((element) => { var _a; return (_a = this._observerIn) === null || _a === void 0 ? void 0 : _a.observe(element); });
        if (props.hasOut) {
            this._observerOut = new IntersectionObserver((data) => this._handleOut(data), { root: null, threshold: 0, rootMargin: '0px 0px 0px 0px' });
            this.elements.forEach((element) => { var _a; return (_a = this._observerOut) === null || _a === void 0 ? void 0 : _a.observe(element); });
        }
    }
    /**
     * Handles elements entering the viewport.
     */
    _handleIn(data) {
        data.forEach((entry) => {
            const element = entry.target;
            if (!entry.isIntersecting || element.$vevetInViewBool) {
                return;
            }
            element.$vevetInViewBool = true;
            if (element.$vevetInViewTimeout) {
                clearTimeout(element.$vevetInViewTimeout);
            }
            element.$vevetInViewTimeout = setTimeout(() => this._handleInOut(element, true), this._getElementDelay(element));
            if (!this.props.hasOut) {
                this.removeElement(element);
            }
        });
        if (this._isInitialStart) {
            this._isInitialStart = false;
            this._setup();
        }
    }
    /**
     * Handles elements leaving the viewport.
     */
    _handleOut(data) {
        data.forEach((entry) => {
            const element = entry.target;
            if (entry.isIntersecting || !element.$vevetInViewBool) {
                return;
            }
            element.$vevetInViewBool = false;
            if (element.$vevetInViewTimeout) {
                clearTimeout(element.$vevetInViewTimeout);
            }
            element.$vevetInViewTimeout = setTimeout(() => {
                this._handleInOut(element, false);
            }, 0);
        });
    }
    /**
     * Toggles visibility classes and emits events for visibility changes.
     */
    _handleInOut(element, isInView) {
        const className = element.getAttribute('data-in-view-class');
        if (className) {
            element.classList.toggle(className, isInView);
        }
        this.callbacks.emit(isInView ? 'in' : 'out', { element });
    }
    /**
     * Calculates the delay before triggering an element's visibility event.
     */
    _getElementDelay(element) {
        const { props } = this;
        const app = initVevet();
        if (!this.isInitialStart || props.maxInitialDelay <= 0) {
            return 0;
        }
        const bounding = element.getBoundingClientRect();
        const rootBounding = {
            top: 0,
            left: 0,
            width: app.width,
            height: app.height,
        };
        const progress = clamp(props.scrollDirection === 'horizontal'
            ? (bounding.left - rootBounding.left) / rootBounding.width
            : (bounding.top - rootBounding.top) / rootBounding.height, 0, 1);
        return progress * props.maxInitialDelay;
    }
    /**
     * Registers an element for visibility observation.
     *
     * If the element has a `data-in-view-class` attribute, the specified class will be applied upon entering the viewport.
     *
     * @returns A function to stop observing the element.
     */
    addElement(element) {
        var _a, _b;
        const finalElement = element;
        finalElement.$vevetInViewBool = undefined;
        this._elements.push(finalElement);
        (_a = this._observerIn) === null || _a === void 0 ? void 0 : _a.observe(finalElement);
        (_b = this._observerOut) === null || _b === void 0 ? void 0 : _b.observe(finalElement);
        return () => this.removeElement(finalElement);
    }
    /**
     * Removes an element from observation, preventing further visibility tracking.
     */
    removeElement(element) {
        var _a, _b;
        const finalElement = element;
        (_a = this._observerIn) === null || _a === void 0 ? void 0 : _a.unobserve(finalElement);
        (_b = this._observerOut) === null || _b === void 0 ? void 0 : _b.unobserve(finalElement);
        this._elements = this._elements.filter((el) => el !== element);
        finalElement.$vevetInViewBool = undefined;
    }
    /**
     * Cleans up the module and disconnects all observers and listeners.
     */
    _destroy() {
        super._destroy();
        this._removeViewEvents();
    }
}
//# sourceMappingURL=index.js.map