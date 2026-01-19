import { IViewportCallbacksMap } from '@/core/exported';
import { initVevet } from '@/global/initVevet';

export type TOnResizeCallback = () => void;

export interface IOnResizeProps {
  /**
   * Callback to invoke on resize.
   */
  callback: TOnResizeCallback;

  /**
   * Elements to observe for size changes. If null, only viewport events are used.
   */
  element?: Element | Element[] | null;

  /**
   * Target viewport property for resize events (enables viewport listeners).
   * @default 'width'
   */
  viewportTarget?: keyof IViewportCallbacksMap;

  /**
   * Debounce delay (ms) for resize events.
   * @default 0
   */
  resizeDebounce?: number;

  /** Viewport callback name. Used for debugging */
  name?: string;
}

export interface IOnResize {
  /**
   * Remove all resize listeners.
   */
  remove: () => void;

  /**
   * Trigger the resize callback immediately.
   */
  resize: () => void;

  /**
   * Trigger the resize callback with `resizeDebounce` delay.
   */
  debounceResize: () => void;
}

/**
 * Adds resize listeners to elements (using `ResizeObserver`) and/or the viewport.
 *
 * @group Utils
 *
 * @example
 * const resizeWithElement = onResize({
 *   callback: () => console.log('Element resized'),
 *   element: document.getElementById('app'),
 * });
 *
 * const resizeWithViewport = onResize({
 *   callback: () => console.log('Viewport resized'),
 *   viewportTarget: 'width',
 * });
 *
 * const resizeWithBoth = onResize({
 *   callback: () => console.log('Both resized'),
 *   element: document.getElementById('app'),
 *   viewportTarget: 'any',
 * });
 */
export function onResize({
  callback,
  element,
  viewportTarget = 'width',
  resizeDebounce = 0,
  name,
}: IOnResizeProps): IOnResize {
  const core = initVevet();

  let timeout: NodeJS.Timeout | undefined;
  let resizeObserver: ResizeObserver | undefined;

  let viewportCallback: (() => void) | undefined;

  const debounceResize = (delay?: number) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    timeout = setTimeout(() => callback(), delay ?? resizeDebounce);
  };

  // Initialize ResizeObserver if element is provided
  if (element) {
    resizeObserver = new ResizeObserver(() => {
      debounceResize(core.props.resizeDebounce + resizeDebounce);
    });

    (Array.isArray(element) ? element : [element]).forEach((el) => {
      resizeObserver?.observe(el);
    });
  }

  // Attach viewport event listeners if specified
  if (viewportTarget) {
    viewportCallback = core.onResize(viewportTarget, () => debounceResize(), {
      name,
    });
  }

  return {
    remove: () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      resizeObserver?.disconnect();
      viewportCallback?.();
    },
    resize: () => callback(),
    debounceResize: () => debounceResize(),
  };
}
