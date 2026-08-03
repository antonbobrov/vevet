import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Swipe/props';
import { Swipe } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS, TProps } from './constants';

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Swipe>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const mod = new Swipe({
      ...input,
      container,
      onMove: ({ current }) => {
        container.innerHTML = `${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
      },
      onEnd: () => {
        console.log('end');
        ref.current!.innerHTML = 'end';
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
            margin: 0 auto;
            width: 200px;
            height: 200px;

            display: flex;
            justify-content: center;
            align-items: center;          
            
            background: #000;
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container">
        Swipe me
      </div>
    </>
  );
};
