import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module';

/**
 * Static properties for configuring the InView module.
 */
export interface IInViewStaticProps extends IModuleStaticProps {
  /**
   * Determines whether elements leaving the viewport should trigger an event.
   * @default true
   */
  hasOut?: boolean;

  /**
   * Sets the maximum delay (in milliseconds) for initial element visibility. Delay is calculated based on element position.
   * @default 1000
   */
  maxInitialDelay?: number;

  /**
   * Defines the primary scrolling axis used for delay calculations.
   * @default 'vertical'
   */
  scrollDirection?: 'horizontal' | 'vertical';
}

/**
 * Mutable properties for managing the state of the InView module.
 */
export interface IInViewMutableProps extends IModuleMutableProps {
  /**
   * Enables or disables the `IntersectionObserver` instance.
   * @default true
   */
  enabled?: boolean;

  /**
   * Specifies the root margin offsets for the `IntersectionObserver`, allowing fine-tuned visibility detection.
   * @default '0% 0% -5% 0%'
   */
  rootMargin?: string;
}

/**
 * Callbacks available in the InView module.
 */
export interface IInViewCallbacksMap extends IModuleCallbacksMap {
  /**
   * Fires when an element enters the viewport.
   */
  in: {
    element: Element;
  };

  /**
   * Fires when an element leaves the viewport.
   */
  out: {
    element: Element;
  };
}

/**
 * Extended element interface for use with the InView module.
 */
export interface IInViewElement extends Element {
  /**
   * Indicates whether the element is currently in view.
   */
  $vevetInViewBool?: boolean;

  /**
   * Timeout reference for managing delays.
   */
  $vevetInViewTimeout?: NodeJS.Timeout;
}
