import { ICallbacksMap, TCallbacksAction } from '../Callbacks/types';

export interface IModuleStaticProps {
  __staticProp?: true;
}

export interface IModuleMutableProps {
  __mutableProp?: true;
}

export interface IModuleCallbacksMap<
  TM = Record<string, any>,
> extends ICallbacksMap {
  /**
   * Triggered when the module is destroyed.
   */
  destroy: undefined;

  /**
   * Triggered when the module's properties are updated.
   * Receives the diff (changed keys and new values) as the first argument.
   */
  props: Partial<TM>;
}

type TModuleOnCallbacksProps<T, Ctx> = Partial<{
  [K in keyof T as `on${Capitalize<string & K>}`]: TCallbacksAction<T[K], Ctx>;
}>;

export type TModuleProps<
  C extends IModuleCallbacksMap,
  S extends IModuleStaticProps,
  M extends IModuleMutableProps,
  Ctx,
> = S & M & TModuleOnCallbacksProps<C, Ctx>;
