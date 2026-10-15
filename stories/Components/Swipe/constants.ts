import {
  ISwipeCallbacksMap,
  ISwipeMutableProps,
  ISwipeStaticProps,
} from '@/components';

export const LOG_EVENTS: Record<keyof ISwipeCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  pointerdown: true,
  pointermove: false,
  pointerup: true,
  start: true,
  move: false,
  end: true,
  toTop: true,
  toBottom: true,
  toRight: true,
  toLeft: true,
  touchstart: true,
  touchmove: false,
  mousemove: false,
  abort: true,
  preventEdgeSwipe: true,
  inertiaStart: true,
  inertia: false,
  inertiaEnd: true,
  inertiaCancel: true,
  inertiaFail: true,
};

export type TProps = Omit<
  ISwipeStaticProps & ISwipeMutableProps,
  '__mutableProp' | '__staticProp' | 'container'
>;
