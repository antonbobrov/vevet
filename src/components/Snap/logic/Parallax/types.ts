import { Snap } from '@/components/Snap';

import { SnapSlide } from '../Slide';

export interface ISnapParallaxProps {
  snap: Snap;
  slide: SnapSlide;
  element: HTMLElement;
}

export interface ISnapParallaxType {
  attr: string;
  prop: string;
  unit: string;
  isAbs?: boolean;
  modifier?: (value: number) => number;
}

export interface ISnapParallaxGroup {
  prop: string;
  types: ISnapParallaxType[];
}

export interface ISnapParallaxItem extends ISnapParallaxType {
  group: string;
  scope: number[];
  progress: number;
  target: number;
  value: number;
  offset: number;
  min: number;
  max: number;
  impulse: number;
  isDirectional: boolean;
  isAbs: boolean;
}
