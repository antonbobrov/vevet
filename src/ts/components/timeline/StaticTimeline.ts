import easingProgress from 'easing-progress';
import { NApplication } from '../../app/Application';
import { Component, NComponent } from '../../base/Component';
import { RequiredModuleProp } from '../../utils/types/utility';
import scoped from '../../utils/math/scoped';
import clamp from '../../utils/math/clamp';



export namespace NStaticTimeline {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * Timeline easing function
         */
        easing?: NApplication.Prop['easing'];
        /**
         * Timeline scope is used for nested timelines.
         * The first value means that animation will start only when the absolute progress
         * of the parent timeline reaches this value. The second value is
         * the end of animation relatively to the parent timeline. <br>
         * This property should be set for a nested timeline.
         * @default [0, 1]
         */
        nestedScope?: [number, number];
        /**
         * Define if you want to use easing progress to calculate current progress
         * of nested timelines according to their scope. <br>
         * This property should be set for the parent timeline.
         * @default false
         */
        useNestedEasingProgress?: boolean;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface ProgressArg {
        progress: number;
        easing: number;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'progress': ProgressArg;
    }

}



/**
 * StaticTimeline is the base class for Timeline itself.
 * The difference between the coponents is that StaticTimeline has no animation:
 * no play & pause methods.
 */
export class StaticTimeline <
    StaticProp extends NStaticTimeline.StaticProp = NStaticTimeline.StaticProp,
    ChangeableProp extends NStaticTimeline.ChangeableProp = NStaticTimeline.ChangeableProp,
    CallbacksTypes extends NStaticTimeline.CallbacksTypes = NStaticTimeline.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    /**
     * Get default properties
     */
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            easing: this._app.prop.easing,
            scope: [0, 1],
            useNestedEasingProgress: false,
        };
    }



    protected _progress: number;
    /**
     * Absolute progress of the timeline
     */
    get progress () {
        return this._progress;
    }
    set progress (val: number) {
        this._progress = val;
        this._handleProgress();
    }


    protected _easing: number;
    /**
     * Easing progress of the timeline
     */
    get easing () {
        return this._easing;
    }

    /**
     * Nested timelines
     */
    protected _nestedTimelines: StaticTimeline[];



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // set default vars
        this._progress = 0;
        this._easing = 0;
        this._nestedTimelines = [];

        if (init) {
            this.init();
        }
    }



    /**
     * Add a nested timeline
     */
    public addNestedTimeline (
        tm: StaticTimeline,
    ) {
        // add the timeline to the stack
        this._nestedTimelines.push(tm);
    }

    /**
     * Handle progress event
     */
    protected _handleProgress () {
        // calculate easing progress
        this._easing = easingProgress(this._progress, this.prop.easing);
        // launch progress events
        this._callbacks.tbt('progress', {
            progress: this._progress,
            easing: this._easing,
        });
        // render
        this._renderNestedTimelines();
    }

    /**
     * Render nested timelines
     */
    protected _renderNestedTimelines () {
        const { length } = this._nestedTimelines;
        if (length === 0) {
            return;
        }
        // vars
        const progressForNested = this.prop.useNestedEasingProgress ? this.easing : this.progress;
        // render nested timelines
        for (let index = 0, l = length; index < l; index += 1) {
            const tm = this._nestedTimelines[index];
            // calculate progress of this very timeline
            const tmProgress = clamp(
                scoped(progressForNested, tm.prop.nestedScope),
                [0, 1],
            );
            tm.progress = tmProgress;
        }
    }



    /**
     * Destroy the animation frame
     */
    protected _destroy () {
        super._destroy();
        // destroy nested timelines
        this._nestedTimelines.forEach((tm) => {
            tm.destroy();
        });
    }
}
