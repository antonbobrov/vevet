import { addEventListener, selectOne } from 'vevet-dom';
import { IRemovable } from '@/types/general';
import { uid } from '../common';
import type { SmoothScroll } from '@/components/SmoothScroll';
import { getScrollValues } from './getScrollValues';

type TContainer = string | Element | SmoothScroll | Window;

export interface IOnScrollCallbackParameter {
  scrollTop: number;
  scrollLeft: number;
}

interface IInstance {
  id: string;
  container: TContainer;
  callbacks: {
    id: string;
    callback: (data: IOnScrollCallbackParameter) => void;
  }[];
  isPassive: boolean;
  listeners: IRemovable[];
}

export interface IOnScrollProps {
  container: TContainer;
  callback: (data: IOnScrollCallbackParameter) => void;
  isPassive?: boolean;
}

let instances: IInstance[] = [];

/**
 * Add `onScroll` event
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
  // check if listeners for this element already exist
  let instance = instances.find(
    (data) => data.container === container && data.isPassive === isPassive,
  )!;

  const callbackId = uid('scroll-event');

  // if a listener exists, we just add a new callback to its stack
  if (instance) {
    instance.callbacks.push({ id: callbackId, callback });
  } else {
    // otherwise we create a new instance
    instance = {
      id: uid('scroll-event-instance'),
      container,
      callbacks: [{ id: callbackId, callback }],
      isPassive,
      listeners: [],
    };
    instances.push(instance);

    // smooth scroll events
    if (typeof container === 'object' && 'isSmoothScroll' in container) {
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
      // dom scroll events
      const domContainer = selectOne(container) as any;

      instance.listeners.push(
        addEventListener(
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
        ),
      );
    }
  }

  const remove = () => {
    const newCallbacks = instance.callbacks.filter(
      (item) => item.id !== callbackId,
    );

    instance.callbacks = newCallbacks;

    if (newCallbacks.length === 0) {
      instance.listeners.forEach((listener) => listener.remove());
      instances = instances.filter((item) => item.id !== instance.id);
    }
  };

  return { remove };
}
