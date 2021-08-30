import { Module, NModule } from './Module';



export namespace NPlugin {

    /**
     * Static properties
     */
    export interface StaticProp {}

    /**
     * Changeable Properties
     */
    export interface ChangeableProp {}

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NModule.CallbacksTypes {}

}



/**
 * A class for Plugins.
 */
export abstract class Plugin<
    StaticProp extends NPlugin.StaticProp = NPlugin.StaticProp,
    ChangeableProp extends NPlugin.ChangeableProp = NPlugin.ChangeableProp,
    CallbacksTypes extends NPlugin.CallbacksTypes = NPlugin.CallbacksTypes,
    Component = any
> extends Module <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    constructor (
        initialProp: (StaticProp & ChangeableProp) = {} as (StaticProp & ChangeableProp),
    ) {
        super(initialProp, false);
    }



    protected _component!: Component;



    /**
     * Initializes the class
     */
    public init () {
        if (!this._component) {
            throw new Error('Component is not set. Be sure that initlugin is called before.');
        }
        super.init();
    }

    /**
     * Initialize the plugin
     */
    public initPlugin (
        parent: Component,
    ) {
        if (this._inited) {
            return;
        }
        this._component = parent;
        this.init();
    }
}
