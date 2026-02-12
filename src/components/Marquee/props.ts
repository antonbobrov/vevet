import { TRequiredProps } from '@/internal/requiredProps';

import { IMarqueeStaticProps, IMarqueeMutableProps } from './types';

export const STATIC_PROPS: TRequiredProps<IMarqueeStaticProps> = {
  __staticProp: true,
  container: null as any,
  resizeDebounce: 0,
  hasWillChange: true,
  cloneNodes: true,
  direction: 'horizontal',
};

export const MUTABLE_PROPS: TRequiredProps<IMarqueeMutableProps> = {
  __mutableProp: true,
  speed: 1,
  gap: 0,
  enabled: true,
  pauseOnHover: false,
  centered: false,
  adjustSpeed: true,
  pauseOnOut: true,
};
