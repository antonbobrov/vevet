import { TRequiredProps } from '@/internal';

import { ICursorStaticProps, ICursorMutableProps } from './types';

const isBrowser = typeof window !== 'undefined';

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
  // `undefined` so deprecated `lerp` still applies when `ease` is unset
  ease: undefined as any,
  easeCoords: 'auto',
  easeSize: 'auto',
  easeAngle: 'auto',
  easeVelocity: 'auto',
  autoStop: true,
};
