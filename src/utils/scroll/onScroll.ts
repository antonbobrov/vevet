/* eslint-disable no-underscore-dangle */
import { IRemovable } from '@/types/general';
import { uid } from '../common';
import type { CustomScroll } from '@/components/CustomScroll';
import { getScrollValues } from './getScrollValues';
import { selectOne } from '../dom/selectOne';
import { addEventListener } from '../dom/addEventListener';

export type TOnScrollContainer = string | Element | CustomScroll | Window;

export interface IOnScrollCallbackParameter {
  scrollTop: number;
  scrollLeft: number;
}

interface IInstance {
  id: string;
  container: TOnScrollContainer;
  callbacks: {
    id: string;
    callback: (data: IOnScrollCallbackParameter) => void;
  }[];
  isPassive: boolean;
  listeners: IRemovable[];
}

export interface IOnScrollProps {
  container: TOnScrollContainer;
  callback: (data: IOnScrollCallbackParameter) => void;
  isPassive?: boolean;
}

declare global {
  interface Window {
    __vevetOnScrollInstances: IInstance[];
  }
}

if (typeof window !== 'undefined') {
  window.__vevetOnScrollInstances = [];
}

/**
 * Add `onScroll` event listener to the provided container (DOM element, custom scroll, or window).
 * It automatically manages multiple scroll listeners by stacking them in instances.
 *
 * If an instance already exists for the container, it adds the new callback to the existing stack.
 * Otherwise, it creates a new scroll listener.
 *
 * This function supports both native scrollable elements and `CustomScroll` instances.
 *
 * @example
 *
 * onScroll({
 *   container: window,
 *   callback: ({ scrollLeft, scrollTop }) => console.log(scrollLeft, scrollTop),
 *   isPassive: true,
 * });
 */
export function onScroll({
  container,
  callback,
  isPassive = false,
}: IOnScrollProps): IRemovable {
  // Check if a listener for this container already exists
  let instance = window.__vevetOnScrollInstances.find(
    (data) => data.container === container && data.isPassive === isPassive,
  )!;

  const callbackId = uid('scroll-event');

  // If a listener exists, we just add a new callback to its stack
  if (instance) {
    instance.callbacks.push({ id: callbackId, callback });
  } else {
    // Otherwise, create a new instance
    instance = {
      id: uid('scroll-event-instance'),
      container,
      callbacks: [{ id: callbackId, callback }],
      isPassive,
      listeners: [],
    };
    window.__vevetOnScrollInstances.push(instance);

    // Custom scroll events
    if (typeof container === 'object' && 'isCustomScroll' in container) {
      instance.listeners.push(
        container.addCallback(
          'render',
          () => {
            const { scrollTop, scrollLeft } = container;

            instance.callbacks.forEach((item) =>
              item.callback({ scrollTop, scrollLeft }),
            );
          },
          { name: 'onScroll' },
        ),
      );
    } else {
      // DOM scroll events
      const domContainer = selectOne(container) as any;

      const listener = addEventListener(
        domContainer,
        'scroll',
        () => {
          const data = getScrollValues(domContainer);
          if (!data) {
            return;
          }

          instance.callbacks.forEach((item) => item.callback(data));
        },
        { passive: isPassive },
      );

      const removeListener = {
        remove: listener,
      };

      instance.listeners.push(removeListener);
    }
  }

  // Removes the scroll listener
  const remove = () => {
    const newCallbacks = instance.callbacks.filter(
      (item) => item.id !== callbackId,
    );

    instance.callbacks = newCallbacks;

    if (newCallbacks.length === 0) {
      instance.listeners.forEach((listener) => listener.remove());
      window.__vevetOnScrollInstances = window.__vevetOnScrollInstances.filter(
        (item) => item.id !== instance.id,
      );
    }
  };

  return { remove };
}
