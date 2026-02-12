import { isBrowser } from '@/internal/env';
import { TRequiredProps } from '@/internal/requiredProps';

import { IScrollbarStaticProps, IScrollbarMutableProps } from './types';

export const STATIC_PROPS: TRequiredProps<IScrollbarStaticProps> = {
  __staticProp: true,
  container: isBrowser ? window : (null as any),
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
