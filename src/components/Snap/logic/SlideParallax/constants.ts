import { clamp } from '@/utils';

import { parallaxAttrPrefix } from './globals';
import { ISnapSlideParallaxGroup } from './types';

function attrName(name: string) {
  return `${parallaxAttrPrefix}${name}`;
}

export const parallaxGroups: ISnapSlideParallaxGroup[] = [
  {
    name: 'transform',
    types: [
      {
        n: attrName('x'),
        p: 'translateX',
        u: 'px',
      },
      {
        n: attrName('y'),
        p: 'translateY',
        u: 'px',
      },
      {
        n: attrName('z'),
        p: 'translateZ',
        u: 'px',
      },
      {
        n: attrName('scale'),
        p: 'scale',
        u: '',
        modifier: (value) => value + 1,
      },
      {
        n: attrName('scale-x'),
        p: 'scaleX',
        u: '',
        modifier: (value) => value + 1,
      },
      {
        n: attrName('scale-y'),
        p: 'scaleY',
        u: '',
        modifier: (value) => value + 1,
      },
      {
        n: attrName('skew'),
        p: 'skew',
        u: 'deg',
      },
      {
        n: attrName('skew-x'),
        p: 'skewX',
        u: 'deg',
      },
      {
        n: attrName('skew-y'),
        p: 'skewY',
        u: 'deg',
      },
      {
        n: attrName('rotate'),
        p: 'rotate',
        u: 'deg',
      },
      {
        n: attrName('rotate-x'),
        p: 'rotateX',
        u: 'deg',
      },
      {
        n: attrName('rotate-y'),
        p: 'rotateY',
        u: 'deg',
      },
      {
        n: attrName('rotate-z'),
        p: 'rotateZ',
        u: 'deg',
      },
    ],
  },

  {
    name: 'opacity',
    types: [
      {
        n: attrName('opacity'),
        p: 'opacity',
        u: '',
        isAbs: true,
        modifier: (value) => clamp(value + 1, 0, 1),
      },
    ],
  },
];

export const parallaxTypes = Object.values(parallaxGroups)
  .map(({ types }) => types)
  .flat();

export const parallaxAttributes = parallaxTypes.map(({ n }) => n);
