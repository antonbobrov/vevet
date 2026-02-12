import { isBrowser } from '@/internal/env';
import { TRequiredProps } from '@/internal/requiredProps';

import { ICursorStaticProps, ICursorMutableProps } from './types';

export const STATIC_PROPS: TRequiredProps<ICursorStaticProps> = {
  __staticProp: true,
  container: isBrowser ? window : (null as any),
  hideNative: false,
  behavior: 'default',
  transformModifier: ({ x, y }) => `translate(${x}px, ${y}px)`,
};

export const MUTABLE_PROPS: TRequiredProps<ICursorMutableProps> = {
  __mutableProp: true,
  enabled: true,
  width: 50,
  height: 50,
  lerp: 0.2,
  autoStop: true,
};
