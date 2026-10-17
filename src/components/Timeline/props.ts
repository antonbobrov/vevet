import { initVevet } from '@/global/initVevet';
import { TRequiredProps } from '@/internal';

import { ITimelineMutableProps, ITimelineStaticProps } from './types';

const defaultEase = initVevet()?.props?.easing as any;

export const STATIC_PROPS: TRequiredProps<ITimelineStaticProps> = {
  __staticProp: true,
};

export const MUTABLE_PROPS: TRequiredProps<ITimelineMutableProps> = {
  __mutableProp: true,
  ease: undefined as any,
  easing: defaultEase,
  duration: 1000,
};
