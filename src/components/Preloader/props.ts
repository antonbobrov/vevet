import { TRequiredProps } from '@/internal/requiredProps';

import { IPreloaderMutableProps, IPreloaderStaticProps } from './types';

export const STATIC_PROPS: TRequiredProps<IPreloaderStaticProps> = {
  __staticProp: true,
  container: null as any,
  hide: 250,
};

export const MUTABLE_PROPS: TRequiredProps<IPreloaderMutableProps> = {
  __mutableProp: true,
};
