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
  'https://picsum.photos/id/757/400/600',
  'https://picsum.photos/id/59/400/600',
  'https://picsum.photos/id/400/400/600',
  'https://picsum.photos/id/260/400/600',
  'https://picsum.photos/id/358/400/600',
  'https://picsum.photos/id/478/400/600',
  'https://picsum.photos/id/625/400/600',
  'https://picsum.photos/id/356/400/600',
  'https://picsum.photos/id/380/400/600',
  'https://picsum.photos/id/652/400/600',
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
      onUpdate: (data, snap) => {
        snap.slides.forEach(({ element, coord, progress }) => {
          const z = Math.abs(progress ** 2) * -150;
          const rZ = progress * 5;

          element!.style.transform = `translateX(${coord}px) translateZ(${z}px) rotateZ(${rZ}deg)`;
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
            width: 100%;
            height: 300px;
            perspective: 600px;
            transform-style: preserve-3d;
          }
            
          .slide {
            position: absolute;
            width: 200px;
            height: 300px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.1);
            background-color: #fff;
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
