import {
    addEventListener,
} from 'vevet-dom';
import { Dragger, NDragger } from './Dragger';



export namespace NDraggerMove {

    /**
     * Static properties
     */
    export interface StaticProp extends NDragger.StaticProp { }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NDragger.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NDragger.CallbacksTypes {
        'move': {
            evt: MouseEvent | TouchEvent;
            start: NDragger.Coords;
            coords: NDragger.Coords;
            step: NDragger.Coords;
        };
    }

}



/**
 * Dragger with 'move' callbacks and motion.
 */
export class DraggerMove <
    StaticProp extends NDraggerMove.StaticProp = NDraggerMove.StaticProp,
    ChangeableProp extends NDraggerMove.ChangeableProp = NDraggerMove.ChangeableProp,
    CallbacksTypes extends NDraggerMove.CallbacksTypes = NDraggerMove.CallbacksTypes,
> extends Dragger <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    /**
     * Step on move
     */
    get stepCoords () {
        return {
            x: this._coords.x - this._prevCoords.x,
            y: this._coords.y - this._prevCoords.y,
        };
    }



    /**
     * Add runtime events
     */
    protected _addRuntimeEvents () {
        super._addRuntimeEvents();
        const { usePassive } = this.prop;

        // move
        this._runtimeEvents.push(
            addEventListener(window, 'mousemove', this._handleMove.bind(this), {
                passive: usePassive,
            }),
        );
        this._runtimeEvents.push(
            addEventListener(window, 'touchmove', this._handleMove.bind(this), {
                passive: usePassive,
            }),
        );
    }



    /**
     * Event on move
     */
    protected _handleMove (e: MouseEvent | TouchEvent) {
        const evt = this._normalizeEvent(e);
        if (!this.isDragging || evt.id !== this._pointerID) {
            return;
        }

        // update coordinates
        this._prevCoords = { x: this._coords.x, y: this._coords.y };
        this._coords = { x: evt.x, y: evt.y };

        // call events
        this.callbacks.tbt('move', {
            evt: e,
            start: this.startCoords,
            coords: this.coords,
            step: this.stepCoords,
        });
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();
    }
}
