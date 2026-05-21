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
  bounceDuration: 250,
  overflow: () => 50,
  inertia: false,
  inertiaType: 'exponential',
  inertiaDecay: 0.025,
  inertiaBounceEase: 0.1,
  inertiaRatio: 1,
  inertiaThreshold: 1,
  maxVelocity: { x: 7, y: 7, angle: 3 },
  bakeBounds: null as any,
  releaseBounce: () => true,
  inertiaDuration: (distance) => clamp(distance, 500, 2000),
  inertiaEasing: EaseOutCubic,
  velocityModifier: false,
  inertiaDistanceThreshold: 1,
};

export const LERP_APPROX = 0.01;

export const LERP_THRESHOLD = 0.01;
