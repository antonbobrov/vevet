import { TEasingType } from '@/utils/math';

export namespace NApplication {
  export interface IProps {
    /**
     * Tablet identification max width
     * @default 1199
     */
    tablet: number;
    /**
     * Phone identification max width
     * @default 899
     */
    phone: number;
    /**
     * Vevet prefix
     * @default 'v-'
     */
    prefix: string;
    /**
     * Timeout of viewport callbacks
     * @default 16
     */
    resizeDebounce: number;
    /**
     * Easing function that is used in animations by default
     * @default [.25, .1, .25, 1]
     */
    easing: TEasingType;
    /**
     * Check if the browser supports WebP
     * @default false
     */
    shouldCheckWebpSupport: boolean;
    /**
     * How to detect the width of the viewport
     * @default 'boundingRect'
     */
    widthDetection: 'boundingRect' | 'clientWidth';
  }
}
