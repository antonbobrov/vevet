import { parallaxAttrPrefix } from './globals';
import { ISnapSlideParallaxType } from './types';

function attrName(name: string) {
  return `${parallaxAttrPrefix}${name}`;
}

export const transform = 'transform';
export const opacity = 'opacity';

export const parallaxGroups = [transform, opacity];

export const parallaxTypes: ISnapSlideParallaxType[] = [
  {
    name: attrName('x'),
    prop: 'translateX',
    belongsTo: transform,
    unit: 'px',
  },
  {
    name: attrName('y'),
    prop: 'translateY',
    belongsTo: transform,
    unit: 'px',
  },
  {
    name: attrName('z'),
    prop: 'translateZ',
    belongsTo: transform,
    unit: 'px',
  },
  {
    name: attrName('scale'),
    prop: 'scale',
    belongsTo: transform,
    unit: '',
  },
  {
    name: attrName('scale-x'),
    prop: 'scaleX',
    belongsTo: transform,
    unit: '',
  },
  {
    name: attrName('scale-y'),
    prop: 'scaleY',
    belongsTo: transform,
    unit: '',
  },
  {
    name: attrName('skew'),
    prop: 'skew',
    belongsTo: transform,
    unit: 'deg',
  },
  {
    name: attrName('skew-x'),
    prop: 'skewX',
    belongsTo: transform,
    unit: 'deg',
  },
  {
    name: attrName('skew-y'),
    prop: 'skewY',
    belongsTo: transform,
    unit: 'deg',
  },
  {
    name: attrName('rotate'),
    prop: 'rotate',
    belongsTo: transform,
    unit: 'deg',
  },
  {
    name: attrName('rotate-x'),
    prop: 'rotateX',
    belongsTo: transform,
    unit: 'deg',
  },
  {
    name: attrName('rotate-y'),
    prop: 'rotateY',
    belongsTo: transform,
    unit: 'deg',
  },
  {
    name: attrName('rotate-z'),
    prop: 'rotateZ',
    belongsTo: transform,
    unit: 'deg',
  },
  {
    name: attrName('opacity'),
    prop: opacity,
    belongsTo: opacity,
    unit: '',
  },
];

export const parallaxAttributes = parallaxTypes.map(({ name }) => name);
