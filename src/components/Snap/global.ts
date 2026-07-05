import { ISnapTransitionArg } from './engine/Animation/types';
import { SnapSlide } from './slide';

export type TSnapDuration = number | ((distance: number) => number);

export interface ISnapMagnet {
  /** Slide */
  slide: SnapSlide;
  /** Static magnet coordinate */
  magnet: number;
  /** Difference with current coordinate */
  diff: number;
}

export interface ISnapNexPrevArg extends ISnapTransitionArg {
  skip?: number;
}

export interface ISnapToSlideArg extends ISnapTransitionArg {
  direction?: 'next' | 'prev' | null;
  duration?: TSnapDuration;
}

export type { ISnapTransitionArg };
