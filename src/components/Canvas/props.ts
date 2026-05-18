import { describeProps } from '@/internal/props';
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

export const TEST_PROPS = describeProps<
  typeof STATIC_PROPS & typeof MUTABLE_PROPS
>({
  container: [{ type: 'instance', instances: [HTMLElement] }],
  append: [{ type: 'bool' }],
  resizeOnInit: [{ type: 'bool' }],
  resizeOnRuntime: [{ type: 'bool' }],
  viewportTarget: [
    {
      type: 'str',
      options: [
        'width',
        'height',
        'both',
        'onlyWidth',
        'onlyHeight',
        'any',
        'trigger',
      ],
    },
  ],
  resizeDebounce: [{ type: 'num', min: 0 }],
  width: [
    { type: 'num', min: 0 },
    { type: 'str', options: ['auto'] },
  ],
  height: [
    { type: 'num', min: 0 },
    { type: 'str', options: ['auto'] },
  ],
  dpr: [
    { type: 'num', min: 0 },
    { type: 'str', options: ['auto'] },
  ],
});
