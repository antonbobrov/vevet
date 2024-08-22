import { Component as ComponentClass } from '@/base/Component';
import { NBaseTimeline } from './types';
import { clampScope, easing } from '@/utils/math';
import { uid } from '@/utils/common';
import { getApp } from '@/utils/internal/getApp';

export type { NBaseTimeline };

/**
 * `BaseTimeline` is the base class for the `Timeline` itself.
 * The difference between the coponents is that `BaseTimeline` has no autonomous animation.
 */
export class BaseTimeline<
  StaticProps extends NBaseTimeline.IStaticProps = NBaseTimeline.IStaticProps,
  ChangeableProps extends
    NBaseTimeline.IChangeableProps = NBaseTimeline.IChangeableProps,
  CallbacksTypes extends
    NBaseTimeline.ICallbacksTypes = NBaseTimeline.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      easing: getApp().props.easing,
      scope: [0, 1],
      hasNestedEasingProgress: false,
    };
  }

  /** Global timeline progress */
  protected _p: number;

  /** Global timeline progress */
  get p() {
    return this._p;
  }

  set p(val: number) {
    this._p = val;

    this._handleProgressUpdate();
  }

  /** Easing progress */
  protected _e: number;

  /** Easing progress */
  get e() {
    return this._e;
  }

  /** Nested timelines */
  protected _nestedTimelines: { id: string; timeline: BaseTimeline }[];

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // set default vars
    this._p = 0;
    this._e = 0;
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
          ({ id: nestedTimelineId }) => nestedTimelineId !== id,
        );
      },
    };
  }

  /** Handle progress event */
  protected _handleProgressUpdate() {
    this._e = easing(this._p, this.props.easing);

    this.callbacks.tbt('progress', {
      p: this._p,
      e: this._e,
    });

    this._renderNestedTimelines();
  }

  /** Render nested timelines */
  protected _renderNestedTimelines() {
    const { length } = this._nestedTimelines;
    if (length === 0) {
      return;
    }

    const progressForNestedTimeline = this.props.hasNestedEasingProgress
      ? this.e
      : this.p;

    this._nestedTimelines.forEach(({ timeline }) => {
      const timelineProgress = clampScope(
        progressForNestedTimeline,
        timeline.props.nestedScope,
        [0, 1],
      );

      // eslint-disable-next-line no-param-reassign
      timeline.p = timelineProgress;
    });
  }

  /** Destroy the module */
  protected _destroy() {
    super._destroy();

    this._nestedTimelines.forEach(({ timeline }) => timeline.destroy());
  }
}
