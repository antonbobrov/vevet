import React, { FC, useEffect, useRef } from 'react';

import { clamp, Snap } from '@/index';

export const Spiral: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap({
      container: ref.current,
      direction: 'vertical',
      wheel: true,
      swipeAxis: 'x',
      centered: true,
      loop: false,
      gap: 0,
      onUpdate: (data, { slides }) => {
        slides.forEach(({ element, coord, progress }) => {
          const scale = 1.15 - clamp(Math.abs(progress) * 0.5);

          const rotateX = progress * -45;

          element!.style.transform = `translate3d(0, ${coord}px, 0) rotateY(${rotateX}deg) scale(${scale})`;
        });
      },
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
            perspective: 600px;
            transform-style: preserve-3d;
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 50%;
            width: 360px;
            height: 240px;
            margin: 0 0 0 -180px;
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

      <div ref={ref} className="slider">
        {[
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
        ].map((src) => (
          <div key={src} className="slide">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
};
