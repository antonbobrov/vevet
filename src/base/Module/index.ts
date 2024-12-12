import { NModule } from './types';
import { MutableProps, NMutableProps } from '../MutableProps';
import { Callbacks, NCallbacks } from '../Callbacks';
import { TRequiredModuleProp } from '@/types/utility';
import { getApp } from '@/utils/internal/getApp';
import { createViewport } from '@/src/Vevet/events/createViewport';
import { addEventListener } from '@/utils/dom/addEventListener';

export type { NModule };

type TViewportAdd = ReturnType<typeof createViewport>['callbacks']['add'];

/**
 * A base class for modules that handle responsive properties, event listeners, and custom callbacks.
 * This class provides a structure for modules that can dynamically respond to viewport changes, property mutations, and various lifecycle events.
 *
 * @example
 *
 * interface IStaticProps extends NModule.IStaticProps {
 *   staticName: 'My name';
 * }
 *
 * interface IChangeableProps extends NModule.IChangeableProps {
 *   weight: number;
 *   height: number;
 * }
 *
 * interface ICallbacks extends NModule.ICallbacksTypes {}
 *
 * const module = new Module<IStaticProps, IChangeableProps, ICallbacks>({
 *   staticName: 'My name',
 *   weight: 70,
 *   height: 175,
 * }, false);
 *
 * module.addResponsiveProps({
 *   breakpoint: 'viewport_phone',
 *   settings: {
 *     weight: 80,
 *   },
 * });
 *
 * module.init();
 *
 * module.addCallback('propsMutate', () => console.log('mutate props'));
 * module.addCallback('destroy', () => console.log('destroy'));
 */
export class Module<
  StaticProps extends NModule.IStaticProps = NModule.IStaticProps,
  ChangeableProps extends NModule.IChangeableProps = NModule.IChangeableProps,
  CallbacksTypes extends NModule.ICallbacksTypes = NModule.ICallbacksTypes,
> {
  /**
   * Retrieves the default properties for the module. This method is intended to be overridden in subclasses to provide default values for the module's properties.
   */
  protected _getDefaultProps() {
    return {};
  }

  /**
   * The current properties of the module, which include both static and changeable properties.
   * These can be retrieved dynamically during the module's lifecycle.
   */
  get props() {
    return this._props.props as TRequiredModuleProp<
      StaticProps & ChangeableProps
    >;
  }

  /** Manages the module's mutable properties */
  private _props: MutableProps<StaticProps, ChangeableProps>;

  /** Manages the module's callbacks */
  private _callbacks: Callbacks<CallbacksTypes>;

  /**
   * Retrieves the module's registered callbacks.
   */
  get callbacks() {
    return this._callbacks;
  }

  /** Stores actions that need to be executed when the module is destroyed */
  private _destroyable: (() => void)[];

  /** Stores the class names to be removed when the module is destroyed */
  private _classNames: NModule.IClassNamesToRemove[];

  /** The name of the module, derived from the class name */
  get name() {
    return this.constructor.name;
  }

  /** Optional prefix for class names used by the module */
  get prefix() {
    return '';
  }

  /** Tracks whether the module has been initialized */
  private _isInitialized = false;

  /**
   * Checks if the module has been initialized.
   */
  get isInitialized() {
    return this._isInitialized;
  }

  /** Tracks whether the module has been destroyed */
  private _isDestroyed = false;

  /**
   * Checks if the module has been destroyed.
   */
  get isDestroyed() {
    return this._isDestroyed;
  }

  /**
   * Creates a new instance of the Module class.
   *
   * @param initialProps - The initial static and changeable properties to be used by the module.
   * @param canInit - Whether to automatically initialize the module after construction. Set this to `false` if you want to add responsive properties before initializing.
   */
  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    if (!getApp()) {
      throw new Error('Vevet.Application does not exist yet');
    }

    this._callbacks = new Callbacks<CallbacksTypes>();
    this._destroyable = [];
    this._classNames = [];

    const props = {
      ...this._getDefaultProps(),
      ...(initialProps || {}),
    };

    this._props = new MutableProps(
      props as StaticProps & ChangeableProps,
      () => this._onPropsMutate(),
      this.name,
    );

    if (canInit) {
      this.init();
    }
  }

  /**
   * Adds responsive property rules to the module. This must be done before initialization.
   *
   * @param rules - The responsive property rules to be added.
   */
  public addResponsiveProps(rules: NMutableProps.IResponsive<ChangeableProps>) {
    if (this.isInitialized) {
      throw new Error(
        'Responsive properties cannot be added after `init` is called',
      );
    } else {
      this._props.addResponsiveProps(rules);
    }
  }

  /**
   * Updates the changeable properties of the module.
   *
   * @param props - The properties to be updated.
   */
  public changeProps(props: Partial<ChangeableProps>) {
    if (this.isDestroyed) {
      return;
    }

    this._props.changeProps(props);

    this._callbacks.tbt('propsChange', undefined);
  }

  /**
   * This method is called internally when the module's properties change.
   */
  protected _onPropsMutate() {
    this._callbacks.tbt('propsMutate', undefined);
  }

  /**
   * Initializes the module. Calls the internal `_init` method and marks the module as initialized.
   */
  public init() {
    if (this.isInitialized) {
      return;
    }

    this._isInitialized = true;

    this._init();
  }

  /**
   * Additional initialization logic that can be overridden in subclasses.
   */
  protected _init() {}

  /**
   * Adds an action to the list of actions to be executed when the module is destroyed.
   *
   * @param action - The function to execute during destruction.
   */
  protected addDestroyable(action: () => void) {
    this._destroyable.push(action);
  }

  /**
   * Adds a viewport callback that will be automatically removed when the module is destroyed.
   *
   * @param target - The viewport target (e.g., width or height).
   * @param action - The callback function to execute when the viewport target changes.
   * @param data - Additional data for the callback.
   */
  public onViewport(
    target: Parameters<TViewportAdd>[0],
    action: Parameters<TViewportAdd>[1],
    data: Parameters<TViewportAdd>[2] = {},
  ) {
    const destruct = getApp().onViewport(target, action, {
      ...data,
      name: this.constructor.name,
    });

    this.addDestroyable(() => destruct());
  }

  /**
   * Adds a custom callback to the module.
   *
   * @param target - The event type to listen for (e.g., 'propsChange', 'destroy').
   * @param action - The function to execute when the event is triggered.
   * @param settings - Additional settings for the callback.
   */
  public on<T extends keyof CallbacksTypes>(
    target: T,
    action: NCallbacks.TAction<CallbacksTypes[T]>,
    settings: NCallbacks.ISettings = {},
  ) {
    return this.callbacks.on(target, action, settings);
  }

  /**
   * Adds a DOM event listener that will be automatically removed when the module is destroyed.
   *
   * @param element - The target element for the event listener.
   * @param target - The event type to listen for (e.g., 'click', 'resize').
   * @param callback - The callback function to execute when the event is triggered.
   * @param options - Additional options for the event listener.
   */
  public addEventListener<
    Target extends keyof HTMLElementEventMap,
    Listener extends (event: DocumentEventMap[Target]) => void,
  >(
    element: Document | Element | Window,
    target: Target,
    callback: Listener,
    options?: boolean | AddEventListenerOptions,
  ) {
    const destruct = addEventListener(element, target, callback, options);

    this.addDestroyable(() => destruct());
  }

  /**
   * Helper function to generate class names with the module's prefix.
   *
   * @param classNames - The class names to generate.
   * @returns A string of class names with the module's prefix applied.
   */
  protected className(...classNames: string[]) {
    return classNames.map((value) => `${this.prefix}${value}`).join(' ');
  }

  /**
   * Toggles a class name on an element, and keeps track of it for removal when the module is destroyed.
   *
   * @param element - The target DOM element.
   * @param className - The class name to toggle.
   * @param isActive - Whether the class should be added or removed.
   */
  protected toggleClassName(
    element: Element,
    className: string,
    isActive: boolean,
  ) {
    const isAlreadyExists = element.classList.contains(className);

    element.classList.toggle(className, isActive);

    if (!isAlreadyExists) {
      this._classNames.push({ element, className });
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
    this._callbacks.tbt('destroy', undefined);
    this._callbacks.destroy();

    this._props.destroy();

    this._destroyable.forEach((action) => action());

    this._classNames.forEach(({ element, className }) =>
      element.classList.remove(className),
    );

    this._isDestroyed = true;
  }
}
