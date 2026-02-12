import { initVevet } from '@/global/initVevet';
import { TRequiredProps } from '@/internal/requiredProps';

import { ITimelineMutableProps, ITimelineStaticProps } from './types';

export const STATIC_PROPS: TRequiredProps<ITimelineStaticProps> = {
  __staticProp: true,
};

export const MUTABLE_PROPS: TRequiredProps<ITimelineMutableProps> = {
  __mutableProp: true,
  easing: initVevet()?.props?.easing as any,
  duration: 1000,
};
