import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Snap/props';
import { ISnapMutableProps, ISnapStaticProps, Snap, SnapSlide } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS } from './constants';
import { Nav } from './Nav';

type TProps = Omit<
  ISnapStaticProps & ISnapMutableProps,
  '__mutableProp' | '__staticProp' | 'container' | 'eventsEmitter'
>;

let i = 0;

const createSlides = (count: number) => {
  const slides = new Array(count).fill(0).map(() => {
    const size = '25vw';

    const element = document.createElement('div');
    element.className = 'slide';
    element.innerHTML = `<span>${i}</span>`;
    element.style.width = size;

    i += 1;

    return new SnapSlide(element, {
      size,
      virtual: true,
    });
  });

  return slides;
};

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
      container: ref.current,
      slides: createSlides(500),
      onUpdate: (data, { slides }) => {
        slides.forEach((slide) => {
          const { element, coord, isVisible } = slide;

          if (isVisible) {
            element!.style.transform = `translate(${coord}px, 0)`;
          }
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
          .slider {
            position: relative;
            height: 240px;
          }
            
          .slide {
            position: absolute;
            top: calc(50% - 120px);
            left: 0;
            height: 240px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            background-color: #ccc;
          }
        `}
      </style>

      <div ref={ref} className="slider" />

      <Nav instance={instance} activeIndex={props.activeIndex} />
    </>
  );
};
