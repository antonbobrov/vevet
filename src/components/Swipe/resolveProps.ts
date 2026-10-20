import { isFiniteNumber, isNumber } from '@/internal';

import { ISwipeVec3 } from './global';
import { SWIPE_DEFAULTS } from './props';
import { ISwipeMutableProps } from './types';

export function resolveOverscroll(props: ISwipeMutableProps) {
  const value = props.overscroll ?? props.overflow;

  if (value === undefined || value === null) {
    return SWIPE_DEFAULTS.overscroll;
  }

  return isNumber(value) ? Math.abs(value) : Math.abs(value());
}

export function resolveCanRubber(props: ISwipeMutableProps) {
  return (
    props.canRubber ??
    props.allowRubber ??
    props.canBounce ??
    SWIPE_DEFAULTS.canRubber
  );
}

export function resolveBoundsOnInertia(props: ISwipeMutableProps) {
  return (
    props.boundsOnInertia ??
    props.recalculateBoundsOnInertia ??
    SWIPE_DEFAULTS.boundsOnInertia
  );
}

export function resolveRubberDuration(props: ISwipeMutableProps) {
  return (
    props.rubberDuration ??
    props.bounceDuration ??
    SWIPE_DEFAULTS.rubberDuration
  );
}

export function resolveRubberEase(props: ISwipeMutableProps) {
  return props.rubberEase ?? props.easeRubber ?? SWIPE_DEFAULTS.rubberEase;
}

export function resolveInertiaEase(props: ISwipeMutableProps) {
  const value = props.inertiaEase ?? props.inertiaDecay;

  return isFiniteNumber(value) ? value : SWIPE_DEFAULTS.inertiaEase;
}

export function resolveInertiaRubberEase(props: ISwipeMutableProps) {
  return (
    props.inertiaRubberEase ??
    props.easeOverflow ??
    props.inertiaBounceEase ??
    SWIPE_DEFAULTS.inertiaRubberEase
  );
}

export function resolveInertiaMaxVelocity(
  props: ISwipeMutableProps,
): ISwipeVec3 {
  return (
    props.inertiaMaxVelocity ??
    props.maxVelocity ??
    SWIPE_DEFAULTS.inertiaMaxVelocity
  );
}

export function resolveModifyInertiaDistance(props: ISwipeMutableProps) {
  return (
    props.modifyInertiaDistance ??
    props.inertiaDistance ??
    props.inertiaDistanceModifier ??
    null
  );
}
