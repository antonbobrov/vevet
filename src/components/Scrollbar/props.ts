import { TRequiredProps } from '@/internal';

import { IScrollbarStaticProps, IScrollbarMutableProps } from './types';

export const STATIC_PROPS: TRequiredProps<IScrollbarStaticProps> = {
  __staticProp: true,
  container: typeof window !== 'undefined' ? window : (null as any),
  parent: false,
  class: false,
  axis: 'y',
  draggable: true,
  autoHide: true,
  resizeDebounce: 50,
};

export const MUTABLE_PROPS: TRequiredProps<IScrollbarMutableProps> = {
  __mutableProp: true,
  minSize: 50,
  autoSize: true,
};
