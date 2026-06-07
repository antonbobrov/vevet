import { TRequiredProps } from '@/internal/requiredProps';

import { IWheelStaticProps, IWheelMutableProps } from './types';

export const GET_STATIC_PROPS = (): TRequiredProps<IWheelStaticProps> => ({
  __staticProp: true,
  container: null as any,
});

export const MUTABLE_PROPS: TRequiredProps<IWheelMutableProps> = {
  __mutableProp: true,
  enabled: true,
  speed: 1,
  axis: 'y',
  follow: true,
  throttle: 'auto',
};
