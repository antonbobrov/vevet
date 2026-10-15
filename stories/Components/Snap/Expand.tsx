import React, { FC, useCallback, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Snap/props';
import {
  clamp,
  ISnapMutableProps,
  ISnapStaticProps,
  lerp,
  Snap,
  Timeline,
  vevet,
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
  'https://picsum.photos/id/1040/1000/1500',
  'https://picsum.photos/id/1050/1000/1500',
  'https://picsum.photos/id/1060/1000/1500',
  'https://picsum.photos/id/1070/1000/1500',
  'https://picsum.photos/id/1080/1000/1500',
  'https://picsum.photos/id/1081/1000/1500',
  'https://picsum.photos/id/1082/1000/1500',
];

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const timelineIndexRef = useRef(0);

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

  const toggleSlide = useCallback(
    (index: number) => {
      if (!instance) {
        return;
      }

      timelineIndexRef.current = index;

      const slide = instance.slides[index];
      const element = slide.element!;

      element.classList.toggle('active');
      const isExpanding = element.classList.contains('active');

      const fromWidth = (element.offsetWidth / vevet.width) * 100;
      const startTrack = instance.current;

      const tm = new Timeline({
        duration: 500,
        onUpdate: ({ eased }) => {
          const toWidth = isExpanding ? 45 : 20;
          element.style.width = `${lerp(fromWidth, toWidth, eased)}vw`;

          slide.resize();

          if (timelineIndexRef.current === index) {
            if (isExpanding) {
              instance.set(
                lerp(
                  startTrack,
                  clamp(slide.staticCoord, instance.min, instance.max),
                  eased,
                ),
              );
            } else {
              instance.clampTarget();
            }
          }
        },
      });

      tm.play();
    },
    [instance],
  );

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <style>
        {`
          .slider {
            position: relative;
            margin: 0 auto;
            width: 100%;
            height: 30vw;
          }
            
          .slide {
            position: absolute;
            width: 20vw;
            height: 30vw;
            border-radius: 16px;
            overflow: hidden;
            background: #000;
          }

          .slide img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div ref={ref} className="slider">
        {SLIDES.map((src, index) => (
          <div key={src} className="slide" onClick={() => toggleSlide(index)}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>

      <Nav instance={instance} activeIndex={props.activeIndex} />
    </>
  );
};
