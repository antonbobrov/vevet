import { Module } from '../Module';
import { Plugin } from '../Plugin';
import { NComponent } from './types';

export type { NComponent };

/**
 * A class representing a component that extends the functionality of the {@link Module} class.
 * It allows for the addition of plugins, which can further extend or enhance the component's behavior.
 */
export class Component<
  StaticProps extends NComponent.IStaticProps = NComponent.IStaticProps,
  ChangeableProps extends
    NComponent.IChangeableProps = NComponent.IChangeableProps,
  CallbacksTypes extends
    NComponent.ICallbacksTypes = NComponent.ICallbacksTypes,
> extends Module<StaticProps, ChangeableProps, CallbacksTypes> {
  /**
   * Holds the list of inner plugins associated with the component.
   * Plugins can enhance the component's functionality.
   */
  private _plugins?: Plugin[];

  /**
   * Adds a plugin to the component. The plugin is initialized upon being added,
   * and the plugin's `component` property is set to the current component instance.
   *
   * @param plugin - An instance of the {@link Plugin} class to be added.
   */
  public addPlugin<T extends Plugin<any, any, any, any>>(plugin: T) {
    if (typeof this._plugins === 'undefined') {
      this._plugins = [];
    }

    this._plugins.push(plugin);

    // eslint-disable-next-line no-param-reassign
    plugin.component = this;
    plugin.init();
  }

  /**
   * Destroys all plugins associated with the component.
   * This ensures proper cleanup when the component is destroyed.
   */
  private _destroyPlugins() {
    this._plugins?.forEach((plugin) => plugin.destroy());
  }

  /**
   * Destroys the component, ensuring that all plugins are properly destroyed as well.
   */
  protected _destroy() {
    super._destroy();

    this._destroyPlugins();
  }
}
