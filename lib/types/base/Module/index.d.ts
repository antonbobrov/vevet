import { TRequiredProps } from '../../internal/requiredProps';
import { Callbacks, ICallbacksSettings, TCallbacksAction } from '../Callbacks';
import { IModuleCallbacksMap, IModuleMutableProps, IModuleStaticProps } from './types';
export * from './types';
/**
 * A base class for modules that handle responsive properties, event listeners, and custom callbacks.
 *
 * @group Base
 */
export declare class Module<CallbacksMap extends IModuleCallbacksMap = IModuleCallbacksMap, StaticProps extends IModuleStaticProps = IModuleStaticProps, MutableProps extends IModuleMutableProps = IModuleMutableProps> {
    /** Get default static props */
    _getStatic(): TRequiredProps<StaticProps>;
    /** Set default mutable props */
    _getMutable(): TRequiredProps<MutableProps>;
    /** Current properties */
    protected _props: TRequiredProps<MutableProps & StaticProps>;
    /**
     * Current properties. Do not mutate these directly, use {@linkcode updateProps} instead.
     */
    get props(): TRequiredProps<MutableProps & StaticProps>;
    /** Optional prefix for classnames used by the module */
    get prefix(): string;
    /** The name of the module, derived from the class name */
    get name(): string;
    /** Tracks whether the module has been destroyed */
    protected _isDestroyed: boolean;
    /**
     * Checks if the module has been destroyed.
     */
    get isDestroyed(): boolean;
    /** Callbacks instance */
    protected _callbacks: Callbacks<CallbacksMap>;
    /**
     * Retrieves the module's callbacks instance.
     */
    get callbacks(): Callbacks<CallbacksMap>;
    /** Stores actions that need to be executed when the module is destroyed */
    protected _destroyable: (() => void)[];
    /**
     * Creates a new instance of the Module class.
     */
    constructor(props?: StaticProps & MutableProps);
    /**
     * Method that is called when the module's properties mutate. In most cases, used to handle callbacks.
     */
    protected _handleProps(): void;
    /** Change module's mutable properties */
    updateProps(props: Partial<MutableProps>): void;
    /**
     * Adds a callback on the module's destruction.
     *
     * @param action - The function to execute during destruction.
     */
    onDestroy(action: () => void): void;
    /**
     * Adds a custom callback to the module.
     *
     * @param target - The event type to listen for (e.g., 'props', 'destroy').
     * @param listener - The function to execute when the event is triggered.
     * @param settings - Additional settings for the callback.
     */
    on<T extends keyof CallbacksMap>(target: T, listener: TCallbacksAction<CallbacksMap[T]>, settings?: ICallbacksSettings): () => void;
    /**
     * Helper function to generate classnames with the module's prefix.
     *
     * @param classNames - The class names to generate.
     * @returns A string of class names with the module's prefix applied.
     */
    protected _cn(...classNames: string[]): string;
    /**
     * Adds a class name on an element, and keeps track of it for removal when the module is destroyed.
     *
     * @param element - The target DOM element.
     * @param className - The class name to toggle.
     */
    protected _addTempClassName(element: Element, className: string): void;
    /**
     * Destroys the module, cleaning up resources, callbacks, and event listeners.
     */
    destroy(): void;
    /**
     * Internal method to handle the destruction of the module.
     * It removes all callbacks, destroys properties, and cleans up event listeners and class names.
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map