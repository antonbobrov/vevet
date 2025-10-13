import { Module } from '../../base/Module';
import { Timeline } from '../Timeline';
import { initVevet } from '../../global/initVevet';
export * from './types';
/**
 * Page preloader component that manages the visibility and lifecycle of a loading screen.
 * The module does not provide styling for the container.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Preloader)
 *
 * @group Components
 */
export class Preloader extends Module {
    /**
     * Retrieves the default static properties.
     */
    _getStatic() {
        return Object.assign(Object.assign({}, super._getStatic()), { hide: 250 });
    }
    /**
     * Retrieves the default mutable properties.
     */
    _getMutable() {
        return Object.assign({}, super._getMutable());
    }
    /**
     * Returns whether the preloader is currently hidden.
     */
    get isHidden() {
        return this._isHidden;
    }
    constructor(props) {
        super(props);
        /** Indicates if the preloader is in the process of being hidden. */
        this._shouldHide = false;
        /** Indicates if the preloader has already been hidden. */
        this._isHidden = false;
        /** Indicates if the page is fully loaded. */
        this._isLoaded = false;
        // Handle page load event
        const timeout = setTimeout(() => {
            this._onLoaded(() => this._handleLoaded());
        }, 0);
        this.onDestroy(() => clearTimeout(timeout));
    }
    /**
     * Handles the page load event, triggering when the page is fully loaded.
     */
    _onLoaded(callback) {
        initVevet().onLoad(callback);
    }
    /**
     * Handles the logic that occurs after the page is fully loaded.
     */
    _handleLoaded() {
        if (this.isDestroyed) {
            return;
        }
        this._isLoaded = true;
        this.callbacks.emit('loaded', undefined);
        if (typeof this.props.hide === 'number') {
            this.hide(this.props.hide);
        }
    }
    /**
     * Hides the preloader with a custom animation duration.
     *
     * @param duration - The duration of the hide animation (in milliseconds). Applies only when the container is used.
     * @param callback - The callback to execute when the hide animation is complete.
     *
     * @returns Returns an action destructor.
     */
    hide(duration, callback) {
        if (!this._isLoaded || this._shouldHide) {
            return undefined;
        }
        let isDestroyed = false;
        this._shouldHide = true;
        this.callbacks.emit('hide', undefined);
        this._hideContainer(() => {
            this._onHidden();
            if (!isDestroyed) {
                callback === null || callback === void 0 ? void 0 : callback();
            }
        }, duration);
        return () => {
            isDestroyed = true;
        };
    }
    /**
     * Executes the hiding animation for the preloader container.
     */
    _hideContainer(onHidden, duration) {
        const { container } = this.props;
        if (!container) {
            onHidden();
            return;
        }
        const tm = new Timeline({ duration });
        this.onDestroy(() => tm.destroy());
        tm.on('update', ({ progress }) => {
            container.style.opacity = String(1 - progress);
            container.style.display = progress === 1 ? 'none' : 'flex';
        });
        tm.on('end', () => onHidden());
        tm.play();
    }
    /**
     * Handles actions when the preloader is fully hidden.
     */
    _onHidden() {
        this._isHidden = true;
        this.callbacks.emit('hidden', undefined);
    }
    /**
     * Registers a callback for when the preloader starts hiding.
     *
     * @param action - The callback function to execute.
     * @returns A destructor.
     */
    onHide(action) {
        if (this._shouldHide) {
            action();
            return () => { };
        }
        return this.on('hide', (() => action()));
    }
    /**
     * Registers a callback for when the preloader is fully hidden.
     *
     * @param action - The callback function to execute.
     * @returns A destructor.
     */
    onHidden(action) {
        if (this._isHidden) {
            action();
            return () => { };
        }
        return this.on('hidden', (() => action()));
    }
}
//# sourceMappingURL=index.js.map