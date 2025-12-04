import { uid } from '@/utils/common';
import {
  ICallback,
  ICallbacksSettings,
  ICallbacksMap,
  TCallbacksAction,
  ICallbacksProps,
} from './types';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';

export * from './types';

/**
 * Manages event callbacks with features like one-time execution, protection, and delays.
 *
 * @group Base
 */
export class Callbacks<
  Types extends ICallbacksMap = ICallbacksMap,
  Ctx extends any = any,
> {
  constructor(protected _props: ICallbacksProps<Ctx> = {}) {}

  /** Whether the instance has been destroyed. */
  private _isDestroyed = false;

  /** Storage for registered callbacks. */
  private _list: ICallback<Types, Ctx>[] = [];

  /** Returns the list of all registered callbacks. */
  get list() {
    return this._list;
  }

  /**
   * Registers a callback for an event.
   * @param target - Event name to associate the callback with.
   * @param action - Function to execute on the event.
   * @param settings - Optional callback settings (e.g., timeout, one-time).
   * @returns Callback ID and a removal function.
   */
  @noopIfDestroyed
  public add<T extends keyof Types>(
    target: T,
    action: TCallbacksAction<Types[T], Ctx>,
    settings: ICallbacksSettings = {},
  ) {
    const id = uid('callback');

    this._list.push({
      ...settings,
      id,
      target,
      action: action as any,
    });

    return { id, remove: () => this.remove(id) };
  }

  /**
   * Adds a callback and returns a destructor to remove it.
   * @param target - Event name to associate the callback with.
   * @param action - Function to execute on the event.
   * @param settings - Optional callback settings (e.g., timeout, one-time).
   * @returns A function to remove the callback.
   */
  @noopIfDestroyed
  public on<T extends keyof Types>(
    target: T,
    action: TCallbacksAction<Types[T], Ctx>,
    settings: ICallbacksSettings = {},
  ) {
    const callback = this.add(target, action, settings);

    return () => {
      callback.remove();
    };
  }

  /**
   * Removes a callback by its ID.
   * @param id - ID of the callback to remove.
   * @returns `true` if the callback was removed, `false` otherwise.
   */
  @noopIfDestroyed
  public remove(id: string) {
    return this._remove(id);
  }

  /**
   * Removes a callback, with an option to force removal of protected callbacks.
   * @param callbackId - ID of the callback to remove.
   * @param canRemoveProtected - Whether to forcibly remove protected callbacks.
   * @returns `true` if the callback was removed, `false` otherwise.
   */
  private _remove(callbackId: string, canRemoveProtected = false): boolean {
    this._list = this._list.filter((callback) => {
      if (callback.id !== callbackId) {
        return true;
      }

      if (callback.protected && !canRemoveProtected) {
        return true;
      }

      return false;
    });

    const hasCallback = this._list.some(({ id }) => id === callbackId);

    return !hasCallback;
  }

  /** Removes all callbacks, including protected ones. */
  private _removeAll() {
    while (this._list.length > 0) {
      this._remove(this._list[0].id, true);
    }
  }

  /**
   * Executes a callback and removes it if marked as `isOnce`.
   * @param callback - Callback to execute.
   * @param parameter - Argument to pass to the callback.
   */
  private _callAction(
    { id, timeout, action, ...callback }: ICallback<Types, Ctx>,
    parameter: Types[keyof Types],
  ) {
    const { ctx } = this._props;

    if (timeout) {
      setTimeout(() => action(parameter as any, ctx as any), timeout);
    } else {
      action(parameter as any, ctx as any);
    }

    if (callback.once) {
      this._remove(id, true);
    }
  }

  /**
   * Triggers all callbacks for a given event.
   * @param target - Event name to trigger.
   * @param arg - Argument to pass to the callbacks.
   */
  @noopIfDestroyed
  public emit<T extends keyof Types>(target: T, arg: Types[T]) {
    this._list.forEach((callback) => {
      if (callback.target === target) {
        this._callAction(callback, arg);
      }
    });
  }

  /** Removes all registered callbacks. */
  @noopIfDestroyed
  public destroy() {
    this._removeAll();

    this._isDestroyed = true;
  }
}
