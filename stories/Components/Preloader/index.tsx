import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Preloader/props';
import {
  IPreloaderCallbacksMap,
  IPreloaderMutableProps,
  IPreloaderStaticProps,
  Preloader,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  IPreloaderStaticProps & IPreloaderMutableProps,
  '__mutableProp' | '__staticProp' | 'container'
>;

const LOG_EVENTS: Record<keyof IPreloaderCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  loaded: true,
  hide: true,
  requestHide: true,
  hidden: true,
};

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Preloader>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const mod = new Preloader({
      ...input,
      container,
    });

    setInstance(mod);

    return () => {
      mod.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          height: 250,
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!props.hide && (
          <button type="button" onClick={() => instance?.hide(500)}>
            Hide
          </button>
        )}
      </div>

      <img src="https://picsum.photos/400/600" alt="" />

      <img src="https://picsum.photos/400/601" alt="" />

      <img src="https://picsum.photos/400/602" alt="" />
    </div>
  );
};
