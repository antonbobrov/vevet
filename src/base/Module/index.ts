import { initVevet } from '@/global/initVevet';
import {
  mergeWithNoUndefined,
  noopIfDestroyed,
  Destroyable,
  TRequiredProps,
} from '@/internal';

import { Callbacks } from '../Callbacks';
import { ICallbacksSettings, TCallbacksAction } from '../Callbacks/types';

import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from './types';

/**
 * A base class for modules that handle responsive properties, event listeners, and custom callbacks.
 *
 * @group Base
 */
export class Module<
  CallbacksMap extends IModuleCallbacksMap = IModuleCallbacksMap,
  StaticProps extends IModuleStaticProps = IModuleStaticProps,
  MutableProps extends IModuleMutableProps = IModuleMutableProps,
> extends Destroyable {
  /** Get default static props */
  public _getStatic(): TRequiredProps<StaticProps> {
    return { __staticProp: true } as TRequiredProps<StaticProps>;
  }

  /** Set default mutable props */
  public _getMutable(): TRequiredProps<MutableProps> {
    return { __mutableProp: true } as TRequiredProps<MutableProps>;
  }

  /** Current properties */
  private _props: TRequiredProps<MutableProps & StaticProps>;

  /** Callbacks instance */
  private _callbacks: Callbacks<CallbacksMap, this>;

  /**
   * Current properties. Do not mutate these directly, use {@linkcode updateProps} instead.
   */
  get props() {
    return this._props;
  }

  /** Optional prefix for classnames used by the module */
  get prefix() {
    return initVevet().prefix;
  }

  /** The name of the module, derived from the class name */
  get name() {
    return this.constructor.name;
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
  constructor(props?: StaticProps & MutableProps) {
    super();

    this._callbacks = new Callbacks({ ctx: this });

    this._props = mergeWithNoUndefined(
      {
        ...this._getStatic(),
        ...this._getMutable(),
      },
      { ...props },
    ) as TRequiredProps<MutableProps & StaticProps>;

    // Initialize callbacks

    if (props) {
      const callbacksProps = Object.keys(props).filter(
        (key) =>
          key.startsWith('on') &&
          typeof props[key as keyof typeof props] === 'function',
      );

      callbacksProps.forEach((key) => {
        let target = key.slice(2);
        target = target.charAt(0).toLowerCase() + target.slice(1);
        this._callbacks.on(
          target as keyof CallbacksMap,
          props[key as keyof typeof props] as any,
        );
      });
    }
  }

  /**
   * Emits a callback event with a fixed payload.
   */
  protected _emit<E extends keyof CallbacksMap>(
    event: E,
    arg: CallbacksMap[E],
  ) {
    return this.callbacks.emit(event, arg);
  }

  /**
   * Method that is called when the module's properties mutate. In most cases, used to handle callbacks.
   */
  protected _handleProps(diff: Partial<MutableProps>) {
    this.callbacks.emit('props', diff);
  }

  /**
   * Builds one or more prefixed class names.
   *
   * @param classes - Unprefixed class name segments.
   * @returns Space-separated prefixed class string.
   */
  protected _cn(...classes: string[]) {
    return classes.map((value) => `${this.prefix}${value}`).join(' ');
  }

  /**
   * Adds prefixed classes to an element and removes them on destroy.
   *
   * Skips classes that are already present on the element.
   *
   * @param element - Target DOM element.
   * @param classes - Unprefixed class name segments.
   */
  protected _addTempClassName(element: Element, ...classes: string[]) {
    const nextClassNames = classes.filter(
      (name) => !element.classList.contains(this._cn(name)),
    );

    nextClassNames.forEach((name) => {
      element.classList.add(this._cn(name));
    });

    this.onDestroy(() => {
      nextClassNames.forEach((name) => {
        element.classList.remove(this._cn(name));
      });
    });
  }

  /** Change module's mutable properties */
  @noopIfDestroyed
  public updateProps(props: Partial<MutableProps>) {
    const prevProps = { ...this._props };
    const keys = Object.keys(this.props) as (keyof MutableProps)[];

    this._props = {
      ...this._props,
      ...props,
    };

    const diff: Partial<MutableProps> = {};

    keys.forEach((key) => {
      // @ts-ignore
      const prevValue = prevProps[key];
      // @ts-ignore
      const newValue = this._props[key];

      if (prevValue !== newValue) {
        diff[key] = newValue;
      }
    });

    this._handleProps(diff);
  }

  /**
   * Adds a custom callback to the module.
   *
   * @param target - The event type to listen for (e.g., 'props', 'destroy').
   * @param listener - The function to execute when the event is triggered.
   * @param settings - Additional settings for the callback.
   */
  @noopIfDestroyed
  public on<T extends keyof CallbacksMap>(
    target: T,
    listener: TCallbacksAction<CallbacksMap[T], this>,
    settings: ICallbacksSettings = {},
  ) {
    return this.callbacks.on(target, listener, settings);
  }

  /**
   * Internal method to handle the destruction of the module.
   * It removes all callbacks, destroys properties, and cleans up event listeners and class names.
   */
  protected _destroy() {
    this._callbacks.emit('destroy', undefined);
    this._callbacks.destroy();
  }
}
