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
      onUpdate: (data, { containerSize, slides }) => {
        const radius = containerSize / 2;
        const p2 = Math.PI * 2;
        const offset = Math.PI * -0.5;

        slides.forEach((slide) => {
          const element = slide.element!;
          const progress = slide.progress / slides.length;

          const x = Math.cos(p2 * progress + offset) * radius;
          const y = Math.sin(p2 * progress + offset) * radius;
          const rotation = p2 * progress;

          element.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rotation}rad)`;
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
            --size: min(50vh, 50vw);

            position: relative;
            margin: 0 auto;
            width: var(--size);
            height: var(--size);
          }
            
          .slide {
            --slide-size: calc(var(--size) / 5);

            position: absolute;
            top: calc(50% - var(--slide-size) / 2);
            left: calc(50% - var(--slide-size) / 2);
            width: var(--slide-size);
            height: var(--slide-size);

            display: flex;
            justify-content: center;
            align-items: center;
          }

          .wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            border-radius: 8px;
            overflow: hidden;
            
            background: #000;
          }

          .wrapper img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {SLIDES.map((src) => (
          <div key={src} className="slide">
            <div
              className="wrapper"
              data-snap-parallax-scale="-5"
              data-snap-parallax-scale-min="0.755"
              data-snap-parallax-scale-impulse
              data-snap-parallax-scale-abs
              data-snap-parallax-scale-scope="1,1"
              data-snap-parallax-skew="-200"
              data-snap-parallax-skew-min="-30"
              data-snap-parallax-skew-max="30"
              data-snap-parallax-skew-impulse
              data-snap-parallax-skew-directional
              data-snap-parallax-skew-scope="1,1"
            >
              <img src={src} alt="" />
            </div>
          </div>
        ))}
      </div>

      <Nav instance={instance} activeIndex={props.activeIndex} />
    </>
  );
};
