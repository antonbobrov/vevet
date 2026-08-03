import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Swipe/props';
import { Swipe } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS, TProps } from './constants';

export const RotationComponent: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Swipe>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const container = ref.current;
    const rotate = rotateRef.current;
    const thumb = thumbRef.current;

    if (!container || !rotate || !thumb) {
      return undefined;
    }

    const mod = new Swipe({
      ...input,
      container,
      thumb,
      onMove: ({ movement }) => {
        rotate.style.transform = `rotate(${movement.angle}deg)`;
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
            width: 300px;
            height: 300px;
          }

          .thumb_container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 2px solid #fff;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff00005e, #0000ff5e);
          }

          .thumb {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            background: linear-gradient(45deg, #ff0000ff, #0000ffff);
            border-radius: 50%;
          }

          .rotate {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            background: linear-gradient(45deg, #ff000074, #0000ff77);
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container">
        <div ref={rotateRef} className="thumb_container">
          <div ref={thumbRef} className="thumb" />
        </div>
      </div>
    </>
  );
};
