import { TRequiredProps } from '@/internal';

import {
  ICanvasMutableProps,
  ICanvasStaticProps,
  ICanvasStaticPropsDeprecated,
} from './types';

export const STATIC_PROPS: TRequiredProps<
  Omit<ICanvasStaticProps, keyof ICanvasStaticPropsDeprecated>
> = {
  __staticProp: true,
  container: null as any,
  append: true,
  resize: {
    init: true,
    runtime: false,
    target: 'any',
    debounce: 0,
  },
};

export const MUTABLE_PROPS: TRequiredProps<ICanvasMutableProps> = {
  __mutableProp: true,
  width: 'auto',
  height: 'auto',
  dpr: 'auto',
};
