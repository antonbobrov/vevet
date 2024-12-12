import { uid, normalizedTimeoutCallback } from '@/utils/common';
import { NCallbacks } from './types';

export type { NCallbacks };

/**
 * Manages the registration and execution of callbacks for specific event types.
 * Supports adding, removing, and triggering callbacks, with optional features such as protected callbacks,
 * one-time execution, and execution delays.
 */
export class Callbacks<Types extends NCallbacks.ITypes = NCallbacks.ITypes> {
  /**
   * Internal storage for registered callbacks.
   */
  private _list: NCallbacks.ICallback<Types>[];

  /**
   * Returns an array of currently registered callbacks.
   */
  get list() {
    return this._list;
  }

  /**
   * Initializes a new `Callbacks` instance with an empty list of callbacks.
   *
   * @example
   *
   * interface ICallbacks {
   *   onAdd: undefined;
   *   onDelete: undefined;
   * }
   *
   * const callbacks = new Callbacks<ICallbacks>();
   *
   * callbacks.add('onAdd', () => console.log('Callback for add'));
   * callbacks.add('onDelete', () => console.log('Callback for delete'));
   *
   * callbacks.tbt('onAdd', undefined); // Trigger all "onAdd" callbacks
   * callbacks.tbt('onDelete', undefined); // Trigger all "onDelete" callbacks
   */
  constructor() {
    this._list = [];
  }

  /**
   * Registers a new callback for a specific target event.
   *
   * @param target - The event name or target to associate the callback with.
   * @param action - The function to be executed when the event is triggered.
   * @param [settings={}] - Additional settings, such as whether the callback is protected or should execute only once.
   *
   * @example
   * const callback = callbacks.add('onAdd', () => console.log('Callback added'));
   * callback.remove(); // Removes this specific callback
   */
  public add<T extends keyof Types>(
    target: T,
    action: NCallbacks.TAction<Types[T]>,
    settings: NCallbacks.ISettings = {},
  ) {
    const id = uid('callback');

    this._list.push({
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

  /**
   * Registers a new callback for a specific target event and returns a destructor.
   *
   * @param target - The event name or target to associate the callback with.
   * @param action - The function to be executed when the event is triggered.
   * @param [settings={}] - Additional settings, such as whether the callback is protected or should execute only once.
   *
   * @example
   * const callback = callbacks.on('onAdd', () => console.log('Callback added'));
   * callback(); // Removes the callback
   */
  public on<T extends keyof Types>(
    target: T,
    action: NCallbacks.TAction<Types[T]>,
    settings: NCallbacks.ISettings = {},
  ) {
    const callback = this.add(target, action, settings);

    return () => {
      callback.remove();
    };
  }

  /**
   * Removes a callback by its unique ID.
   *
   * @param id - The unique identifier of the callback to remove.
   * @returns {boolean} `true` if the callback was successfully removed; `false` otherwise.
   */
  public remove(id: string) {
    return this._remove(id);
  }

  /**
   * Removes a callback from the list, with an option to force removal even if it's protected.
   *
   * @param callbackId - The unique identifier of the callback to remove.
   * @param canRemoveProtected - If `true`, will forcibly remove protected callbacks.
   * @returns {boolean} `true` if the callback was successfully removed; `false` otherwise.
   */
  private _remove(callbackId: string, canRemoveProtected = false): boolean {
    let isRemoved = false;

    this._list = this._list.filter(({ id, isProtected }) => {
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

  /**
   * Removes all registered callbacks, including protected ones.
   */
  private _removeAll() {
    while (this._list.length > 0) {
      this._remove(this._list[0].id, true);
    }
  }

  /**
   * Enables or disables a callback by its ID.
   *
   * @param id - The unique identifier of the callback.
   * @param isEnabled - Set to `false` to disable the callback; `true` to enable it.
   */
  public turn(id: string, isEnabled: boolean) {
    const callback = this.get(id);

    if (!callback) {
      return;
    }

    callback.isEnabled = isEnabled;
  }

  /**
   * Retrieves a callback by its ID.
   *
   * @param callbackId - The unique identifier of the callback.
   * @returns The matching callback, or `undefined` if not found.
   */
  public get(callbackId: string): NCallbacks.ICallback<Types> | undefined {
    return this._list.find(({ id }) => id === callbackId);
  }

  /**
   * Executes the action of a callback if it is enabled, optionally removing it if it's set to execute only once.
   *
   * @param callback - The callback to execute.
   * @param parameter - The parameter to pass to the callback function.
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
   * Triggers all callbacks associated with the specified target.
   *
   * @param target - The target event name for which callbacks should be executed.
   * @param arg - The argument to pass to each callback.
   *
   * @example
   * callbacks.tbt('onAdd', undefined); // Trigger all "onAdd" callbacks
   */
  public tbt<T extends keyof Types>(target: T, arg: Types[T]) {
    this._list.forEach((callback) => {
      if (callback.target === target) {
        this._callAction(callback, arg);
      }
    });
  }

  /**
   * Removes all registered callbacks and cleans up internal data.
   */
  public destroy() {
    this._removeAll();
  }
}
