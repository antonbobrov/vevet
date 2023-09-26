import { NComponent } from '@/base/Component/types';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NScrollView {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Intersection root
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
     * @default null
     */
    intersectionRoot?: Element | null;
    /**
     * Define what states to trace.
     * @default 'in'
     */
    states?: 'in' | 'inout';
    /**
     * A class to be toggled on state change
     * @default 'viewed'
     */
    classToToggle?: string;
    /**
     * If need to use delays at first start
     * @default true
     */
    hasDelay?: boolean;
    /**
     * Max delay
     * @default 1000
     */
    maxDelay?: number;
    /**
     * Main scrolling direction
     * @default 'vertical'
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * Viewport target
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;
    /**
     * Timeout of resize event
     * @default 0
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Enable `IntersectionObserver`
     * @default true
     */
    isEnabled?: boolean;
    /**
     * `IntersectionObserver` margin (from -1 to 1)
     * @default 0.05
     */
    rootMargin?: number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    in: { element: Element };
    out: { element: Element };
  }

  export interface IElement extends Element {
    isScrollViewIn?: boolean;
  }
}
