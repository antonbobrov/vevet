import { EaseOutCubic } from 'easing-progress';

import { TRequiredProps } from '@/internal/requiredProps';
import { clamp } from '@/utils';

import { ISwipeMutableProps, ISwipeStaticProps } from './types';

export const STATIC_PROPS: TRequiredProps<ISwipeStaticProps> = {
  __staticProp: true,
  container: null as any,
  thumb: null as any,
  buttons: [0],
  pointers: 1,
  disableUserSelect: true,
};

export const MUTABLE_PROPS: TRequiredProps<ISwipeMutableProps> = {
  __mutableProp: true,
  enabled: true,
  relative: false,
  axis: null as any,
  ratio: 1,
  grabCursor: false,
  willAbort: () => false,
  threshold: 5,
  minTime: 0,
  directionThreshold: 50,
  preventEdgeSwipe: true,
  edgeSwipeThreshold: 20,
  preventTouchMove: true,
  requireCtrlKey: false,
  inertia: false,
  inertiaDuration: (distance) => clamp(distance, 500, 2000),
  inertiaEasing: EaseOutCubic,
  velocityModifier: false,
  inertiaRatio: 1,
  inertiaDistanceThreshold: 50,
};
