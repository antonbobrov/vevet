import { DraggerMove, NDraggerMove } from '../../dragger/DraggerMove';
import { Plugin, NPlugin } from '../../../base/Plugin';
import { NCallbacks } from '../../../base/Callbacks';
import { SmoothScroll as SmoothScrollInstance } from '../smooth-scroll/SmoothScroll';
import { RequiredModuleProp } from '../../../utils/types/utility';

const draggingClassName = 'is-dragging';



export namespace NSmoothScrollDragPlugin {

    /**
     * Static properties
     */
    export interface StaticProp extends NPlugin.StaticProp {}

    /**
     * Changeable Properties
     */
    export interface ChangeableProp extends NPlugin.ChangeableProp {
        /**
         * If dragger is enabled
         * @default true
         */
        enabled?: boolean;
        /**
         * Dragger speed
         * @default 1
         */
        speed?: number;
        /**
         * Linear interpolation of SmoothScroll.
         * If false, the current value will be used.
         * @default false
         */
        lerp?: number | false;
        /**
         * If need to reverse dragger direction
         * @default false
         */
        reverseDir?: boolean;
        /**
         * If need to reverse dragger direction
         * @default false
         */
        stopPropagation?: false | {
            threshold: number;
            dir: 'x' | 'y';
        };
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NPlugin.CallbacksTypes {
        start: false;
        move: false;
        end: false;
    }

}



/**
 * A class for Plugins.
 */
export class SmoothScrollDragPlugin<
    StaticProp extends NSmoothScrollDragPlugin.StaticProp
        = NSmoothScrollDragPlugin.StaticProp,
    ChangeableProp extends NSmoothScrollDragPlugin.ChangeableProp
        = NSmoothScrollDragPlugin.ChangeableProp,
    CallbacksTypes extends NSmoothScrollDragPlugin.CallbacksTypes
        = NSmoothScrollDragPlugin.CallbacksTypes
> extends Plugin <
    StaticProp,
    ChangeableProp,
    CallbacksTypes,
    SmoothScrollInstance
> {
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            enabled: true,
            speed: 1,
            lerp: false,
            reverseDir: false,
            stopPropagation: false,
        };
    }

    /**
     * Dragger component
     */
    protected _dragger?: DraggerMove;
    /**
     * Component events
     */
    protected _componentEvents: NCallbacks.AddedCallback[];

    /**
     * If is dragging at the moment
     */
    get isDragging () {
        if (this._dragger) {
            return this._dragger.isDragging;
        }
        return false;
    }

    /**
     * Current lerp of SmoothScroll
     */
    protected _currentLerp: number | false;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
    ) {
        super(initialProp);
        this._dragger = undefined;
        this._componentEvents = [];
        this._currentLerp = false;
    }

    protected _constructor () {
        super._constructor();
        this._toggleDragger();
    }

    protected _onPropMutate () {
        super._onPropMutate();
        this._toggleDragger();
    }



    /**
     * Add or remove dragger
     */
    protected _toggleDragger () {
        if (this.prop.enabled) {
            this._addDragger();
        } else {
            this._removeDragger();
        }
    }

    /**
     * Add dragger events
     */
    protected _addDragger () {
        if (this._dragger) {
            return;
        }
        const { component } = this;

        this._dragger = new DraggerMove({
            container: component.outer,
        });
        this._dragger.addCallback('start', this._handleDragStart.bind(this));
        this._dragger.addCallback('move', (data) => {
            this._handleDragMove(data);
        });
        this._dragger.addCallback('end', this._handleDragEnd.bind(this));

        this._componentEvents.push(
            component.addCallback('wheel', () => {
                this._dragger?.cancel();
            }),
        );
    }

    /**
     * Remove dragger events
     */
    protected _removeDragger () {
        if (!this._dragger) {
            return;
        }

        this._dragger.destroy();
        this._dragger = undefined;

        this._componentEvents.forEach((evt) => {
            evt.remove();
        });
        this._componentEvents = [];
    }



    /**
     * Callback on dragging start
     */
    protected _handleDragStart () {
        const { component } = this;
        if (!component.prop.enabled) {
            return;
        }
        // check scrollable area
        if (component.maxScrollableWidth <= 0 && component.maxScrollableHeight <= 0) {
            return;
        }
        // change lerp
        const { lerp } = this.prop;
        if (typeof lerp !== 'boolean') {
            this._currentLerp = component.prop.render.lerp;
            component.changeProp({
                render: {
                    lerp,
                },
            });
        }
        // launch events
        this._callbacks.tbt('start', false);
    }

    /**
     * Callback on dragging move
     */
    protected _handleDragMove (
        data: NDraggerMove.CallbacksTypes['move'],
    ) {
        const { component } = this;
        if (!component.prop.enabled) {
            return;
        }
        // check scrollable area
        if (component.maxScrollableWidth <= 0 && component.maxScrollableHeight <= 0) {
            return;
        }
        const { evt } = data;

        // get difference between coordinates and decide
        // if we need to stop propagation
        const { stopPropagation } = this.prop;
        if (stopPropagation) {
            if (!evt.cancelable) {
                return;
            }
            const diffX = Math.abs(data.coords.x - data.start.x);
            const diffY = Math.abs(data.coords.y - data.start.y);
            if (
                ((diffX > stopPropagation.threshold) && stopPropagation.dir === 'x')
                || ((diffY > stopPropagation.threshold) && stopPropagation.dir === 'y')
            ) {
                if (evt.cancelable) {
                    evt.preventDefault();
                    evt.stopPropagation();
                }
            }
        }

        const { speed, reverseDir } = this.prop;
        // get coordinates
        const x = data.step.x * speed;
        const y = data.step.y * speed;
        // update scroll values
        component.targetLeft -= !reverseDir ? x : y;
        component.targetTop -= !reverseDir ? y : x;
        // set classes
        component.outer.classList.add(draggingClassName);
        component.container.classList.add(draggingClassName);

        // launch events
        this._callbacks.tbt('move', false);
    }

    /**
     * Callback on dragging end
     */
    protected _handleDragEnd () {
        const { component } = this;
        // set classes
        component.outer.classList.remove(draggingClassName);
        component.container.classList.remove(draggingClassName);
        // restore SmoothScroll Lerp
        if (typeof this._currentLerp !== 'boolean') {
            component.changeProp({
                render: {
                    lerp: this._currentLerp,
                },
            });
            this._currentLerp = false;
        }
        // launch events
        this._callbacks.tbt('end', false);
    }



    /**
     * Destroy the plugin
     */
    protected _destroy () {
        super._destroy();
        this._removeDragger();
    }
}
