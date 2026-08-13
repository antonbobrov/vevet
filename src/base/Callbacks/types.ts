/**
 * Constructor options for {@link Callbacks}.
 *
 * @typeParam Ctx - Context passed as the second argument to every callback.
 */
export interface ICallbacksProps<Ctx> {
  /**
   * Context instance forwarded to callback listeners as the second argument.
   */
  ctx?: Ctx;
}

/**
 * Maps event names to their callback payload types.
 *
 * Extend this interface to map event names to payload types.
 * Use `undefined` for events without a payload.
 */
export interface ICallbacksMap {}

/**
 * Optional settings applied when registering a callback.
 */
export interface ICallbacksSettings {
  /**
   * Optional label for debugging.
   */
  name?: string;

  /**
   * Delay before the callback runs, in milliseconds.
   * @default undefined
   */
  timeout?: number;

  /**
   * When `true`, the callback cannot be removed via {@link Callbacks.remove}
   * unless it is cleared internally (for example on {@link Callbacks.destroy}).
   * @default false
   */
  protected?: boolean;

  /**
   * When `true`, the callback is removed automatically after the first execution.
   * @default false
   */
  once?: boolean;
}

/**
 * Callback listener signature.
 *
 * If the event payload is `undefined`, the `data` argument is still passed
 * explicitly so listeners share a consistent arity.
 *
 * @typeParam Parameter - Event payload type from the callbacks map.
 * @typeParam Ctx - Context type from {@link ICallbacksProps}.
 */
export type TCallbacksAction<Parameter, Ctx> = Parameter extends undefined
  ? (data: undefined, ctx: Ctx) => void
  : (data: Parameter, ctx: Ctx) => void;

/**
 * A registered callback entry stored in {@link Callbacks.list}.
 *
 * @typeParam Types - Event map.
 * @typeParam Ctx - Context type passed to the listener.
 */
export interface ICallback<Types, Ctx> extends ICallbacksSettings {
  /**
   * Unique callback identifier.
   */
  id: string;

  /**
   * Event name this listener is bound to.
   */
  target: keyof Types;

  /**
   * Listener function executed on {@link Callbacks.emit}.
   */
  action: TCallbacksAction<Types[keyof Types], Ctx>;
}
