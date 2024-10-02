import { NCallbacks } from '../Callbacks/types';

export namespace NModule {
  /**
   * Interface representing the properties that can change dynamically.
   * These properties may be updated during window resize events or through
   * the {@linkcode Module.changeProps} method.
   */
  export interface IChangeableProps {
    __fixHelperChangeableProps?: any;
  }

  /**
   * Interface representing static properties that remain constant and do not change
   * after initialization.
   */
  export interface IStaticProps {
    __fixHelperStaticProps?: any;
  }

  /**
   * Defines the available callback types for the module.
   * These callbacks allow interaction with specific module events.
   */
  export interface ICallbacksTypes extends NCallbacks.ITypes {
    /**
     * Triggered when the module is destroyed.
     */
    destroy: undefined;

    /**
     * Triggered when module properties are manually changed.
     */
    propsChange: undefined;

    /**
     * Triggered when module properties mutate due to responsive settings or other updates.
     */
    propsMutate: undefined;
  }

  /**
   * Represents the class names to be removed from an element when the module is destroyed.
   */
  export interface IClassNamesToRemove {
    /**
     * The DOM element from which the class name should be removed.
     */
    element: Element;

    /**
     * The class name that should be removed from the element.
     */
    className: string;
  }
}
