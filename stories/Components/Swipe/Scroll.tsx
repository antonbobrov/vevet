import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Swipe/props';
import { Swipe, vevet } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS, TProps } from './constants';

const items = Array(50)
  .fill(0)
  .map((item, index) => index);

export const ScrollComponent: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Swipe>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const elements = Array.from(container.children) as HTMLDivElement[];

    const mod = new Swipe({
      ...input,
      container,
      bounds: () => ({ y: [0, -container.clientHeight + vevet.height] }),
      onMove: ({ movement }) => {
        elements.forEach((div) => {
          div.style.transform = `translateY(${movement.y}px)`;
        });
      },
    });

    setInstance(mod);

    mod.setMovement({ x: 125, y: 125 });

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
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;

            display: grid;
            gap: 16px;
            
            padding: 16px;
            box-sizing: border-box;

            background: #000;

            touch-action: none;
          }

          .container > div {
            padding: 16px;
            box-sizing: border-box;

            border-radius: 8px;
            background: #fff;
            will-change: transform;

            font-size: 20px;
            color: #000;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {items.map((item) => (
          <div key={item}>
            {item + 1} Lorem ipsum dolor sit amet consectetur adipiscing elit
          </div>
        ))}
      </div>
    </>
  );
};
