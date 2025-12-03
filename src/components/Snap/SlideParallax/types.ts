import { Snap, SnapSlide } from '..';

export interface ISnapSlideParallaxProps {
  snap: Snap;
  slide: SnapSlide;
  element: HTMLElement;
}

export interface ISnapSlideParallaxType {
  name: string;
  prop: string;
  belongsTo: string;
  unit: string;
}

export interface ISnapSlideParallaxItem extends ISnapSlideParallaxType {
  scope: number[];
  progress: number;
  target: number;
  value: number;
  isInfluence: boolean;
  isDirectional: boolean;
  isAbs: boolean;
}
