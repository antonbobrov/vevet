import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module';
import { TEasingType } from '@/utils/math/easing';

export interface ITimelineStaticProps extends IModuleStaticProps {}

export interface ITimelineMutableProps extends IModuleMutableProps {
  /**
   * Timeline duration in milliseconds.
   * @default 1000
   */
  duration?: number;

  /**
   * Easing function for timeline progression.
   * Accepts standard easing types or an array of bezier values.
   * @default false
   */
  easing?: TEasingType;
}

export interface ITimelineCallbacksMap extends IModuleCallbacksMap {
  /**
   * Triggered when the timeline starts.
   */
  start: undefined;

  /**
   * Triggered during timeline updates with progress values.
   */
  update: ITimelineProgressArg;

  /**
   * Triggered when the timeline completes.
   */
  end: undefined;
}

export interface ITimelineProgressArg {
  /**
   * Linear progress, ranging from 0 to 1.
   */
  progress: number;

  /**
   * Progress value after applying the easing function.
   */
  eased: number;
}
