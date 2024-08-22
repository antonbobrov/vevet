import { NCallbacks } from '../Callbacks/types';

export namespace NModule {
  /**
   * Mutable Properties (may change on window resize or through {@linkcode Module.changeProps})
   */
  export interface IChangeableProps {
    __fixHelperChangeableProps?: any;
  }

  /** Static properties */
  export interface IStaticProps {
    __fixHelperStaticProps?: any;
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
