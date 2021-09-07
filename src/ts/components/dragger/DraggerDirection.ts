import { RequiredModuleProp } from '../../utils/types/utility';
import { Dragger, NDragger } from './Dragger';



export namespace NDraggerDirection {

    /**
     * Static properties
     */
    export interface StaticProp extends NDragger.StaticProp {
        /**
         * The minimal swipe length (px) to launch events.
         * @default 75
         */
        min?: number,
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NDragger.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NDragger.CallbacksTypes {
        'up': false;
        'down': false;
        'left': false;
        'right': false;
    }

}



/**
 * Dragger that detects direction
 */
export class DraggerDirection <
    StaticProp extends NDraggerDirection.StaticProp = NDraggerDirection.StaticProp,
    ChangeableProp extends NDraggerDirection.ChangeableProp = NDraggerDirection.ChangeableProp,
    CallbacksTypes extends NDraggerDirection.CallbacksTypes = NDraggerDirection.CallbacksTypes,
> extends Dragger <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            min: 75,
        };
    }



    /**
     * Event on drag end
     */
    protected _handleEnd (e: TouchEvent | MouseEvent) {
        const res = super._handleEnd(e);
        if (!res) {
            return res;
        }

        const evt = this._normalizeEvent(e);
        const { startCoords } = this;
        const min = Math.abs(this.prop.min);

        // up
        if (
            startCoords.y > evt.y
            && Math.abs(evt.y - startCoords.y) >= min
        ) {
            this.callbacks.tbt('up', false);
        }
        // down
        if (
            startCoords.y < evt.y
            && Math.abs(evt.y - startCoords.y) >= min
        ) {
            this.callbacks.tbt('down', false);
        }

        // left
        if (
            startCoords.x > evt.x
            && Math.abs(evt.x - startCoords.x) >= min
        ) {
            this.callbacks.tbt('left', false);
        }
        // right
        if (
            startCoords.x < evt.x
            && Math.abs(evt.x - startCoords.x) >= min
        ) {
            this.callbacks.tbt('right', false);
        }

        return true;
    }
}
