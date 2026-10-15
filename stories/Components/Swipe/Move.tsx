import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Swipe/props';
import { clamp, Pointers, Swipe } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS, TProps } from './constants';

export const MoveComponent: FC<TProps> = (props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const scalableRef = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Swipe>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const wrapper = wrapperRef.current;
    const thumb = thumbRef.current;
    const scalable = scalableRef.current;

    if (!wrapper || !thumb || !scalable) {
      return undefined;
    }

    const mod = new Swipe({
      ...input,
      container: wrapper,
      onMove: ({ movement }) => {
        thumb.style.transform = `translate(${movement.x}px, ${movement.y}px)`;
      },
    });

    setInstance(mod);

    mod.setMovement({ x: 125, y: 125 });

    let currentScale = 1;
    let currentAngle = 0;

    const pointers = new Pointers({
      container: wrapper,
      minPointers: 2,
      maxPointers: 2,
      onMove: ({ scale, prevScale, angle, prevAngle }) => {
        currentScale = clamp(currentScale + (scale - prevScale), 1, 2);
        currentAngle += angle - prevAngle;

        scalable.style.transform = `scale(${currentScale}) rotate(${currentAngle}deg)`;
      },
    });

    return () => {
      mod.destroy();
      setInstance(undefined);
      pointers.destroy();
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <style>
        {`
          .wrapper {
            position: relative;
            margin: 0 auto;

            width: 400px;
            max-width: 100%;
            height: 400px;

            background: #ddd;
          }

          .thumb {
            position: relative;
            width: 150px;
            height: 150px;
          }

          .scalable {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;


            display: flex;
            justify-content: center;
            align-items: center;

            background: #0000009e;
            color: #fff;
          }
        `}
      </style>

      <div ref={wrapperRef} className="wrapper">
        <div ref={thumbRef} className="thumb">
          <div ref={scalableRef} className="scalable">
            Drag Me
          </div>
        </div>
      </div>
    </>
  );
};
