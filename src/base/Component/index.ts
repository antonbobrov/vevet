import { Module } from '../Module';
import { Plugin } from '../Plugin';
import { NComponent } from './types';

export type { NComponent };

/**
 * A class for Components.
 */
export class Component<
  StaticProps extends NComponent.IStaticProps = NComponent.IStaticProps,
  ChangeableProps extends
    NComponent.IChangeableProps = NComponent.IChangeableProps,
  CallbacksTypes extends
    NComponent.ICallbacksTypes = NComponent.ICallbacksTypes,
> extends Module<StaticProps, ChangeableProps, CallbacksTypes> {
  /** Inner plugins */
  private _plugins?: Plugin[];

  /** Add a single plugin */
  public addPlugin<T extends Plugin<any, any, any, any>>(plugin: T) {
    if (typeof this._plugins === 'undefined') {
      this._plugins = [];
    }

    this._plugins.push(plugin);

    // eslint-disable-next-line no-param-reassign
    plugin.component = this;
    plugin.init();
  }

  /** Destroy all plugins */
  private _destroyPlugins() {
    this._plugins?.forEach((plugin) => plugin.destroy());
  }

  /** Destroy the component */
  protected _destroy() {
    super._destroy();

    this._destroyPlugins();
  }
}
