import { ISnapSlideProps } from './global';

export interface ISnapSlideCtx {
  getGlobalSlideSize: () => ISnapSlideProps['size'];
  getContainerSize: () => number;
  getAxis: () => 'x' | 'y';
  getContainer: () => HTMLElement;
  getOrigin: () => 'start' | 'center' | 'end';
  getCanLoop: () => boolean;
  requestGlobalResize: (isManual: boolean) => void;
  getMax: () => number;
  getLoop: () => boolean;
  getFirstSlideSize: () => number;
  getImpulse: () => number;
}
