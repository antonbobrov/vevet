import { uid, normalizedTimeoutCallback } from '@/utils/common';
import { NCallbacks } from './types';

export type { NCallbacks };

/**
 * This class is responsible for adding, removing, and executing callbacks of different kinds.
 */
export class Callbacks<Types extends NCallbacks.ITypes = NCallbacks.ITypes> {
  /** List of callbacks */
  private _callbacks: NCallbacks.ICallback<Types>[];

  /** List of callbacks */
  get callbacks() {
    return this._callbacks;
  }

  /**
   * @example
   *
   * interface ICallbacks {
   *   onAdd: undefined;
   *   onDelete: undefined;
   * }
   *
   * const callbacks = new Callbacks<ICallbacks>();
   *
   * callbacks.add('onAdd', () => console.log('callback on add #1'));
   *
   * const addCallback2 = callbacks.add('onAdd', () =>
   *   console.log('callback on add #2'),
   * );
   *
   * const addCallback3 = callbacks.add(
   *   'onAdd',
   *   () => console.log('callback on add #3'),
   *   { isProtected: true },
   * );
   *
   * callbacks.add('onDelete', () => console.log('callback on delete'));
   *
   * console.log('--- All callbacks by the target "onAdd" will be executed:');
   * callbacks.tbt('onAdd', undefined);
   *
   * console.log('--- addCallback2 will be removed:');
   * addCallback2.remove();
   * callbacks.tbt('onAdd', undefined);
   * console.log('---');
   *
   * console.log('--- addCallback3 cannot be removed because it is protected:');
   * addCallback3.remove();
   * callbacks.tbt('onAdd', undefined);
   * console.log('---');
   *
   * console.log('--- Execute all callbacks by the target "onDelete":');
   * callbacks.tbt('onDelete', undefined);
   */
  constructor() {
    this._callbacks = [];
  }

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

    return {
      id,
      remove: () => this.remove(id),
    };
  }

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

      isRemoved = true;

      return false;
    });

    return isRemoved;
  }

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
  }

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
