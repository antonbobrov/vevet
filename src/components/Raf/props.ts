import { TRequiredProps } from '@/internal/requiredProps';

import { IRafStaticProps, IRafMutableProps } from './types';

export const STATIC_PROPS: TRequiredProps<IRafStaticProps> = {
  __staticProp: true,
};

export const MUTABLE_PROPS: TRequiredProps<IRafMutableProps> = {
  __mutableProp: true,
  fps: 'auto',
  enabled: false,
  fpsRecalcFrames: 10,
};
