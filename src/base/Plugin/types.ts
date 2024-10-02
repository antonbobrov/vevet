import { NModule } from '../Module/types';

export namespace NPlugin {
  /**
   * Static properties for plugins. These properties remain constant throughout the lifecycle of the plugin.
   */
  export interface IStaticProps extends NModule.IStaticProps {}

  /**
   * Changeable properties for plugins. These properties can change dynamically during the lifecycle of the plugin.
   * Extends from {@link NModule.IChangeableProps}, providing plugins with the ability to update their properties over time.
   */
  export interface IChangeableProps extends NModule.IChangeableProps {}

  /**
   * Defines the available callback types for plugins. These callbacks allow plugins to respond to lifecycle events or property changes.
   * Extends from {@link NModule.ICallbacksTypes}, meaning that plugins share the same callback structure as modules.
   */
  export interface ICallbacksTypes extends NModule.ICallbacksTypes {}
}
