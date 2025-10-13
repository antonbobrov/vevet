import { Callbacks } from '../Callbacks';
import { mergeWithNoUndefined } from '../../internal/mergeWithNoUndefined';
// todo: jsdoc
export * from './types';
/**
 * A base class for modules that handle responsive properties, event listeners, and custom callbacks.
 *
 * @group Base
 */
export class Module {
    /** Get default static props */
    _getStatic() {
        return { __staticProp: null };
    }
    /** Set default mutable props */
    _getMutable() {
        return { __mutableProp: null };
    }
    /**
     * Current properties. Do not mutate these directly, use {@linkcode updateProps} instead.
     */
    get props() {
        return this._props;
    }
    /** Optional prefix for classnames used by the module */
    get prefix() {
        return '';
    }
    /** The name of the module, derived from the class name */
    get name() {
        return this.constructor.name;
    }
    /**
     * Checks if the module has been destroyed.
     */
    get isDestroyed() {
        return this._isDestroyed;
    }
    /**
     * Retrieves the module's callbacks instance.
     */
    get callbacks() {
        return this._callbacks;
    }
    /**
     * Creates a new instance of the Module class.
     */
    constructor(props) {
        /** Tracks whether the module has been destroyed */
        this._isDestroyed = false;
        /** Stores actions that need to be executed when the module is destroyed */
        this._destroyable = [];
        this._callbacks = new Callbacks();
        this._props = mergeWithNoUndefined(Object.assign(Object.assign({}, this._getStatic()), this._getMutable()), Object.assign({}, props));
    }
    /**
     * Method that is called when the module's properties mutate. In most cases, used to handle callbacks.
     */
    _handleProps() {
        this.callbacks.emit('props', undefined);
    }
    /** Change module's mutable properties */
    updateProps(props) {
        this._props = Object.assign(Object.assign({}, this._props), props);
        this._handleProps();
    }
    /**
     * Adds a callback on the module's destruction.
     *
     * @param action - The function to execute during destruction.
     */
    onDestroy(action) {
        this._destroyable.push(action);
    }
    /**
     * Adds a custom callback to the module.
     *
     * @param target - The event type to listen for (e.g., 'props', 'destroy').
     * @param listener - The function to execute when the event is triggered.
     * @param settings - Additional settings for the callback.
     */
    on(target, listener, settings = {}) {
        return this.callbacks.on(target, listener, settings);
    }
    /**
     * Helper function to generate classnames with the module's prefix.
     *
     * @param classNames - The class names to generate.
     * @returns A string of class names with the module's prefix applied.
     */
    _cn(...classNames) {
        return classNames.map((value) => `${this.prefix}${value}`).join(' ');
    }
    /**
     * Adds a class name on an element, and keeps track of it for removal when the module is destroyed.
     *
     * @param element - The target DOM element.
     * @param className - The class name to toggle.
     */
    _addTempClassName(element, className) {
        const isAlreadyExists = element.classList.contains(className);
        if (!isAlreadyExists) {
            element.classList.add(className);
            this.onDestroy(() => element.classList.remove(className));
        }
    }
    /**
     * Destroys the module, cleaning up resources, callbacks, and event listeners.
     */
    destroy() {
        if (this.isDestroyed) {
            return;
        }
        this._destroy();
    }
    /**
     * Internal method to handle the destruction of the module.
     * It removes all callbacks, destroys properties, and cleans up event listeners and class names.
     */
    _destroy() {
        this._callbacks.emit('destroy', undefined);
        this._callbacks.destroy();
        this._destroyable.forEach((action) => action());
        this._isDestroyed = true;
    }
}
//# sourceMappingURL=index.js.map