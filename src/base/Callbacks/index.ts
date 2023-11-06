import { uid, normalizedTimeoutCallback } from '@/utils/common';
import { NCallbacks } from './types';

export type { NCallbacks };

/**
 * A set of callbacks
 */
export class Callbacks<Types extends NCallbacks.ITypes = NCallbacks.ITypes> {
  /** Vevet Application */
  private _app: typeof window.vevetApp;

  /** Vevet Application */
  get app() {
    return this._app;
  }

  /** List of callbacks */
  private _callbacks: NCallbacks.ICallback<Types>[];

  /** List of callbacks */
  get callbacks() {
    return this._callbacks;
  }

  /**
   * @param canInit - Defines if you need to call {@linkcode Callbacks._init} at the constructor's end.
   * If no, you will have to call {@linkcode Callbacks._init} manually.
   *
   * @example
   * 
   * interface ITypes {
   *   render: { fps: number };
   *   empty: undefined;
   * }

   * const callbacks = new Callbacks<ITypes>();

   * callbacks.add('render', ({ fps }) => console.log(fps));

   * callbacks.add('empty', () => {}, {
   *   timeout: 50,
   * });
   */
  constructor(canInit = true) {
    this._app = window.vevetApp;
    this._callbacks = [];

    if (canInit) {
      this._init();
    }
  }

  /** Initialize the class */
  protected _init() {}

  /**
   * Adds a callback
   *
   * @param target - Callback target name
   * @param action - Callback function
   * @param settings - Callback settings
   */
  public add<T extends keyof Types>(
    target: T,
    action: NCallbacks.TAction<Types[T]>,
    settings: NCallbacks.ISettings = {},
  ): NCallbacks.IAddedCallback {
    const id = uid('callback');

    this._callbacks.push({
      id,
      isEnabled: true,
      target,
      action: action as any,
      ...settings,
    });

    this._onAdd(id);

    return {
      id,
      remove: () => this.remove(id),
    };
  }

  /**
   * Use it to implement some actions after adding a callback
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onAdd(id: string) {}

  /** Remove a callback */
  public remove(callbackId: string) {
    return this._remove(callbackId);
  }

  /** Remove a callback */
  private _remove(callbackId: string, canRemoveProtected = false): boolean {
    let isRemoved = false;

    this._callbacks = this._callbacks.filter(({ id, isProtected }) => {
      if (id !== callbackId) {
        return true;
      }

      if (isProtected && !canRemoveProtected) {
        return true;
      }

      this._onRemove(id);
      isRemoved = true;

      return false;
    });

    return isRemoved;
  }

  /**
   * Use it to implement some actions after removing a callback
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onRemove(id: string) {}

  /** Remove all callbacks */
  private _removeAll() {
    while (this._callbacks.length > 0) {
      this._remove(this._callbacks[0].id, true);
    }
  }

  /** Enable/disable a callback */
  public turn(id: string, isEnabled = true) {
    const callback = this.get(id);

    if (!callback) {
      return;
    }

    callback.isEnabled = isEnabled;
    this._onTurn(id);
  }

  /**
   * Use it to implement some actions after enabling or disabling a callback.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onTurn(id: string) {}

  /** Get a callback by id */
  public get(callbackId: string): undefined | NCallbacks.ICallback<Types> {
    const callbacks = this._callbacks.filter(({ id }) => id === callbackId);

    return callbacks[0] || undefined;
  }

  /**
   * Launch callback action. It will work only if the callback is enabled
   */
  private _callAction(
    { id, isEnabled, timeout, isOnce, action }: NCallbacks.ICallback<Types>,
    parameter: Types[keyof Types],
  ) {
    if (!isEnabled) {
      return;
    }

    normalizedTimeoutCallback(() => action(parameter as any), timeout ?? 0);

    if (isOnce) {
      this._remove(id, true);
    }
  }

  /**
   * Trigger by target.
   * Trigger all enabled callbacks under a certain target name.
   */
  public tbt<T extends keyof Types>(target: T, arg: Types[T]) {
    this._callbacks.forEach((callback) => {
      if (callback.target === target) {
        this._callAction(callback, arg);
      }
    });
  }

  /** Destroy the callbacks */
  public destroy() {
    this._removeAll();
  }
}
