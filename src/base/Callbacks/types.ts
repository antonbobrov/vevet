/**
 * todo
 */
export interface ICallbacksProps<Ctx> {
  ctx?: Ctx;
}

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
 */
export type TCallbacksAction<Parameter, Ctx> = Parameter extends undefined
  ? (data: undefined, ctx: Ctx) => void
  : (data: Parameter, ctx: Ctx) => void;

/**
 * Represents a registered callback with its settings and metadata.
 */
export interface ICallback<Types, Ctx> extends ICallbacksSettings {
  /** Unique identifier for the callback. */
  id: string;

  /** Event name associated with the callback. */
  target: keyof Types;

  /** Callback function to execute. */
  action: TCallbacksAction<Types[keyof Types], Ctx>;
}
