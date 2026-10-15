import { ISnapSlideCtx } from '../ctx';

export interface ISnapSlideCoordsCtx extends ISnapSlideCtx {
  getSlideSize: () => number;
  index: number;
}
