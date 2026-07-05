/**
 * Minimum parent contract required by {@link ModulePart}.
 *
 * Typically implemented by {@link Module} instances or internal helpers
 * that own props, callbacks, and a destroy lifecycle.
 *
 * @typeParam Props - Parent props type.
 * @typeParam Callbacks - Parent callbacks registry type.
 */
export interface IModulePartParent<Props, Callbacks> {
  /** Current parent properties. */
  readonly props: Props;

  /** CSS class name prefix from the parent module. */
  readonly prefix: string;

  /** Parent callbacks registry. */
  readonly callbacks: Callbacks;

  /**
   * Registers a cleanup action to run when the parent is destroyed.
   *
   * @param action - Cleanup function.
   */
  onDestroy(action: () => void): void;
}
