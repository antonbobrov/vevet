import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Pointers/props';
import {
  IPointersCallbacksMap,
  IPointersMutableProps,
  IPointersStaticProps,
  Pointers,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  IPointersStaticProps & IPointersMutableProps,
  '__mutableProp' | '__staticProp' | 'container'
>;

const LOG_EVENTS: Record<keyof IPointersCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  start: true,
  pointerdown: true,
  pointermove: false,
  move: true,
  pointerup: true,
  end: true,
};

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Pointers>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input) => {
    const container = ref.current;
    const thumbs = Array.from(ref.current?.children || []) as HTMLElement[];

    if (!container || thumbs.length === 0) {
      return undefined;
    }

    const mod = new Pointers({
      ...input,
      container,
      onPointermove: ({ pointer }) => {
        const finger = thumbs[pointer.index];

        finger.style.opacity = '1';
        finger.style.transform = `translate(${pointer.current.x}px, ${pointer.current.y}px)`;
      },
      onPointerup: ({ pointer }) => {
        const finger = thumbs[pointer.index];

        finger.style.opacity = '0';
      },
      onStart: () => {
        container.style.backgroundColor = '#ccc';
      },
      onEnd: () => {
        container.style.backgroundColor = '';
      },
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
      <style>
        {`
          .container {
            position: relative;
            width: 100%;
            height: 80svh;
            background-color: #000;
            touch-action: none;
          }
            
          .thumb {
            position: absolute;
            top: -25px;
            left: -25px;
            width: 50px;
            height: 50px;
            border-radius: 50%;

            opacity: 0;
          }
        `}
      </style>

      <div ref={ref} className="container">
        <div className="thumb" style={{ background: 'red' }} />

        <div className="thumb" style={{ background: 'green' }} />

        <div className="thumb" style={{ background: 'blue' }} />

        <div className="thumb" style={{ background: 'yellow' }} />

        <div className="thumb" style={{ background: 'white' }} />
      </div>
    </>
  );
};
