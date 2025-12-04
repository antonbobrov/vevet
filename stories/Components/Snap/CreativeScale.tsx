import React, { FC, useEffect, useRef } from 'react';
import { clamp, Snap } from '@/index';

export const CreativeScale: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap(
      {
        container: ref.current,
        direction: 'horizontal',
        wheelAxis: 'y',
        centered: true,
        loop: true,
        lerp: 0.05,
        duration: 1000,
      },
      {
        onUpdate: (data, { slides }) => {
          slides.forEach(({ element, coord, progress }) => {
            const scaleFactor = 3.5;
            const scale = clamp(
              (scaleFactor - Math.abs(progress)) / scaleFactor,
            );

            element!.style.transform = `translateX(${coord}px) translateY(-50%) scale(${scale})`;
          });
        },
      },
    );

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
            perspective: 600px;
            transform-style: preserve-3d;
          }
            
          .slide {
            position: absolute;
            top: 50%;
            left: 0;
            width: 28%;
            aspect-ratio: 407 / 545;
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
            transition: transform 1.25s ease;

            &:hover {
              transform: scale(1.05);
            }
          }
        `}
      </style>

      <div ref={ref} className="slider">
        {[
          'https://picsum.photos/id/890/1200',
          'https://picsum.photos/id/891/1200',
          'https://picsum.photos/id/892/1200',
          'https://picsum.photos/id/893/1200',
          'https://picsum.photos/id/894/1200',
          'https://picsum.photos/id/896/1200',
          'https://picsum.photos/id/885/1200',
          'https://picsum.photos/id/898/1200',
        ].map((src) => (
          <div key={src} className="slide">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
};
