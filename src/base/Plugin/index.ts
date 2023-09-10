import { Module } from '../Module';
import { NPlugin } from './types';

export type { NPlugin };

/**
 * A class for Plugins.
 */
export abstract class Plugin<
  StaticProps extends NPlugin.IStaticProps = NPlugin.IStaticProps,
  ChangeableProps extends NPlugin.IChangeableProps = NPlugin.IChangeableProps,
  CallbacksTypes extends NPlugin.ICallbacksTypes = NPlugin.ICallbacksTypes,
  Component = any
> extends Module<StaticProps, ChangeableProps, CallbacksTypes> {
  constructor(initialProps?: StaticProps & ChangeableProps) {
    super(initialProps, false);
  }

  private _component!: Component;

  get component() {
    return this._component;
  }

  set component(value) {
    this._component = value;
  }

  public init() {
    if (!this.component) {
      throw new Error(
        'Component is unknown. Be sure that `plugin.component` is non-nullable.'
      );
    }

    super.init();
  }
}
