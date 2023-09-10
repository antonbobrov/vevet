import { Component as ComponentClass } from '@/base/Component';
import { NBaseTimeline } from './types';
import { clampScope, easing } from '@/utils/math';
import { uid } from '@/utils/common';

export type { NBaseTimeline };

/**
 * `BaseTimeline` is the base class for the `Timeline` itself.
 * The difference between the coponents is that `BaseTimeline` has no autonomous animation.
 */
export class BaseTimeline<
  StaticProps extends NBaseTimeline.IStaticProps = NBaseTimeline.IStaticProps,
  ChangeableProps extends NBaseTimeline.IChangeableProps = NBaseTimeline.IChangeableProps,
  CallbacksTypes extends NBaseTimeline.ICallbacksTypes = NBaseTimeline.ICallbacksTypes
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      easing: this.app.props.easing,
      scope: [0, 1],
      hasNestedEasingProgress: false,
    };
  }

  /** Global timeline progress */
  private _progress: number;

  /** Global timeline progress */
  get progress() {
    return this._progress;
  }

  set progress(val: number) {
    this._progress = val;

    this._handleProgressUpdate();
  }

  /** Easing progress */
  private _easing: number;

  /** Easing progress */
  get easing() {
    return this._easing;
  }

  /** Nested timelines */
  private _nestedTimelines: { id: string; timeline: BaseTimeline }[];

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // set default vars
    this._progress = 0;
    this._easing = 0;
    this._nestedTimelines = [];

    if (canInit) {
      this.init();
    }
  }

  /** Add a nested timeline */
  public addNestedTimeline(timeline: BaseTimeline) {
    const id = uid();

    this._nestedTimelines.push({ id, timeline });

    return {
      remove: () => {
        this._nestedTimelines = this._nestedTimelines.filter(
          ({ id: nestedTimelineId }) => nestedTimelineId !== id
        );
      },
    };
  }

  /** Handle progress event */
  protected _handleProgressUpdate() {
    this._easing = easing(this._progress, this.props.easing);

    this.callbacks.tbt('progress', {
      progress: this._progress,
      easing: this._easing,
    });

    this._renderNestedTimelines();
  }

  /** Render nested timelines */
  private _renderNestedTimelines() {
    const { length } = this._nestedTimelines;
    if (length === 0) {
      return;
    }

    const progressForNestedTimeline = this.props.hasNestedEasingProgress
      ? this.easing
      : this.progress;

    this._nestedTimelines.forEach(({ timeline }) => {
      const timelineProgress = clampScope(
        progressForNestedTimeline,
        timeline.props.nestedScope,
        [0, 1]
      );

      // eslint-disable-next-line no-param-reassign
      timeline.progress = timelineProgress;
    });
  }

  /** Destroy the module */
  protected _destroy() {
    super._destroy();

    this._nestedTimelines.forEach(({ timeline }) => timeline.destroy());
  }
}
