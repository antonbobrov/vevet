import React, { FC, useEffect, useRef } from 'react';
import { clamp, lerp, Snap } from '@/index';

export const CreativeSine: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap({
      container: ref.current,
      direction: 'horizontal',
      centered: true,
      swipeLerp: 0.2,
      duration: (d) => d,
      slideSize: 'stretch',
      edgeFriction: 1,
      freemode: 'sticky',
      shortSwipes: false,
    });

    instance.on('update', () => {
      instance.slides.forEach(({ element, progress }) => {
        const scale = clamp(1 - Math.abs(progress));

        const width = lerp(10, 100, scale);

        element!.style.width = `${width}%`;
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

            display: flex;
            justify-content: center;
            align-items: center;
            justify-items: center;
          }
            
          .slide {
            position: relative;
            width: 100%;
            height: 100%;
          }
        `}
      </style>

      <div ref={ref} className="slider">
        {[
          '#FF4C4C',
          '#FF8000',
          '#FFD700',
          '#00CC66',
          '#0099FF',
          '#9933FF',
          '#FF33CC',
        ].map((color) => (
          <div
            key={color}
            className="slide"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </>
  );
};
