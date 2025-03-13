import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module';

/**
 * Static properties for the Marquee component.
 */
export interface IMarqueeStaticProps extends IModuleStaticProps {
  /**
   * The container element that holds the marquee content.
   */
  container: HTMLElement;

  /**
   * The debounce delay for the resize event in milliseconds.
   * @default 0
   */
  resizeDebounce?: number;

  /**
   * Determines whether to apply the `will-change` CSS property to the marquee elements to optimize rendering.
   * Setting this to `true` may improve performance.
   * @default true
   */
  hasWillChange?: boolean;

  /**
   * Indicates whether to clone the marquee nodes.
   * Indicates whether to clone the marquee nodes. Can be set to `false` if DOM cloning is not preferred.
   * @default true
   */
  cloneNodes?: boolean;
}

/**
 * Mutable properties for the Marquee component.
 */
export interface IMarqueeMutableProps extends IModuleMutableProps {
  /**
   * The speed of the marquee animation. Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 1
   */
  speed?: number | string;

  /**
   * The gap between the marquee elements. Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 0
   */
  gap?: number | string;

  /**
   * Enables or disables the marquee animation.
   * When `false`, the marquee will be paused.
   * @default true
   */
  enabled?: boolean;

  /**
   * Pauses the marquee when the mouse hovers over it.
   * @default false
   */
  pauseOnHover?: boolean;

  /**
   * Centers the marquee content within the container.
   * @default false
   */
  centered?: boolean;

  /**
   * When need to use dynamic FPS factor to adjust the speed of the marquee.
   * @default true
   */
  adjustSpeed?: boolean;

  /**
   * Pauses the marquee when the mouse leaves the viewport.
   * @default true
   */
  pauseOnOut?: boolean;
}

/**
 * Marquee callbacks
 */
export interface IMarqueeCallbacksMap extends IModuleCallbacksMap {
  /**
   * Called during marquee rendering.
   */
  render: undefined;

  /**
   * Called on marquee resize
   */
  resize: undefined;
}
