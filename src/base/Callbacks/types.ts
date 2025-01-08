/**
 * Maps event types to their callback parameter types.
 */
export interface ICallbacksMap {}

/**
 * Configurable settings for a callback.
 */
export interface ICallbacksSettings {
  /** Optional name for debugging. */
  name?: string;

  /** Execution delay in milliseconds; `undefined` means no timeout. */
  timeout?: number;

  /** Marks the callback as protected, preventing its removal. */
  protected?: boolean;

  /** Removes the callback after its first execution. */
  once?: boolean;
}

/**
 * Defines a callback function's signature.
 * - If `Parameter` is `undefined`, the callback takes no arguments.
 * - Otherwise, it takes a single argument of type `Parameter`.
 */
export type TCallbacksAction<Parameter> = Parameter extends undefined
  ? () => void
  : (arg: Parameter) => void;

/**
 * Represents a registered callback with its settings and metadata.
 */
export interface ICallback<Types> extends ICallbacksSettings {
  /** Unique identifier for the callback. */
  id: string;

  /** Event name associated with the callback. */
  target: keyof Types;

  /** Callback function to execute. */
  action: TCallbacksAction<Types[keyof Types]>;
}
