import { TRequiredProps } from '@/internal/requiredProps';

import {
  STATIC_PROPS as PRELOADER_STATIC_PROPS,
  MUTABLE_PROPS as PRELOADER_MUTABLE_PROPS,
} from '../Preloader/props';

import {
  IProgressPreloaderMutableProps,
  IProgressPreloaderStaticProps,
} from './types';

export const STATIC_PROPS: TRequiredProps<IProgressPreloaderStaticProps> = {
  ...PRELOADER_STATIC_PROPS,
  resourceContainer: null as any,
  preloadImages: true,
  preloadVideos: false,
  customSelector: '.js-preload',
  ignoreClassName: 'js-preload-ignore',
  lerp: 0.1,
  endDuration: 500,
};

export const MUTABLE_PROPS: TRequiredProps<IProgressPreloaderMutableProps> = {
  ...PRELOADER_MUTABLE_PROPS,
};
