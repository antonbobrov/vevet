import easingProgress from 'easing-progress';
import { NApplication } from '../../app/Application';
import { Component, NComponent } from '../../base/Component';
import { mergeWithoutArrays } from '../../utils/common';
import { boundProgress, scopeProgress } from '../../utils/math';



/**
 * This is a base class for more complex timeline animations. This very timeline is purely static
 * and doesn't support play/pause methods. For the full version, see {@linkcode Timeline}. <br>
 * The timeline is based on window.requestAnimationFrame. <br>
 * With each frame, current progress is calculated. There exist three types of timeline progress -
 * See [[TimelineBase.ProgressData]].
 * Besides, the component supports nested timelines.
 */
export class TimelineBase<
    StaticProp extends NTimelineBase.StaticProp = NTimelineBase.StaticProp,
    ChangeableProp extends NTimelineBase.ChangeableProp = NTimelineBase.ChangeableProp,
    CallbacksTypes extends NTimelineBase.CallbacksTypes = NTimelineBase.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {



    get defaultProp () {
        const prop: Required<
            Omit<
                NTimelineBase.StaticProp & NTimelineBase.ChangeableProp,
                keyof (NComponent.StaticProp & NComponent.ChangeableProp)
            >
        > = {
            scope: false,
            boundScope: true,
            easing: this._app.prop.easing,
        };
        return mergeWithoutArrays(super.defaultProp, prop);
    }



    /**
     * Absolute progress of the timeline
     */
    protected _absoluteProgress = 0;
    /**
     * Progress of the timeline
     */
    protected _progress = 0;
    /**
     * Easing progress
     */
    protected _easingProgress = 0;



    /**
     * Timeline progress data
     */
    get progressData (): NTimelineBase.ProgressData {
        return {
            progress: this._progress,
            easingProgress: this._easingProgress,
            absoluteProgress: this._absoluteProgress,
        };
    }



    /**
     * Nested timelines
     */
    protected _timelines: TimelineBase[] = [];
    /**
     * Total amount of nested timelines.
     */
    protected _timelinesQuantity = 0;



    // Extra constructor
    protected _constructor () {

        super._constructor();

    }



    /**
     * Add a nested timeline.
     */
    public addTimeline (
        timeline: TimelineBase,
    ) {
        this._timelines.push(timeline);
        this._timelinesQuantity++;
    }



    /**
     * Calculate all progress types according to the absolute value.
     */
    public setProgress (
        absoluteProgress: number,
    ) {

        // get settings
        const { prop } = this;
        const { scope, boundScope, easing: easingType } = prop;

        // update absolute progress
        this._absoluteProgress = absoluteProgress;

        // calculate progress along the absolute progress
        if (scope) {
            this._progress = scopeProgress(absoluteProgress, scope);
            // and bound it between [0 & 1] if needed
            if (boundScope) {
                this._progress = boundProgress(this._progress);
            }
        }
        else {
            this._progress = absoluteProgress;
        }

        // calculate easing progress
        if (easingType) {
            this._easingProgress = easingProgress(this._progress, easingType);
        }
        else {
            this._easingProgress = this._progress;
        }

        // launch callback
        this.callbacks.tbt('progress', this.progressData);

        // imitate nested timelines
        if (this._timelinesQuantity > 0) {
            for (let i = 0; i < this._timelinesQuantity; i++) {
                this._timelines[i].setProgress(this._progress);
            }
        }

    }



    // Destroy the module
    protected _destroy () {

        super._destroy();

        // destroy all nested timelines
        this._timelines.forEach((timeline) => {
            timeline.destroy();
        });

    }



}



/**
 * @namespace
 */
export namespace NTimelineBase {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * Scope timeline progress. F.e., if the value is [0.25, 1], and the absolute progress
         * of the timeline is 0.35, the progress value
         * in {@linkcode TimelineBase.progressData} will be 0.133.
         * @see [[scopeProgress]]
         * @default false
         */
        scope?: false | number[],
        /**
         * @see [[boundProgress]]
         * @default true
         */
        boundScope?: boolean,
        /**
         * The easing function of the timeline
         */
        easing?: NApplication.Prop['easing']
    }

    /**
     * Changeable Properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp {}

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'progress': ProgressData
    }

    /**
     * Progress Callback Data
     */
    export interface ProgressData {
        progress: number;
        easingProgress: number;
        absoluteProgress: number;
    }

}
