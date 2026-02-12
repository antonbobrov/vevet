import { TRequiredProps } from '@/internal/requiredProps';

import {
  IScrollProgressStaticProps,
  IScrollProgressMutableProps,
} from './types';

export const STATIC_PROPS: TRequiredProps<IScrollProgressStaticProps> = {
  __staticProp: true,
  section: null as any,
  root: null as any,
  optimized: true,
  useSvh: false,
};

export const MUTABLE_PROPS: TRequiredProps<IScrollProgressMutableProps> = {
  __mutableProp: true,
};
