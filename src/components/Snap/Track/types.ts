import { ITimelineProgressArg } from '@/components/Timeline';

import { SnapSlides } from '../logic/Slides';

export interface IProps {
  getSlides: () => SnapSlides;
  onRafPlay: () => void;
  onRafPause: () => void;
  onRender: (duration?: number) => void;
  containerSize: () => number;
  firstSlideSize: () => number;
  origin: () => 'start' | 'center' | 'end';
  onTimelineStart: () => void;
  onTimelineUpdate: (data: ITimelineProgressArg) => void;
  onTimelineEnd: () => void;
}
