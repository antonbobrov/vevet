import { Snap } from '@/components/Snap';

import { SnapSlide } from '..';

export interface ISnapSlideParallaxProps {
  snap: Snap;
  slide: SnapSlide;
  element: HTMLElement;
}

export interface ISnapSlideParallaxType {
  attr: string;
  prop: string;
  unit: string;
  isAbs?: boolean;
  modifier?: (value: number) => number;
}

export interface ISnapSlideParallaxGroup {
  prop: string;
  types: ISnapSlideParallaxType[];
}

export interface ISnapSlideParallaxItem extends ISnapSlideParallaxType {
  group: string;
  scope: number[];
  progress: number;
  target: number;
  value: number;
  offset: number;
  min: number;
  max: number;
  influence: number;
  isDirectional: boolean;
  isAbs: boolean;
}
