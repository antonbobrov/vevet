import { EaseOutCubic } from 'easing-progress';

import { TRequiredProps } from '@/internal';

import { ISwipeVec3 } from './global';
import { ISwipeMutableProps, ISwipeStaticProps } from './types';

/** Resolved defaults when both the new prop and its deprecated alias are unset. */
export const SWIPE_DEFAULTS = {
  overscroll: 50,
  canRubber: () => true,
  rubberDuration: 250,
  rubberEase: EaseOutCubic,
  inertiaEase: 0.05,
  inertiaRubberEase: 0.3,
  boundsOnInertia: true,
  inertiaMaxVelocity: { x: 7, y: 7, angle: 3 } satisfies ISwipeVec3,
} as const;

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
  preventEdgeSwipe: false,
  edgeSwipeThreshold: 20,
  preventTouchMove: true,
  requireCtrlKey: false,
  bounds: null as any,
  overscroll: null as any,
  canRubber: null as any,
  snap: null as any,
  snapRadius: null as any,
  boundsOnInertia: null as any,
  rubberDuration: null as any,
  rubberEase: null as any,
  inertia: false,
  inertiaEase: null as any,
  inertiaRubberEase: null as any,
  inertiaRatio: 1,
  inertiaThreshold: 1,
  inertiaMaxVelocity: null as any,
  modifyInertiaDistance: null as any,
  // deprecated
  overflow: null as any,
  allowRubber: null as any,
  canBounce: null as any,
  recalculateBoundsOnInertia: null as any,
  bounceDuration: null as any,
  easeRubber: null as any,
  inertiaDecay: null as any,
  easeOverflow: null as any,
  inertiaBounceEase: null as any,
  maxVelocity: null as any,
  inertiaDistance: null as any,
  inertiaDistanceModifier: null as any,
  inertiaDuration: null as any,
  inertiaEasing: null as any,
  velocityModifier: null as any,
  inertiaDistanceThreshold: null as any,
};
