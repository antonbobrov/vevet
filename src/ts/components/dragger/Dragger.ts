import {
    addEventListener, IAddEventListener, isElement, isWindow, selectOne,
} from 'vevet-dom';
import { Component, NComponent } from '../../base/Component';
import { RequiredModuleProp } from '../../utils/types/utility';



export namespace NDragger {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * Draggable element
         * @default '#v-dragger'
         */
        container?: string | Element | Window;
        /**
         * If need to use passive events
         * @default false
         */
        usePassive?: boolean;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp {
        /**
         * If events are enabled
         * @default true
         */
        enabled?: boolean;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'start': {
            evt: MouseEvent | TouchEvent;
        };
        'end': false;
    }

    export interface Coords {
        x: number;
        y: number;
    }

}



/**
 * Drag & Swipe events. An abstract class
 */
export abstract class Dragger <
    StaticProp extends NDragger.StaticProp = NDragger.StaticProp,
    ChangeableProp extends NDragger.ChangeableProp = NDragger.ChangeableProp,
    CallbacksTypes extends NDragger.CallbacksTypes = NDragger.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            container: `#${this.prefix}`,
            usePassive: false,
            enabled: true,
        };
    }

    get prefix () {
        return `${this._app.prefix}dragger`;
    }



    /**
     * Preloader container
     */
    get container () {
        return this._container;
    }
    protected _container: Element | Window;

    /**
     * Runtime events
     */
    protected _runtimeEvents: IAddEventListener[];



    /**
     * If is dragging at the moment
     */
    get isDragging () {
        return this._isDragging;
    }
    protected _isDragging: boolean;

    /**
     * Current pointer id
     */
    protected _pointerID: number | null;

    /**
     * Current coordinates relative to the Window
     */
    get coords () {
        return this._coords;
    }
    protected _coords: NDragger.Coords;
    /**
     * Last coordinates relative to the window
     */
    protected _prevCoords: NDragger.Coords;
    /**
     * Coordinates on drag start
     */
    get startCoords () {
        return this._startCoords;
    }
    protected _startCoords: NDragger.Coords;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // get container
        this._container = selectOne(this.prop.container)!;
        if (!isElement(this._container) && !isWindow(this._container)) {
            throw new Error('No container');
        }

        // set default vars
        this._runtimeEvents = [];
        this._isDragging = false;
        this._pointerID = null;
        this._coords = { x: 0, y: 0 };
        this._prevCoords = { x: 0, y: 0 };
        this._startCoords = { x: 0, y: 0 };

        // initialize the class
        if (init) {
            this.init();
        }
    }

    /**
     * Set component events
     */
    protected _setEvents () {
        const { container } = this;
        const { usePassive } = this.prop;

        this.addEventListeners(
            container, 'mousedown', this._handleStart.bind(this),
            { passive: usePassive },
        );
        this.addEventListeners(
            container, 'touchstart', this._handleStart.bind(this),
            { passive: usePassive },
        );
    }

    /**
     * Add runtime events
     */
    protected _addRuntimeEvents () {
        const { usePassive } = this.prop;

        // end
        this._runtimeEvents.push(
            addEventListener(window, 'mouseup', this._handleEnd.bind(this), {
                passive: usePassive,
            }),
        );
        this._runtimeEvents.push(
            addEventListener(window, 'touchend', this._handleEnd.bind(this), {
                passive: usePassive,
            }),
        );

        // cancel
        this._runtimeEvents.push(
            addEventListener(window, 'touchcancel', this._end.bind(this), {
                passive: usePassive,
            }),
        );
        this._runtimeEvents.push(
            addEventListener(window, 'blur', this._end.bind(this), {
                passive: usePassive,
            }),
        );
    }

    /**
     * Remove runtime events
     */
    protected _removeRuntimeEvents () {
        this._runtimeEvents.forEach((event) => {
            event.remove();
        });
        this._runtimeEvents = [];
    }

    /**
     * Normalize event data.
     */
    protected _normalizeEvent (e: MouseEvent | TouchEvent) {
        if (e instanceof TouchEvent) {
            const touch = e.targetTouches[0] || e.changedTouches[0];
            return {
                x: touch.clientX,
                y: touch.clientY,
                id: touch.identifier,
            };
        }
        return {
            x: e.clientX,
            y: e.clientY,
            id: null,
        };
    }



    /**
     * Event on start dragging
     */
    protected _handleStart (e: MouseEvent | TouchEvent) {
        if (!this.prop.enabled) {
            return false;
        }
        if (this.isDragging) {
            return false;
        }
        const evt = this._normalizeEvent(e);

        // prevent actions
        if (e.type === 'mousedown') {
            if (e.which === 1) {
                e.stopPropagation();
            } else {
                return false;
            }
        }

        // update states
        this._isDragging = true;
        this._pointerID = evt.id;

        // change coordinates
        this._coords = { x: evt.x, y: evt.y };
        this._prevCoords = { x: evt.x, y: evt.y };
        this._startCoords = { x: evt.x, y: evt.y };

        // add additional events
        this._addRuntimeEvents();

        // launch callbacks
        this.callbacks.tbt('start', {
            evt: e,
        });

        return true;
    }

    /**
     * Event on drag end
     */
    protected _handleEnd (e: TouchEvent | MouseEvent) {
        const evt = this._normalizeEvent(e);
        if (!this.isDragging || evt.id !== this._pointerID) {
            return false;
        }
        this._end();
        return true;
    }

    /**
     * Cancel dragging
     */
    protected _end () {
        this._removeRuntimeEvents();
        this._isDragging = false;
        this.callbacks.tbt('end', false);
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();
        this._removeRuntimeEvents();
    }
}
