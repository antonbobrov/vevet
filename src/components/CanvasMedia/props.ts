import { describeProps } from '@/internal/props';
import { TRequiredProps } from '@/internal/requiredProps';

import { Canvas } from '../Canvas';
import {
  STATIC_PROPS as CANVAS_STATIC_PROPS,
  MUTABLE_PROPS as CANVAS_MUTABLE_PROPS,
  TEST_PROPS as CANVAS_TEST_PROPS,
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

export const TEST_PROPS = describeProps<
  typeof STATIC_PROPS & typeof MUTABLE_PROPS
>({
  ...CANVAS_TEST_PROPS.rules,
  media: [
    {
      type: 'instance',
      instances: [
        Canvas,
        HTMLImageElement,
        SVGImageElement,
        HTMLVideoElement,
        HTMLCanvasElement,
      ],
    },
  ],
  autoRenderVideo: [{ type: 'bool' }],
  rule: [
    {
      type: 'str',
      options: [
        'cover',
        'contain',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'center',
      ],
    },
  ],
});
