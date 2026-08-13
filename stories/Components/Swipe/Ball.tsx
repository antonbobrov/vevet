import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Swipe/props';
import { clamp, Swipe, vevet } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS, TProps } from './constants';

export const BallComponent: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Swipe>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    let x = 0;
    let y = 0;

    let xDir = 1;
    let yDir = 1;

    const mod = new Swipe({
      ...input,
      container,
      onStart: () => {
        xDir = 1;
        yDir = 1;
      },
      onMove: ({ step }) => {
        if (mod.hasInertia) {
          if (x >= vevet.width / 2 || x <= -vevet.width / 2) {
            xDir *= -1;
          }

          if (y >= vevet.height / 2 || y <= -vevet.height / 2) {
            yDir *= -1;
          }
        }

        x = clamp(x + step.x * xDir, -vevet.width / 2, vevet.width / 2);
        y = clamp(y + step.y * yDir, -vevet.height / 2, vevet.height / 2);

        mod.container.style.transform = `translate(${x}px, ${y}px)`;
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
            top: 50%;
            left: 50%;
            margin: -50px 0 0 -50px;
            width: 100px;
            height: 100px;
            border-radius: 50%;

            display: flex;
            justify-content: center;
            align-items: center;

            touch-action: none;
            
            background: #000;
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container" />
    </>
  );
};
