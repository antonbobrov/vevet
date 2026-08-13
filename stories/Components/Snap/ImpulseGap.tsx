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
  '#A8E6CF',
  '#DCEDC1',
  '#FFD3B6',
  '#FF8B94',
  'rgba(172, 162, 92, 1)',
  '#654b4bff',
  '#61783bff',
  '#9e6a48ff',
  '#a33c45ff',
  'rgba(149, 112, 112, 1)',
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
        slides.forEach(({ element, coord }) => {
          element!.style.transform = `translateX(${coord}px)`;
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
            --size: min(30vw, 50vh);

            position: relative;
            margin: 0 auto;
            width: 100%;
            height: var(--size);

            @media (orientation: portrait) {
              --size: min(30vh, 50vw);
            }
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: var(--size);
            height: 100%;
          }
            
          .slide .wrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            
            display: flex;
            justify-content: center;
            align-items: center;
            
            font-size: 25px;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {SLIDES.map((color, index) => (
          <div key={color} className="slide">
            <div
              className="wrap"
              style={{ backgroundColor: color }}
              data-snap-parallax-x="-50%"
              data-snap-parallax-x-scope="none"
              data-snap-parallax-x-impulse="3"
            >
              {index}
            </div>
          </div>
        ))}
      </div>

      <Nav instance={instance} activeIndex={props.activeIndex} />
    </>
  );
};
