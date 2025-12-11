import { Snap, SnapSlide } from '../..';

export interface ISnapSlideParallaxProps {
  snap: Snap;
  slide: SnapSlide;
  element: HTMLElement;
}

export interface ISnapSlideParallaxType {
  n: string;
  p: string;
  u: string;
  isAbs?: boolean;
  modifier?: (value: number) => number;
}

export interface ISnapSlideParallaxGroup {
  name: string;
  types: ISnapSlideParallaxType[];
}

export interface ISnapSlideParallaxItem extends ISnapSlideParallaxType {
  group: string;
  scope: number[];
  progress: number;
  target: number;
  value: number;
  offset: number;
  isInfluence: boolean;
  isDirectional: boolean;
  isAbs: boolean;
}
