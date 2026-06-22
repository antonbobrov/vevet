import { clamp } from '@/utils';

import { ISnapParallaxGroup } from './types';
import { getAttrName } from './utils';

export const PARALLAX_GROUPS: ISnapParallaxGroup[] = [
  {
    prop: 'transform',
    types: [
      {
        attr: getAttrName('x'),
        prop: 'translateX',
        unit: 'px',
      },
      {
        attr: getAttrName('y'),
        prop: 'translateY',
        unit: 'px',
      },
      {
        attr: getAttrName('z'),
        prop: 'translateZ',
        unit: 'px',
      },
      {
        attr: getAttrName('scale'),
        prop: 'scale',
        unit: '',
        modifier: (value) => value + 1,
      },
      {
        attr: getAttrName('scale-x'),
        prop: 'scaleX',
        unit: '',
        modifier: (value) => value + 1,
      },
      {
        attr: getAttrName('scale-y'),
        prop: 'scaleY',
        unit: '',
        modifier: (value) => value + 1,
      },
      {
        attr: getAttrName('skew'),
        prop: 'skew',
        unit: 'deg',
      },
      {
        attr: getAttrName('skew-x'),
        prop: 'skewX',
        unit: 'deg',
      },
      {
        attr: getAttrName('skew-y'),
        prop: 'skewY',
        unit: 'deg',
      },
      {
        attr: getAttrName('rotate'),
        prop: 'rotate',
        unit: 'deg',
      },
      {
        attr: getAttrName('rotate-x'),
        prop: 'rotateX',
        unit: 'deg',
      },
      {
        attr: getAttrName('rotate-y'),
        prop: 'rotateY',
        unit: 'deg',
      },
      {
        attr: getAttrName('rotate-z'),
        prop: 'rotateZ',
        unit: 'deg',
      },
    ],
  },

  {
    prop: 'opacity',
    types: [
      {
        attr: getAttrName('opacity'),
        prop: 'opacity',
        unit: '',
        isAbs: true,
        modifier: (value) => clamp(value + 1, 0, 1),
      },
    ],
  },
];

export const PARALLAX_TYPES = PARALLAX_GROUPS.map(({ types }) => types).flat();

export const PARALLAX_ATTRIBUTES = PARALLAX_TYPES.map(({ attr }) => attr);
