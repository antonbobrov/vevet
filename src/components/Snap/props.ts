import { EaseOutCubic } from 'easing-progress';

import { initVevet } from '@/global/initVevet';
import { TRequiredProps } from '@/internal/requiredProps';
import { clamp } from '@/utils';

import { ISnapMutableProps, ISnapStaticProps } from './types';

export const STATIC_PROPS: TRequiredProps<ISnapStaticProps> = {
  __staticProp: true,
  container: null as any,
  eventsEmitter: null as any,
  activeIndex: 0,
};

export const MUTABLE_PROPS: TRequiredProps<ISnapMutableProps> = {
  __mutableProp: true,
  slides: false,
  containerSize: 'auto',
  slidesToScroll: 1,
  direction: 'horizontal',
  centered: false,
  loop: false,
  gap: 0,
  lerp: initVevet()?.mobile ? 1 : 0.2,
  freemode: false,
  rewind: false,
  stickOnResize: true,
  friction: 0,
  edgeFriction: 0.85,
  duration: 500,
  easing: EaseOutCubic,
  swipe: true,
  grabCursor: false,
  swipeSpeed: 1,
  swipeAxis: 'auto',
  followSwipe: true,
  shortSwipes: true,
  shortSwipesDuration: 300,
  shortSwipesThreshold: 30,
  swipeFriction: false,
  swipeThreshold: 5,
  swipeMinTime: 0,
  swipeInertiaDuration: (distance) => clamp(distance, 500, 2000),
  swipeInertiaRatio: 0.5,
  wheel: false,
  wheelSpeed: 1,
  wheelAxis: 'auto',
  followWheel: true,
  wheelThrottle: 'auto',
  stickOnWheelEnd: true,
  stickOnWheelEndThreshold: 30,
  slideSize: 'auto',
};
