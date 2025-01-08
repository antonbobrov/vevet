import React, { FC, useEffect, useRef } from 'react';
import { Snap, SnapSlide } from '@/index';

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

export const Virtual: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap({
      container: ref.current,
      slides: createSlides(500),
      direction: 'horizontal',
      wheel: true,
      wheelAxis: 'y',
      swipeAxis: 'x',
      centered: true,
      loop: true,
      gap: '5vw',
    });

    instance.container.onclick = () => {
      instance.updateProps({
        slides: [...instance.slides, ...createSlides(10)],
      });
    };

    instance.on('update', () => {
      instance.slides.forEach((slide) => {
        const { element, coord, isVisible } = slide;

        if (isVisible) {
          element!.style.transform = `translate(${coord}px, 0)`;
        }
      });
    });

    return () => instance.destroy();
  }, []);

  return (
    <>
      <style>
        {`
          .slider {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
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
            overflow: hidden;
            background-color: #ccc;
          }
        `}
      </style>

      <div ref={ref} className="slider" />
    </>
  );
};
