import { ITimelineProgressArg } from '@/components/Timeline';

export interface IProps {
  onRafPlay: () => void;
  onRafPause: () => void;
  onRender: (duration?: number) => void;
  containerSize: () => number;
  firstSlideSize: () => number;
  onTimelineStart: () => void;
  onTimelineUpdate: (data: ITimelineProgressArg) => void;
  onTimelineEnd: () => void;
}
