import { IScrollbarCallbacksMap } from '@/components';

export const LOG_EVENTS: Record<keyof IScrollbarCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  update: false,
  resize: true,
  show: true,
  hide: true,
  swipeStart: true,
  swipe: false,
  swipeEnd: true,
};
