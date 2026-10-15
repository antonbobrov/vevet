import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Snap/props';
import {
  clamp,
  inRange,
  ISnapMutableProps,
  ISnapStaticProps,
  Snap,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS } from './constants';
import { Nav } from './Nav';

type TProps = Omit<
  ISnapStaticProps & ISnapMutableProps,
  '__mutableProp' | '__staticProp' | 'container' | 'eventsEmitter'
>;

const SLIDES = [
  '#FF4C4C',
  '#FF8000',
  '#FFD700',
  '#00CC66',
  '#0099FF',
  '#9933FF',
  '#FF33CC',
];

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Snap>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    let startIndex = 0;

    const mod = new Snap({
      ...input,
      container,
      onSwipeStart: (data, { activeIndex }) => {
        startIndex = activeIndex;
      },
      onUpdate: (data, snap) => {
        const baseRotation = 6;
        const baseX = 12;
        const baseZ = -100;
        const maxVisible = 6;

        snap.slides.forEach(({ element, index, progress }) => {
          let x = -baseX * progress;
          let rotate = progress * -baseRotation;
          const z = Math.abs(progress) * baseZ;

          if (inRange(progress, -1, 1)) {
            if (startIndex === index) {
              x += Math.sin(Math.PI * progress) * -60;
            } else {
              x += Math.sin(Math.PI * progress) * -20;
            }
          }

          x = clamp(x, -baseX * maxVisible, baseX * maxVisible);

          rotate = clamp(
            rotate,
            -baseRotation * maxVisible,
            baseRotation * maxVisible,
          );

          element!.style.transform = `translateX(${x}%) translateZ(${z}px) rotate(${rotate}deg)`;
        });
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
            width: 240px;
            height: 320px;

            transform-style: preserve-3d;
            perspective: 1000px;
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            border-radius: 20px;

            font-family: 'Arial';
            font-weight: bold;
            font-size: 20px;
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {SLIDES.map((color, index) => (
          <div key={color} className="slide" style={{ backgroundColor: color }}>
            Slide {index}
          </div>
        ))}
      </div>

      <Nav instance={instance} activeIndex={props.activeIndex} />
    </>
  );
};
