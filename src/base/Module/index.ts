import {
  addEventListener,
  IAddEventListener,
  IAddEventListenerOptions,
  ListenerElement,
} from 'vevet-dom';
import { DeepRequired } from 'ts-essentials';
import { NModule } from './types';
import { MutableProps, NMutableProps } from '../MutableProps';
import { Callbacks, NCallbacks } from '../Callbacks';
import { Viewport } from '@/src/Application/events/Viewport';
import { TRequiredModuleProp } from '@/types/utility';

export type { NModule };

type TViewportAdd = Viewport['add'];

/**
 * Module base
 */
export class Module<
  StaticProps extends NModule.IStaticProps = NModule.IStaticProps,
  ChangeableProps extends NModule.IChangeableProps = NModule.IChangeableProps,
  CallbacksTypes extends NModule.ICallbacksTypes = NModule.ICallbacksTypes,
> {
  /**
   * Get Default properties (should be extended)
   */
  protected _getDefaultProps() {
    return { parent: null } as DeepRequired<StaticProps & ChangeableProps>;
  }

  /** Current properties */
  get props() {
    return this._mutableProps.props as TRequiredModuleProp<
      StaticProps & ChangeableProps
    >;
  }

  /** Responsive properties */
  private _mutableProps: MutableProps<StaticProps, ChangeableProps>;

  /** Module Callbacks */
  private _callbacks: Callbacks<CallbacksTypes>;

  /** Module Callbacks */
  get callbacks() {
    return this._callbacks;
  }

  /** Module listeners */
  private _listeners: IAddEventListener[];

  /**
   * Destroyable actions
   */
  private _destroyableActions: (() => void)[];

  /**
   * Classnames to remove
   */
  private _classNamesToRemove: NModule.IClassNamesToRemove[];

  /** Vevet Application */
  private _app!: typeof window.vevetApp;

  /** Vevet Application */
  get app() {
    return this._app;
  }

  /** Module name */
  get name() {
    return this.constructor.name;
  }

  /** Module prefix */
  get prefix() {
    return '';
  }

  /** The module is initialized */
  private _isInitialized = false;

  /** The module is initialized */
  get isInitialized() {
    return this._isInitialized;
  }

  /** The module is destroyed */
  private _isDestroyed = false;

  /** The module is destroyed */
  get isDestroyed() {
    return this._isDestroyed;
  }

  /**
   * @example
   * 
   * interface IStaticProps extends NModule.IStaticProps {
   *   staticName: 'My name';
   * }

   * interface IChangeableProps extends NModule.IChangeableProps {
   *   weight: number;
   *   height: number;
   * }

   * interface ICallbacks extends NModule.ICallbacksTypes {}

   * const module = new Module<IStaticProps, IChangeableProps, ICallbacks>(
   *   {
   *     staticName: 'My name',
   *     weight: 70,
   *     height: 175,
   *   },
   *   false
   * );

   * module.addResponsiveProps({
   *   breakpoint: 'viewport_phone',
   *   settings: {
   *     weight: 80,
   *   },
   * });

   * module.init();

   * module.addCallback('propsMutate', () => console.log('mutate props'));

   * module.addCallback('destroy', () => console.log('destroy'));
   */
  constructor(
    /** Initial properties */
    initialProps?: StaticProps & ChangeableProps,
    /**
     * Defines if you need to call {@linkcode Module.init} at the constructor's end.
     * If you want to add responsive properties, set this parameter to `false`.
     */
    canInit = true,
  ) {
    if (window.vevetApp) {
      this._app = window.vevetApp;
    } else {
      throw new Error(
        'Vevet.Application does not exist yet. Call "new Vevet.Application()" before using all the stuff',
      );
    }

    this._callbacks = new Callbacks<CallbacksTypes>();
    this._listeners = [];
    this._destroyableActions = [];
    this._classNamesToRemove = [];

    const props = {
      ...this._getDefaultProps(),
      ...(initialProps || {}),
    };

    this._mutableProps = new MutableProps(
      props as StaticProps & ChangeableProps,
      () => this._onPropsMutate(),
      this.name,
    );

    if (canInit) {
      this.init();
    }
  }

  /** Add responsive rules */
  public addResponsiveProps(rules: NMutableProps.IResponsive<ChangeableProps>) {
    if (this.isInitialized) {
      throw new Error(
        'Responsive properties cannot be added after `init` is called',
      );
    } else {
      this._mutableProps.addResponsiveProps(rules);
    }
  }

  /** Change module properties */
  public changeProps(props: Partial<ChangeableProps>) {
    if (this.isDestroyed) {
      return;
    }

    this._mutableProps.changeProps(props);

    this._callbacks.tbt('propsChange', undefined);
  }

  /**
   * This method is called on properties change
   */
  protected _onPropsMutate() {
    this._callbacks.tbt('propsMutate', undefined);
  }

  /** Initializes the class */
  public init() {
    if (this.isInitialized) {
      return;
    }

    this._isInitialized = true;

    this._init();

    // destroy the current module on parent destroy
    if (this.props.parent) {
      this.props.parent.addCallback('destroy', () => this.destroy(), {
        isProtected: true,
        name: this.name,
      });
    }
  }

  /** Inner extra initialization */
  protected _init() {}

  /** Add destroyable actions */
  protected addDestroyableAction(action: () => void) {
    this._destroyableActions.push(action);
  }

  /**
   * Add a viewport callback that will be removed on class destroy
   */
  public addViewportCallback(
    target: Parameters<TViewportAdd>[0],
    action: Parameters<TViewportAdd>[1],
    data: Parameters<TViewportAdd>[2] = {},
  ) {
    const callback = this._app.viewport.add(target, action, {
      ...data,
      name: this.constructor.name,
    });

    this.addDestroyableAction(() => callback.remove());
  }

  /** Add a module callback */
  public addCallback<T extends keyof CallbacksTypes>(
    target: T,
    action: NCallbacks.TAction<CallbacksTypes[T]>,
    settings: NCallbacks.ISettings = {},
  ) {
    return this.callbacks.add(target, action, settings);
  }

  /** Add a DOM event listener */
  public addEventListener<
    El extends ListenerElement,
    Target extends keyof HTMLElementEventMap,
    Callback extends (evt: HTMLElementEventMap[Target]) => void,
  >(
    el: El,
    target: Target,
    callback: Callback,
    options?: IAddEventListenerOptions,
  ): IAddEventListener {
    const listener = addEventListener(el, target, callback, options);
    this._listeners.push(listener);

    return {
      ...listener,
      remove: () => {
        this._listeners = this._listeners.filter(
          (item) => item.id !== listener.id,
        );

        return listener.remove();
      },
    };
  }

  protected className(...classNames: string[]) {
    return classNames.map((value) => `${this.prefix}${value}`).join(' ');
  }

  /** Toggle classList */
  protected toggleClassName(
    element: Element,
    className: string,
    isActive: boolean,
  ) {
    const isAlreadyExists = element.classList.contains(className);

    element.classList.toggle(className, isActive);

    if (!isAlreadyExists) {
      this._classNamesToRemove.push({ element, className });
    }
  }

  /** Destroy the module */
  public destroy() {
    if (this.isDestroyed) {
      return;
    }

    this._destroy();
  }

  /** Destroy the module */
  protected _destroy() {
    this._callbacks.tbt('destroy', undefined);
    this._callbacks.destroy();

    this._mutableProps.destroy();

    this._destroyableActions.forEach((action) => action());
    this._listeners.forEach((listener) => listener.remove());

    this._classNamesToRemove.forEach(({ element, className }) =>
      element.classList.remove(className),
    );

    this._isDestroyed = true;
  }
}
