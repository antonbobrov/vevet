import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module/types';
import { TEasingType } from '@/utils/math/easing';

export interface ITimelineStaticProps extends IModuleStaticProps {}

export interface ITimelineMutableProps extends IModuleMutableProps {
  /**
   * Timeline duration in milliseconds.
   * @default 1000
   */
  duration?: number;

  /**
   * Easing applied to linear {@link ITimelineProgressArg.progress}.
   *
   * Accepts a named easing type, bezier control points, or `false` for linear.
   * @default inherited from core settings
   */
  easing?: TEasingType;
}

export interface ITimelineCallbacksMap extends IModuleCallbacksMap<ITimelineMutableProps> {
  /**
   * Fired when linear progress is set to `0` (including {@link Timeline.reset}).
   */
  start: undefined;

  /**
   * Fired on every progress change with linear and eased values.
   */
  update: ITimelineProgressArg;

  /**
   * Fired when linear progress reaches `1`.
   */
  end: undefined;

  /** Fired when {@link Timeline.play} is called. */
  play: undefined;

  /** Fired when an active playback loop is paused via {@link Timeline.pause}. */
  pause: undefined;

  /** Fired when {@link Timeline.reverse} is called. */
  reverse: undefined;

  /** Fired when {@link Timeline.reset} is called, before progress is set to `0`. */
  reset: undefined;

  /**
   * Fired when playback resumes after a pause via {@link Timeline.play} or
   * {@link Timeline.reverse}.
   */
  resume: undefined;
}

/** Payload of the `update` callback. */
export interface ITimelineProgressArg {
  /** Linear progress (`0 → 1`). */
  progress: number;

  /** Progress after applying the `easing` prop. */
  eased: number;
}
