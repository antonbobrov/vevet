import React, { FC, useEffect, useRef } from 'react';
import { Snap } from '@/index';

// Inspired by https://panorama-slider.uiinitiative.com/

export const Panorama: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap(
      {
        container: ref.current,
        direction: 'horizontal',
        wheel: true,
        wheelAxis: 'y',
        centered: true,
        loop: true,
        gap: 10,
        freemode: true,
      },
      {
        onUpdate: (data, { slides }) => {
          const depth = 200;
          const rotation = 20;
          const scale = 1 / (180 / rotation);
          const halfAngle = (rotation * Math.PI) / 180 / 2;

          slides.forEach(({ element, coord, progress, size }) => {
            const factor = 1 - Math.cos(progress * scale * Math.PI);

            const xOffset = progress * (size / 3) * factor;
            const zOffset =
              ((size * 0.5) / Math.sin(halfAngle)) * factor - depth;
            const rotateY = progress * rotation;

            element!.style.transform = `translateX(${coord + xOffset}px) translateZ(${zOffset}px) rotateY(${rotateY}deg)`;
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
          .container {
            position: fixed;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
            width: 100%;

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
        {[
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
        ].map((src) => (
          <div key={src} className="slide">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
};
