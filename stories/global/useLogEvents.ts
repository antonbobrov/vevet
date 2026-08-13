import { action } from '@storybook/addon-actions';
import { useEffect, useMemo, useRef } from 'react';

import { IModuleCallbacksMap, Module } from '@/index';

type TSourceCallbacks<Source> =
  NonNullable<Source> extends Module<infer Callbacks, any, any>
    ? Callbacks
    : never;

export type TLogEventsConfig<Callbacks extends IModuleCallbacksMap> = Record<
  keyof Callbacks,
  boolean
>;

function getEnabledEvents<Callbacks extends IModuleCallbacksMap>(
  events: Record<keyof Callbacks, boolean>,
) {
  return (Object.keys(events) as (keyof Callbacks & string)[]).filter(
    (event) => events[event],
  );
}

export function useLogEvents<
  Source extends Module<any, any, any>,
  Events extends Record<keyof TSourceCallbacks<Source>, boolean>,
>(source: Source | undefined | null, events: Events) {
  const actionsRef = useRef(new Map<string, ReturnType<typeof action>>());
  const enabledEvents = useMemo(() => getEnabledEvents(events), [events]);
  const eventsKey = enabledEvents.join('\0');

  useEffect(() => {
    if (!source) {
      return undefined;
    }

    action('mount')();

    const subscriptions = enabledEvents.map((event) => {
      let log = actionsRef.current.get(event);

      if (!log) {
        log = action(event);
        actionsRef.current.set(event, log);
      }

      return source.on(event, log);
    });

    return () => {
      subscriptions.forEach((fn) => fn?.());
    };
  }, [source, enabledEvents, eventsKey]);
}
