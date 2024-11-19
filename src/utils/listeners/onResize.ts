import { getApp } from '../internal/getApp';
import { IViewportCallbackTypes } from '@/src/Vevet/events/createViewport/types';

export type TOnResizeTarget = keyof IViewportCallbackTypes;

export interface IOnResizeCallbackProps {
  trigger: 'unknown' | 'Viewport' | 'ResizeObserver';
}

export type TOnResizeCallback = (props: IOnResizeCallbackProps) => void;

export interface IOnResizeProps {
  /** Callback on resize */
  onResize: TOnResizeCallback;
  /** Observable element */
  element?: Element | Element[] | false;
  /**
   * Viewport target on resize.
   * It will be used if `element` is not provided or `ResizeObserver` is not supported.
   * @default 'any'
   */
  viewportTarget?: TOnResizeTarget;
  /**
   * Has both `viewport` callbacks and `ResizeObserver`
   * @default false
   */
  hasBothEvents?: boolean;
  /**
   * Resize debounce timeout
   * @default 0
   */
  resizeDebounce?: number;
}

export interface IOnResize {
  /** Remove resize events */
  remove: () => void;
  /** Launch resize callback */
  resize: () => void;
  /** Launch resize callback with debounce */
  debounceResize: () => void;
  /** `ResizeObserver` was used */
  hasResizeObserver: boolean;
}

/**
 * Adds resize event listeners to either an element (using `ResizeObserver`) or the viewport (using custom resize events).
 * It handles debouncing and allows the removal of listeners when no longer needed.
 * If both `element` and `hasBothEvents` are provided, both `ResizeObserver` and viewport resize events will be used.
 *
 * @example
 *
 * const handler = onResize({
 *   onResize: () => console.log('resize'),
 *   element: document.getElementById('app')!,
 *   viewportTarget: 'any',
 *   hasBothEvents: true,   // Trace both element and viewport sizes
 *   resizeDebounce: 100,
 * });
 *
 * // Trigger resize with debounce
 * handler.debounceResize();
 * handler.debounceResize();
 *
 * // Trigger resize without debounce
 * handler.resize();
 *
 * // Remove listeners
 * handler.remove();
 */
export function onResize({
  onResize: handleResize,
  element,
  viewportTarget = 'any',
  hasBothEvents = false,
  resizeDebounce = 0,
}: IOnResizeProps): IOnResize {
  let timeout: NodeJS.Timeout | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let isFirstResizeObserverCallback = true;

  let viewportCallback: (() => void) | undefined;

  const debounceResize = (props?: IOnResizeCallbackProps, delay?: number) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(
      () => handleResize(props ?? { trigger: 'unknown' }),
      delay ?? resizeDebounce,
    );
  };

  if (element && (element instanceof Element || Array.isArray(element))) {
    resizeObserver = new ResizeObserver(() => {
      if (isFirstResizeObserverCallback) {
        isFirstResizeObserverCallback = false;

        return;
      }

      debounceResize(
        { trigger: 'ResizeObserver' },
        getApp().props.resizeDebounce + resizeDebounce,
      );
    });

    if (Array.isArray(element)) {
      element.forEach((item) => resizeObserver?.observe(item));
    } else {
      resizeObserver.observe(element);
    }
  }

  if (hasBothEvents || !resizeObserver) {
    viewportCallback = getApp().onViewport(viewportTarget, () =>
      debounceResize({ trigger: 'Viewport' }),
    );
  }

  return {
    remove: () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      resizeObserver?.disconnect();
      viewportCallback?.();
    },
    resize: () => handleResize({ trigger: 'unknown' }),
    debounceResize: () => debounceResize(),
    hasResizeObserver: !!resizeObserver,
  };
}
