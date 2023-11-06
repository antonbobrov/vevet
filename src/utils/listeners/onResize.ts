import { NViewport } from '@/src/Application/events/Viewport';
import { NCallbacks } from '@/base/Callbacks';

export type TOnResizeTarget = keyof NViewport.ICallbacksTypes;

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
   * It will be used if `element` is not provided
   * or `ResizeObserver` is not supported.
   * @default 'any'
   */
  viewportTarget?: TOnResizeTarget;
  /**
   * Has both `vewport resize` and `ResizeObserver`
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
 * Add events on resize.
 * If `element` is provided, `ResizeObserver` will be used (first callback will not be fired).
 * Otherwise, viewport callbacks will be used.
 *
 * @example
 *
 * const handler = onResize({
 *   onResize: () => console.log('resize'),
 *   element: document.getElementById('app')!,
 *   viewportTarget: 'any',
 *   hasBothEvents: true,   // trace both element and viewport sizes
 *   resizeDebounce: 100,
 * });
 *
 * // resize with timeout called twice, but `onResize` will be called only once
 * handler.debounceResize();
 * handler.debounceResize();
 *
 * // resize without timeout
 * handler.resize();
 *
 * // remove listeners
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

  let viewportCallback: NCallbacks.IAddedCallback | undefined;

  const debounceResize = (props?: IOnResizeCallbackProps, delay?: number) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(
      () => handleResize(props ?? { trigger: 'unknown' }),
      delay ?? resizeDebounce,
    );
  };

  if (
    element &&
    (element instanceof Element || Array.isArray(element)) &&
    'ResizeObserver' in window
  ) {
    resizeObserver = new ResizeObserver(() => {
      if (isFirstResizeObserverCallback) {
        isFirstResizeObserverCallback = false;

        return;
      }

      debounceResize(
        { trigger: 'ResizeObserver' },
        window.vevetApp.props.resizeDebounce + resizeDebounce,
      );
    });

    if (Array.isArray(element)) {
      element.forEach((item) => resizeObserver?.observe(item));
    } else {
      resizeObserver.observe(element);
    }
  }

  if (hasBothEvents || !resizeObserver) {
    viewportCallback = window.vevetApp.viewport.add(viewportTarget, () =>
      debounceResize({ trigger: 'Viewport' }),
    );
  }

  return {
    remove: () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      resizeObserver?.disconnect();
      viewportCallback?.remove();
    },
    resize: () => handleResize({ trigger: 'unknown' }),
    debounceResize: () => debounceResize(),
    hasResizeObserver: !!resizeObserver,
  };
}
