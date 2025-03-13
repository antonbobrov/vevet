import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';

/** Static properties for the ScrollProgress module */
export interface IScrollProgressStaticProps extends IModuleStaticProps {
  /**
   * The element whose scroll progress is tracked.
   */
  section: Element;

  /**
   * The root element used as a reference for scroll progress calculation.
   * Usually it is the scroll container.
   * If `null`, the viewport is used as the reference.
   * @default null
   */
  root?: Element | null;

  /**
   * If `true`, progress is calculated only while the section is within the viewport or the root element.
   * Improves performance by avoiding unnecessary calculations.
   * @default true
   */
  optimized?: boolean;

  /**
   * If `true`, the scroll progress is calculated based on the small viewport height (svh in css) instead of the current viewport height (vh in css).
   * @default false
   */
  useSvh?: boolean;
}

/** Mutable properties for the ScrollProgress module */
export interface IScrollProgressMutableProps extends IModuleMutableProps {}

/** Callbacks for ScrollProgress module events */
export interface IScrollProgressCallbacksMap extends IModuleCallbacksMap {
  /**
   * Triggered on each scroll progress update.
   */
  update: undefined;
}

export interface IScrollProgressBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}
