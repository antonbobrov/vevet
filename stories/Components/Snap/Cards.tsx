import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Snap/props';
import { clamp, ISnapMutableProps, ISnapStaticProps, Snap } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS } from './constants';
import { Nav } from './Nav';

type TProps = Omit<
  ISnapStaticProps & ISnapMutableProps,
  '__mutableProp' | '__staticProp' | 'container' | 'eventsEmitter'
>;

const SLIDES = [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3];

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Snap>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const mod = new Snap({
      ...input,
      container,
      onUpdate: (data, snap) => {
        snap.slides.forEach(({ element, size, progress }) => {
          const translationAmp = size * 0.5;

          const isPrev = progress > 0;
          const rotateAmp = isPrev ? 20 : 160;

          let rotate = rotateAmp * Math.abs(progress);
          rotate = clamp(rotate, 0, 180);

          const depth = progress ** 2 * -size * (isPrev ? 0.35 : 0.5);
          const x = translationAmp * -progress;

          element!.style.transform = `translateX(${x}px) translateZ(${depth}px) rotateY(${rotate}deg)`;
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
            width: 350px;
            height: 220px;

            transform-style: preserve-3d;
            perspective: 1000px;
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {SLIDES.map((num) => (
          <div
            key={num}
            className="slide"
            style={{ backgroundImage: `url(/cards/${num}.png)` }}
          />
        ))}
      </div>

      <Nav instance={instance} activeIndex={props.activeIndex} />
    </>
  );
};
