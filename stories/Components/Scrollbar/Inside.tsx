import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Scrollbar/props';
import {
  IScrollbarMutableProps,
  IScrollbarStaticProps,
  Scrollbar,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS } from './constants';

type TProps = Omit<
  IScrollbarStaticProps & IScrollbarMutableProps,
  '__mutableProp' | '__staticProp' | 'container' | 'eventsEmitter'
>;

export const InsideComponent: FC<TProps> = (props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Scrollbar>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    if (!parentRef.current || !scrollableRef.current) {
      return undefined;
    }

    const mod = new Scrollbar({
      ...input,
      container: scrollableRef.current,
      parent: parentRef.current,
    });

    setInstance(mod);

    return () => {
      mod.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <div ref={parentRef} style={{ position: 'relative', width: 250 }}>
      <div ref={scrollableRef} style={{ overflow: 'auto', height: 250 }}>
        <div
          style={{
            marginTop: 10,
            width: '100%',
            height: 150,
            background: '#ccc',
          }}
        />

        <div
          style={{
            marginTop: 10,
            width: '200%',
            height: 150,
            background: '#ccc',
          }}
        />

        <div
          style={{
            marginTop: 10,
            width: '100%',
            height: 150,
            background: '#ccc',
          }}
        />
      </div>
    </div>
  );
};
