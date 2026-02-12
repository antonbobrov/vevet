import { TRequiredProps } from '@/internal/requiredProps';

import { IInViewMutableProps, IInViewStaticProps } from './types';

export const STATIC_PROPS: TRequiredProps<IInViewStaticProps> = {
  __staticProp: true,
  hasOut: true,
  maxInitialDelay: 1000,
  scrollDirection: 'vertical',
};

export const MUTABLE_PROPS: TRequiredProps<IInViewMutableProps> = {
  __mutableProp: true,
  enabled: true,
  rootMargin: '0% 0% -5% 0%',
};
