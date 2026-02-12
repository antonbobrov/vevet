import { TRequiredProps } from '@/internal/requiredProps';

import { IPointersMutableProps, IPointersStaticProps } from './types';

export const STATIC_PROPS: TRequiredProps<IPointersStaticProps> = {
  __staticProp: true,
  container: null as any,
  buttons: [0],
  relative: false,
  minPointers: 1,
  maxPointers: 5,
  disableUserSelect: true,
};

export const MUTABLE_PROPS: TRequiredProps<IPointersMutableProps> = {
  __mutableProp: true,
  enabled: true,
};
