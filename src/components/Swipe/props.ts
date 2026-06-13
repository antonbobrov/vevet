import { TRequiredProps } from '@/internal/requiredProps';

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
  inertiaDecay: 0.05,
  inertiaBounceEase: 0.3,
  inertiaRatio: 1,
  inertiaThreshold: 1,
  maxVelocity: { x: 7, y: 7, angle: 3 },
  bounds: null as any,
  recalculateBoundsOnInertia: true,
  snap: null as any,
  canBounce: () => true,
  snapRadius: null as any,
  inertiaDuration: null as any,
  inertiaEasing: null as any,
  velocityModifier: null as any,
  inertiaDistanceThreshold: null as any,
  inertiaDistanceModifier: null as any,
};
