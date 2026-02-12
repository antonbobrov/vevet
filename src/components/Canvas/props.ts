import { TRequiredProps } from '@/internal/requiredProps';

import { ICanvasMutableProps, ICanvasStaticProps } from './types';

export const STATIC_PROPS: TRequiredProps<ICanvasStaticProps> = {
  __staticProp: true,
  container: null as any,
  append: true,
  resizeOnInit: true,
  resizeOnRuntime: false,
  viewportTarget: 'any',
  resizeDebounce: 0,
};

export const MUTABLE_PROPS: TRequiredProps<ICanvasMutableProps> = {
  __mutableProp: true,
  width: 'auto',
  height: 'auto',
  dpr: 'auto',
};
