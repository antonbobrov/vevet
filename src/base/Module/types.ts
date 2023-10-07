import { NCallbacks } from '../Callbacks/types';

export namespace NModule {
  /**
   * Mutable Properties (may change on window resize or through {@linkcode Module.changeProps})
   */
  export interface IChangeableProps {}

  /** Static properties */
  export interface IStaticProps {
    /** Parent module */
    parent?: any;
  }

  /** Available callbacks */
  export interface ICallbacksTypes extends NCallbacks.ITypes {
    destroy: undefined;
    propsChange: undefined;
    propsMutate: undefined;
  }

  export interface IClassNamesToRemove {
    element: Element;
    className: string;
  }
}
