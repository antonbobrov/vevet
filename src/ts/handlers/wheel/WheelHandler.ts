import { addEventListener, IAddEventListener } from 'vevet-dom';
import normalizeWheel from 'normalize-wheel';
import { Module, NModule } from '../../base/Module';
import { RequiredModuleProp } from '../../utils/types/utility';



export namespace NWheelHandler {

    /**
     * Static properties
     */
    export interface StaticProp extends NModule.StaticProp {
        /**
         * Container to listen to.
         * False for window
         * @default false
         */
        container?: false | Element | Window;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NModule.ChangeableProp {
        /**
         * If events are enabled
         * @default true
         */
        enabled?: boolean;
        /**
         * If need to stop propagation
         * @default false
         */
        stopPropagation?: boolean;
        /**
         * Amount of pixels to trigger a callback
         * @default 100
         */
        threshold?: number;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NModule.CallbacksTypes {
        'up': false;
        'down': false;
        'left': false;
        'right': false;
    }

}



/**
 * Wheel events: up & down, left & right without repeating

 */
export class WheelHandler <
    StaticProp extends NWheelHandler.StaticProp = NWheelHandler.StaticProp,
    ChangeableProp extends NWheelHandler.ChangeableProp = NWheelHandler.ChangeableProp,
    CallbacksTypes extends NWheelHandler.CallbacksTypes = NWheelHandler.CallbacksTypes,
> extends Module <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            container: false,
            enabled: true,
            stopPropagation: false,
            threshold: 20,
        };
    }

    /**
     * Listener contianer
     */
    get container () {
        if (!this.prop.container) {
            return window;
        }
        return this.prop.container;
    }

    /**
     * Wheel listener
     */
    protected _wheelListener?: IAddEventListener;

    /**
     * If need to temporary disable wheel
     */
    protected _lockWheel: boolean;
    /**
     * Used to prevent from triggering callback multiple times while wheel events
     */
    protected _lockWheelTimeout?: any;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);
        this._wheelListener = undefined;
        this._lockWheel = false;
        if (init) {
            this.init();
        }
    }



    // Set Module Events
    protected _setEvents () {
        super._setEvents();

        if (!(this.container instanceof Window)) {
            this._listeners.push(addEventListener(this.container, 'mouseenter', this._handleMouseEnter.bind(this)));
            this._listeners.push(addEventListener(this.container, 'mouseleave', this._handleMouseLeave.bind(this)));
        } else {
            this._toggleWheelEvent();
        }
    }

    protected _onPropMutate () {
        super._onPropMutate();
        this._toggleWheelEvent();
    }



    /**
     * Handle element mouse enter
     */
    protected _handleMouseEnter () {
        if (this.prop.enabled) {
            this._createWheelEvent();
        }
    }

    /**
     * Handle element mouse leave
     */
    protected _handleMouseLeave () {
        this._destroyWheelEvent();
    }



    /**
     * Set wheel event
     */
    protected _toggleWheelEvent () {
        if (this.prop.enabled) {
            this._createWheelEvent();
        } else {
            this._destroyWheelEvent();
        }
    }

    /**
     * Create a wheel event
     */
    protected _createWheelEvent () {
        if (this._wheelListener) {
            return;
        }
        // reset gaining
        this._lockWheel = false;
        if (this._lockWheelTimeout) {
            clearTimeout(this._lockWheelTimeout);
        }
        // create a listener
        this._wheelListener = addEventListener(
            this.container,
            'wheel',
            // throttle(this._handleWheel.bind(this), 200),
            this._handleWheel.bind(this),
        );
    }

    /**
     * Destroy the wheel event
     */
    protected _destroyWheelEvent () {
        if (!this._wheelListener) {
            return;
        }
        this._wheelListener.remove();
        this._wheelListener = undefined;
    }



    /**
     * Handle wheel event
     */
    protected _handleWheel (
        evt: WheelEvent,
    ) {
        if (!this._wheelListener) {
            return;
        }

        // stop propagation
        if (this.prop.stopPropagation) {
            evt.preventDefault();
            evt.stopPropagation();
        }

        // if locked
        if (this._lockWheel) {
            if (this._lockWheelTimeout) {
                clearTimeout(this._lockWheelTimeout);
            }
            this._lockWheelTimeout = setTimeout(() => {
                this._lockWheel = false;
            }, 300);
            return;
        }

        // data
        const delta = normalizeWheel(evt);
        const { threshold } = this.prop;

        // launch events
        let eventFired = false;
        // Y
        if (delta.pixelY > threshold) {
            this._callbacks.tbt('down', false);
            eventFired = true;
        } else if (delta.pixelY < threshold * -1) {
            this._callbacks.tbt('up', false);
            eventFired = true;
        }
        // X
        if (delta.pixelX > threshold) {
            this._callbacks.tbt('right', false);
            eventFired = true;
        } else if (delta.pixelX < threshold * -1) {
            this._callbacks.tbt('left', false);
            eventFired = true;
        }

        // lock events
        if (eventFired) {
            this._lockWheel = true;
        }
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();
        this._destroyWheelEvent();
    }
}
