import { EasingType } from 'easing-progress';

export namespace NApplication {
  export interface IProps {
    shouldPrintVersion: boolean;
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
     * Easing function that is used in animation as the default value
     * @default [.25, .1, .25, 1]
     */
    easing: EasingType;
    /**
     * Check if the browser supports WebP
     * @default false
     */
    shouldCheckWebpSupport: boolean;
  }
}
