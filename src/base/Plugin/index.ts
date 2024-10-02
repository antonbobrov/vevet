import { Module } from '../Module';
import { NPlugin } from './types';

export type { NPlugin };

/**
 * A base abstract class for Plugins that extend the functionality of components.
 * A plugin is designed to attach to a component and modify or enhance its behavior.
 * It inherits from the {@link Module} class and adds functionality to work with a component.
 */
export abstract class Plugin<
  StaticProps extends NPlugin.IStaticProps = NPlugin.IStaticProps,
  ChangeableProps extends NPlugin.IChangeableProps = NPlugin.IChangeableProps,
  CallbacksTypes extends NPlugin.ICallbacksTypes = NPlugin.ICallbacksTypes,
  Component = any,
> extends Module<StaticProps, ChangeableProps, CallbacksTypes> {
  /**
   * Constructs the plugin.
   *
   * @param initialProps - Initial static and changeable properties for the plugin.
   */
  constructor(initialProps?: StaticProps & ChangeableProps) {
    super(initialProps, false);
  }

  /**
   * The component to which the plugin is attached.
   * This property must be set before initializing the plugin.
   */
  private _component!: Component;

  /**
   * Retrieves the component to which this plugin is attached.
   */
  get component() {
    return this._component;
  }

  /**
   * Sets the component for this plugin. This method is called by the parent component when the plugin is added.
   */
  set component(value) {
    this._component = value;
  }

  /**
   * Initializes the plugin and ensures it is properly associated with a component.
   * If the component is not set before calling `init`, it throws an error.
   *
   * @throws {Error} If `component` is not set.
   */
  public init() {
    if (!this.component) {
      throw new Error(
        'Component is unknown. Be sure that `plugin.component` is non-nullable.',
      );
    }

    super.init();
  }
}
