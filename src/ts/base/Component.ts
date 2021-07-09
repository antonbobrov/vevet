import { Module, NModule } from './Module';



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



}
