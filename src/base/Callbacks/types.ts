export namespace NCallbacks {
  /**
   * Represents a mapping of event types to their callback parameter types.
   * Each key in this interface corresponds to an event name, and its value
   * represents the type of argument passed to that event's callback.
   */
  export interface ITypes {}

  /**
   * Settings that can be applied to a callback, such as timeout, protection status, and one-time execution.
   */
  export interface ISettings {
    /**
     * The name of the callback.
     */
    name?: string | undefined;

    /**
     * The timeout (in milliseconds) before the callback is executed.
     * A value of `undefined` means no timeout.
     */
    timeout?: number | undefined;

    /**
     * If `true`, the callback is protected and cannot be removed by standard removal methods.
     */
    isProtected?: boolean | undefined;

    /**
     * If `true`, the callback will automatically be removed after it is called once.
     */
    isOnce?: boolean | undefined;
  }

  /**
   * Defines the function signature for a callback action.
   * - If the parameter type is `undefined`, the callback takes no arguments.
   * - Otherwise, the callback takes a single argument of the specified parameter type.
   */
  export type TAction<Parameter> = Parameter extends undefined
    ? () => void
    : (arg: Parameter) => void;

  /**
   * Full data for a registered callback, including its settings and unique information such as ID and target.
   */
  export interface ICallback<Types> extends ISettings {
    /**
     * The unique identifier of the callback.
     */
    id: string;

    /**
     * Indicates whether the callback is enabled. If `false`, the callback will not be executed.
     */
    isEnabled: boolean;

    /**
     * The target event or event name for which the callback is registered.
     */
    target: keyof Types;

    /**
     * The actual callback function to be executed.
     */
    action: TAction<Types[keyof Types]>;
  }

  /**
   * An interface representing an added callback, with methods to manage it.
   */
  export interface IAddCallback {
    /**
     * The unique identifier of the callback.
     */
    id: string;

    /**
     * Removes the callback from the registered list.
     */
    remove: () => void;
  }
}
