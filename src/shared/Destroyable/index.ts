/**
 * Base class with a destroy lifecycle and registered cleanup actions.
 *
 * Subclasses override {@link _destroy} to release internal resources.
 * Consumers register teardown logic with {@link onDestroy}.
 *
 * Used by {@link Module}, {@link Callbacks}, {@link Responsive}, and other
 * long-lived instances that must be explicitly disposed.
 */
export class Destroyable {
  /** Whether {@link destroy} has already been called. */
  private _isDestroyed = false;

  /** Cleanup actions registered via {@link onDestroy}. */
  private _destroyable: (() => void)[] = [];

  /**
   * Indicates whether the instance has been destroyed.
   *
   * After destruction, {@link destroy} is a no-op.
   */
  get isDestroyed() {
    return this._isDestroyed;
  }

  /**
   * Subclass hook for internal cleanup.
   *
   * Called at the start of {@link destroy}, before registered
   * {@link onDestroy} actions run.
   */
  protected _destroy() {}

  /**
   * Destroys the instance and runs all registered cleanup actions.
   *
   * Safe to call multiple times; subsequent calls are ignored.
   *
   * Execution order:
   * 1. {@link _destroy}
   * 2. all {@link onDestroy} callbacks, in registration order
   * 3. `isDestroyed` is set to `true`
   */
  public destroy() {
    if (this._isDestroyed) {
      return;
    }

    this._destroy();

    this._destroyable.forEach((fn) => fn());
    this._isDestroyed = true;
  }

  /**
   * Registers a function to run when the instance is destroyed.
   *
   * If the instance is already destroyed, `action` runs immediately.
   *
   * @param action - Cleanup function (for example remove listeners or DOM classes).
   */
  protected onDestroy(action: () => void) {
    if (this.isDestroyed) {
      action();
    } else {
      this._destroyable.push(action);
    }
  }
}
