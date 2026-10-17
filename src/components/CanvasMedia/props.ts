import { TRequiredProps } from '@/internal';

import {
  STATIC_PROPS as CANVAS_STATIC_PROPS,
  MUTABLE_PROPS as CANVAS_MUTABLE_PROPS,
} from '../Canvas/props';
import { ICanvasStaticPropsDeprecated } from '../Canvas/types';

import { ICanvasMediaStaticProps, ICanvasMediaMutableProps } from './types';

export const STATIC_PROPS: TRequiredProps<
  Omit<ICanvasMediaStaticProps, keyof ICanvasStaticPropsDeprecated>
> = {
  ...CANVAS_STATIC_PROPS,
  media: null as any,
  autoRenderVideo: true,
};

export const MUTABLE_PROPS: TRequiredProps<ICanvasMediaMutableProps> = {
  ...CANVAS_MUTABLE_PROPS,
  rule: 'cover',
};
