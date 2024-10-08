import { NModule } from '../Module/types';

export namespace NComponent {
  /**
   * Static properties for a component.
   * These properties remain constant throughout the lifecycle of the component.
   * This interface extends {@link NModule.IStaticProps}, inheriting the static properties defined for modules.
   */
  export interface IStaticProps extends NModule.IStaticProps {}

  /**
   * Changeable properties for a component.
   * These properties may change during the component's lifecycle, such as in response to window resizing or user actions.
   * This interface extends {@link NModule.IChangeableProps}, inheriting the mutable properties defined for modules.
   */
  export interface IChangeableProps extends NModule.IChangeableProps {}

  /**
   * Available callback types for a component.
   * These callbacks allow external interaction with the component's lifecycle events.
   * This interface extends {@link NModule.ICallbacksTypes}, inheriting the callbacks defined for modules.
   */
  export interface ICallbacksTypes extends NModule.ICallbacksTypes {}
}
