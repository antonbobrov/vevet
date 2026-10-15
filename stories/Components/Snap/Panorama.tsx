import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Snap/props';
import { ISnapMutableProps, ISnapStaticProps, Snap } from '@/index';

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
  'https://picsum.photos/id/758/400/600',
  'https://picsum.photos/id/760/400/600',
  'https://picsum.photos/id/770/400/600',
  'https://picsum.photos/id/780/400/600',
  'https://picsum.photos/id/790/400/600',
  'https://picsum.photos/id/800/400/600',
  'https://picsum.photos/id/810/400/600',
  'https://picsum.photos/id/820/400/600',
  'https://picsum.photos/id/830/400/600',
  'https://picsum.photos/id/840/400/600',
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

    const mod = new Snap({
      ...input,
      container,
      onUpdate: (data, { slides }) => {
        const depth = 200;
        const rotation = 20;
        const scale = 1 / (180 / rotation);
        const halfAngle = (rotation * Math.PI) / 180 / 2;

        slides.forEach(({ element, coord, progress, size }) => {
          const factor = 1 - Math.cos(progress * scale * Math.PI);

          const xOffset = progress * (size / 3) * factor;
          const zOffset = ((size * 0.5) / Math.sin(halfAngle)) * factor - depth;
          const rotateY = progress * rotation;

          element!.style.transform = `translateX(${coord + xOffset}px) translateZ(${zOffset}px) rotateY(${rotateY}deg)`;
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
            transform-style: preserve-3d;
            perspective: 2000px;
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 240px;
            min-width: 15%;
            aspect-ratio: 1 / 1.5;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.1);
            background-color: #fff;

            &:first-child {
              position: relative;
            }
          }
            
          .slide img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {SLIDES.map((src) => (
          <div key={src} className="slide">
            <img src={src} alt="" />
          </div>
        ))}
      </div>

      <Nav instance={instance} activeIndex={props.activeIndex} />
    </>
  );
};
