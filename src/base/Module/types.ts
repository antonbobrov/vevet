import { ICallbacksMap } from '../Callbacks';

export interface IModuleStaticProps {
  __staticProp?: null;
}

export interface IModuleMutableProps {
  __mutableProp?: null;
}

export interface IModuleCallbacksMap extends ICallbacksMap {
  /**
   * Triggered when the module is destroyed.
   */
  destroy: undefined;

  /**
   * Triggered when the module's properties are updated.
   */
  props: undefined;
}

export type TModuleCallbacksProps<T> = Partial<{
  [K in keyof T as `on${Capitalize<string & K>}`]: (data: T[K]) => void;
}>;
