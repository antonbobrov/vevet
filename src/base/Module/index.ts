import { TRequiredProps } from '@/internal/requiredProps';
import { Callbacks, ICallbacksSettings, TCallbacksAction } from '../Callbacks';
import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from './types';

// todo: jsdoc

export * from './types';

/**
 * A base class for modules that handle responsive properties, event listeners, and custom callbacks.
 *
 * @group Base
 */
export class Module<
  CallbacksMap extends IModuleCallbacksMap = IModuleCallbacksMap,
  StaticProps extends IModuleStaticProps = IModuleStaticProps,
  MutableProps extends IModuleMutableProps = IModuleMutableProps,
> {
  /** Get default static props */
  public _getStatic(): TRequiredProps<StaticProps> {
    return { __staticProp: null } as TRequiredProps<StaticProps>;
  }

  /** Set default mutable props */
  public _getMutable(): TRequiredProps<MutableProps> {
    return { __mutableProp: null } as TRequiredProps<MutableProps>;
  }

  /** Current properties */
  protected _props: TRequiredProps<MutableProps & StaticProps>;

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

  /** Tracks whether the module has been destroyed */
  protected _isDestroyed = false;

  /**
   * Checks if the module has been destroyed.
   */
  get isDestroyed() {
    return this._isDestroyed;
  }

  /** Callbacks instance */
  protected _callbacks: Callbacks<CallbacksMap>;

  /**
   * Retrieves the module's callbacks instance.
   */
  get callbacks() {
    return this._callbacks;
  }

  /** Stores actions that need to be executed when the module is destroyed */
  protected _destroyable: (() => void)[] = [];

  /**
   * Creates a new instance of the Module class.
   */
  constructor(props?: StaticProps & MutableProps) {
    this._callbacks = new Callbacks();

    this._props = {
      ...this._getStatic(),
      ...this._getMutable(),
      ...props,
    } as TRequiredProps<MutableProps & StaticProps>;
  }

  /**
   * Method that is called when the module's properties mutate. In most cases, used to handle callbacks.
   */
  protected _handleProps() {
    this.callbacks.emit('props', undefined);
  }

  /** Change module's mutable properties */
  public updateProps(props: Partial<MutableProps>) {
    this._props = {
      ...this._props,
      ...props,
    };

    this._handleProps();
  }

  /**
   * Adds a callback on the module's destruction.
   *
   * @param action - The function to execute during destruction.
   */
  public onDestroy(action: () => void) {
    this._destroyable.push(action);
  }

  /**
   * Adds a custom callback to the module.
   *
   * @param target - The event type to listen for (e.g., 'props', 'destroy').
   * @param listener - The function to execute when the event is triggered.
   * @param settings - Additional settings for the callback.
   */
  public on<T extends keyof CallbacksMap>(
    target: T,
    listener: TCallbacksAction<CallbacksMap[T]>,
    settings: ICallbacksSettings = {},
  ) {
    return this.callbacks.on(target, listener, settings);
  }

  /**
   * Helper function to generate classnames with the module's prefix.
   *
   * @param classNames - The class names to generate.
   * @returns A string of class names with the module's prefix applied.
   */
  protected _cn(...classNames: string[]) {
    return classNames.map((value) => `${this.prefix}${value}`).join(' ');
  }

  /**
   * Adds a class name on an element, and keeps track of it for removal when the module is destroyed.
   *
   * @param element - The target DOM element.
   * @param className - The class name to toggle.
   */
  protected _addTempClassName(element: Element, className: string) {
    const isAlreadyExists = element.classList.contains(className);

    if (!isAlreadyExists) {
      element.classList.add(className);

      this.onDestroy(() => element.classList.remove(className));
    }
  }

  /**
   * Destroys the module, cleaning up resources, callbacks, and event listeners.
   */
  public destroy() {
    if (this.isDestroyed) {
      return;
    }

    this._destroy();
  }

  /**
   * Internal method to handle the destruction of the module.
   * It removes all callbacks, destroys properties, and cleans up event listeners and class names.
   */
  protected _destroy() {
    this._callbacks.emit('destroy', undefined);
    this._callbacks.destroy();

    this._destroyable.forEach((action) => action());

    this._isDestroyed = true;
  }
}
