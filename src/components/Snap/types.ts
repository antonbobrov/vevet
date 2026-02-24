import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';
import { TEasingType } from '@/utils/math';

import { ISwipeCoords } from '../Swipe';
import { ITimelineProgressArg } from '../Timeline';

import { SnapSlide } from './logic/Slide';
import { ISnapSlideProps } from './logic/Slide/types';
import { ISnapSwipeProps } from './logic/Swipe/types';
import { ISnapWheelProps } from './logic/Wheel/types';

/** Static properties for the Snap component */
export interface ISnapStaticProps extends IModuleStaticProps {
  /** HTML container  */
  container: HTMLElement;
  /** HTML Element used to emit events
   * @default null
   */
  eventsEmitter?: HTMLElement | null;
  /**
   * Default active index
   * @default 0
   */
  activeIndex?: number;
}

/** Mutable properties for the Snap component */
export interface ISnapMutableProps
  extends IModuleMutableProps, ISnapWheelProps, ISnapSwipeProps {
  /**
   * Slides instances. If `false`, all container's children will be considered as slides.
   * @default false
   */
  slides?: (HTMLElement | SnapSlide)[] | false;

  /**
   * Container size. Supported values:
   * - `auto` detects slide size depending on the container size.
   * - `number` defines the slide size in pixels.
   * - css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 'auto'
   */
  containerSize?: number | 'auto' | (string & {});

  /**
   * Indicates the number of slides to scroll on swipe or wheel.
   * @default 1
   */
  slidesToScroll?: number;

  /**
   * Sliding direction
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * Centered slides
   * @default false
   */
  centered?: boolean;

  /**
   * Detects if need to loop the progress
   * @default false
   */
  loop?: boolean;

  /**
   * The gap between slides. Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 0
   */
  gap?: number | string;

  /**
   * Linear interpolation factor for smooth coordinates updates.
   * @default `vevet.mobile ? 1 : 0.2`
   */
  lerp?: number;

  /**
   * Enables freemode, with or without sticky magnets.
   * @default false
   */
  freemode?: boolean | 'sticky';

  /**
   * Enables wrap-around navigation: advancing from the last slide jumps to the first,
   * and going back from the first jumps to the last. Has no effect when `loop` mode is enabled.
   * @default false
   */
  rewind?: boolean;

  /**
   * Snap to the nearest slide on carousel resize
   * @default true
   */
  stickOnResize?: boolean;

  /**
   * Friction that makes the slides tend to the nearest slide magnet. The value is a number between 0 and 1
   * which is multiplied by the `lerp` value.
   * 0 disables friction
   * @default 0
   */
  friction?: number;

  /**
   * Maximum friction between the final slide and the maximum translation value.
   * From 0 to 1. The higher value the more resistance is applied.
   * @default 0.85
   */
  edgeFriction?: number;

  /**
   * Change slide duration
   * @default 500
   */
  duration?: TSnapDuration;

  /**
   * Easing type for timelines
   * @default EaseOutCubic
   */
  easing?: TEasingType;

  /**
   * Slide size. Supported values:
   * - `auto` detects slide size depending on the element or container size.
   * - `stretch` detects slide size as the container size.
   * - `number` defines the slide size in pixels.
   * - css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 'auto'
   */
  slideSize?: ISnapSlideProps['size'];

  /**
   * Interval between automatic slide changes in milliseconds. If `null`, the interval is disabled.
   * @default null
   */
  interval?: number | null;

  /**
   * Direction of automatic slide changes. Can be either 'next' or 'prev'.
   * @default 'next'
   */
  intervalDirection?: 'next' | 'prev';
}

/** Callbacks map for the Snap component */
export interface ISnapCallbacksMap extends IModuleCallbacksMap {
  /** Fired on resize */
  resize: undefined;

  /** Fired on reflow: staticValues update */
  reflow: undefined;

  /** Fired during the rendering process */
  update: undefined;

  /** Fired after active slide change */
  activeSlide: SnapSlide;

  /** Fired on requestAnimationFrame play */
  rafPlay?: undefined;

  /** Fired on requestAnimationFrame pause */
  rafPause?: undefined;

  /** Fired on wheel start */
  wheelStart: undefined;

  /** Fired on wheel event */
  wheel: WheelEvent;

  /** Fired on wheel end */
  wheelEnd: undefined;

  /** Fired on swipe start */
  swipeStart: ISwipeCoords;

  /** Fired on swipe move */
  swipe: ISwipeCoords;

  /** Fired on swipe end */
  swipeEnd: ISwipeCoords;

  /** Fired on timeline animation start */
  timelineStart: undefined;

  /** Fired on timeline animation update */
  timelineUpdate: ITimelineProgressArg;

  /** Fired on timeline animation end */
  timelineEnd: undefined;

  /** Fired on inertia start */
  swipeInertiaStart: undefined;

  /** Fired on inertia end */
  swipeInertiaEnd: undefined;

  /** Fired on inertia cancel */
  swipeInertiaCancel: undefined;

  /** Fired on inertia fail */
  swipeInertiaFail: undefined;
}

export type TSnapDuration = number | ((distance: number) => number);

export interface ISnapMagnet {
  /** Slide */
  slide: SnapSlide;
  /** Static magnet coordinate */
  magnet: number;
  /** Difference with current coordinate */
  diff: number;
}

export interface ISnapTransitionArg {
  duration?: TSnapDuration;
  easing?: TEasingType;
  onStart?: () => void;
  onUpdate?: (data: ITimelineProgressArg) => void;
  onEnd?: () => void;
}

export interface ISnapNexPrevArg extends ISnapTransitionArg {
  skip?: number;
}

export interface ISnapToSlideArg extends ISnapTransitionArg {
  direction?: 'next' | 'prev' | null;
  duration?: TSnapDuration;
}
