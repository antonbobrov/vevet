import { Module, NModule } from './Module';
import { Plugin } from './Plugin';



export namespace NComponent {

    /**
     * Static properties
     */
    export interface StaticProp extends NModule.StaticProp {}

    /**
     * Changeable Properties
     */
    export interface ChangeableProp extends NModule.ChangeableProp {}

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NModule.CallbacksTypes {}

}



/**
 * A class for Components.
 */
export class Component<
    /**
     * Static Properties (they never change)
     */
    StaticProp extends NComponent.StaticProp = NComponent.StaticProp,
    /**
     * Mutable Properties
     * (may change on window resize or through {@linkcode Component.changeProp})
     */
    ChangeableProp extends NComponent.ChangeableProp = NComponent.ChangeableProp,
    /**
     * Component Callbacks
     */
    CallbacksTypes extends NComponent.CallbacksTypes = NComponent.CallbacksTypes,
> extends Module <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    protected _plugins?: Plugin[];

    /**
     * Add a single plugin
     */
    public addPlugin (
        plugin: any,
    ) {
        if (typeof this._plugins === 'undefined') {
            this._plugins = [];
        }
        this._plugins.push(plugin);
        if (!plugin.inited) {
            plugin.initPlugin(this as any);
        }
    }

    /**
     * Destroy all plugins
     */
    protected _destroyPlugins () {
        if (this._plugins) {
            this._plugins.forEach((plugin) => {
                plugin.destroy();
            });
        }
    }



    protected _destroy () {
        super._destroy();
        this._destroyPlugins();
    }
}
