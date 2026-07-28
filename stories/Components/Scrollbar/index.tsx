import React, { FC, useState } from 'react';

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

export const Component: FC<TProps> = (props) => {
  const [instance, setInstance] = useState<Scrollbar>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const mod = new Scrollbar({
      ...input,
    });

    setInstance(mod);

    return () => {
      mod.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: '.vevet-story { overflow: visible; }',
        }}
      ></style>

      <div
        style={{
          marginTop: 10,
          width: '100vw',
          height: 300,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '200vw',
          height: 300,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100vw',
          height: 300,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100vw',
          height: 300,
          background: '#ccc',
        }}
      />
    </>
  );
};
