import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { safeAction } from '@/internal/safeAction';
import { Destroyable } from '@/shared/Destroyable';
import { uid } from '@/utils/common';

import {
  ICallback,
  ICallbacksSettings,
  ICallbacksMap,
  TCallbacksAction,
  ICallbacksProps,
} from './types';

export * from './types';

/**
 * Typed event registry with support for one-time listeners, protected listeners,
 * and delayed execution.
 *
 * Used internally by {@link Module} and all components, but can also be
 * instantiated on its own.
 */
export class Callbacks<
  Types extends ICallbacksMap = ICallbacksMap,
  Ctx = any,
> extends Destroyable {
  constructor(private _props: ICallbacksProps<Ctx> = {}) {
    super();
  }

  /** Registered callback entries. */
  private _list: ICallback<Types, Ctx>[] = [];

  /**
   * Snapshot of all registered callbacks.
   *
   * Useful for debugging; do not mutate the returned array.
   */
  get list() {
    return this._list;
  }

  /**
   * Registers a callback and returns its id plus a removal function.
   *
   * Prefer {@link on} when you only need the destructor.
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
   * Registers a callback and returns a destructor function.
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
   * Removes a callback by id.
   *
   * Protected callbacks are skipped unless they are cleared internally
   * (for example on {@link destroy}).
   */
  @noopIfDestroyed
  public remove(id: string) {
    return this._remove(id);
  }

  /** @internal */
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

  /** @internal */
  private _clear() {
    while (this._list.length > 0) {
      this._remove(this._list[0].id, true);
    }
  }

  /**
   * Executes a single callback entry.
   *
   * Respects `timeout` and removes the entry when `once` is set.
   *
   * @internal
   */
  private _action(
    { id, timeout, action, ...callback }: ICallback<Types, Ctx>,
    parameter: Types[keyof Types],
  ) {
    const { ctx } = this._props;

    if (timeout) {
      setTimeout(
        () => safeAction(() => action(parameter as any, ctx as any)),
        timeout,
      );
    } else {
      safeAction(() => action(parameter as any, ctx as any));
    }

    if (callback.once) {
      this._remove(id, true);
    }
  }

  /**
   * Invokes all listeners registered for the given event.
   *
   * @param target - Event name.
   * @param arg - Payload passed as the first argument to each listener.
   */
  @noopIfDestroyed
  public emit<T extends keyof Types>(target: T, arg: Types[T]) {
    this._list.forEach((callback) => {
      if (callback.target === target) {
        this._action(callback, arg);
      }
    });
  }

  /** Clears all registered callbacks. */
  protected _destroy() {
    super._destroy();
    this._clear();
  }
}
