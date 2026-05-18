import { isBrowser } from '@/internal/env';
import { describeProps } from '@/internal/props';
import { TRequiredProps } from '@/internal/requiredProps';

import { ICursorStaticProps, ICursorMutableProps } from './types';

export const STATIC_PROPS: TRequiredProps<ICursorStaticProps> = {
  __staticProp: true,
  container: isBrowser ? window : (null as any),
  hideNative: false,
  append: true,
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

export const TEST_PROPS = describeProps<
  typeof STATIC_PROPS & typeof MUTABLE_PROPS
>({
  container: [{ type: 'element' }, { type: 'window' }],
  hideNative: [{ type: 'bool' }],
  append: [{ type: 'bool' }],
  behavior: [{ type: 'str', options: ['default', 'path'] }],
  transformModifier: [{ type: 'func' }],
  enabled: [{ type: 'bool' }],
  width: [{ type: 'num', min: 0 }, { type: 'str' }],
  height: [{ type: 'num', min: 0 }, { type: 'str' }],
  lerp: [{ type: 'num', min: 0.00001, max: 1 }],
  autoStop: [{ type: 'bool' }],
});

// todo: test methods
