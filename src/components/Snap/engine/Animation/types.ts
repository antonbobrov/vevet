import { ITimelineProgressArg } from '@/components/Timeline';
import { TEasingType } from '@/utils/math';

import { TSnapDuration } from '../../global';

export interface ICtx {
  onRender: (frameDuration?: number) => void;
  getCurrent: () => number;
  setCurrent: (val: number) => number;
  getTarget: () => number;
  setTarget: (val: number) => number;
  getImpulse: () => { current: number; target: number };
  onTmReset: () => void;
}

export interface ISnapTransitionArg {
  duration?: TSnapDuration;
  easing?: TEasingType;
  onStart?: () => void;
  onUpdate?: (data: ITimelineProgressArg) => void;
  onEnd?: () => void;
}
