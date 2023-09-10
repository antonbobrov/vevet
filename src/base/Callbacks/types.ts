import { IRemovable } from '@/types/general';

export namespace NCallbacks {
  /** Callbacks types */
  export interface ITypes {}

  /** Callback settings */
  export interface ISettings {
    /** Callback name */
    name?: string | undefined;
    /**  Callback timeout (in ms) */
    timeout?: number | undefined;
    /** If true, the callback can't be removed */
    isProtected?: boolean | undefined;
    /** If true, the callback is to be removed after it is called */
    isOnce?: boolean | undefined;
  }

  /**
   * Callback action
   */
  export type TAction<Parameter> = Parameter extends undefined
    ? () => void
    : (arg: Parameter) => void;

  /**
   * Callback full data
   */
  export interface ICallback<Types> extends ISettings {
    /** Callback ID */
    id: string;
    /** Defines if the callback is enabled */
    isEnabled: boolean;
    /** Callback target */
    target: keyof Types;
    /** Callback itself */
    action: TAction<Types[keyof Types]>;
  }

  export interface IAddedCallback extends IRemovable {
    /** Callback ID */
    id: string;
    /** Remove the callback */
    remove: () => void;
  }
}
