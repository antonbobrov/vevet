import { TRequiredProps } from '@/internal/requiredProps';

import {
  STATIC_PROPS as CANVAS_STATIC_PROPS,
  MUTABLE_PROPS as CANVAS_MUTABLE_PROPS,
} from '../Canvas/props';

import { ICanvasMediaStaticProps, ICanvasMediaMutableProps } from './types';

export const STATIC_PROPS: TRequiredProps<ICanvasMediaStaticProps> = {
  ...CANVAS_STATIC_PROPS,
  media: null as any,
  autoRenderVideo: true,
};

export const MUTABLE_PROPS: TRequiredProps<ICanvasMediaMutableProps> = {
  ...CANVAS_MUTABLE_PROPS,
  rule: 'cover',
};
