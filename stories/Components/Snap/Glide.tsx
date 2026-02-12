import React, { FC, useEffect, useRef } from 'react';

import { clamp, Snap } from '@/index';

export const Glide: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap(
      {
        container: ref.current,
        direction: 'horizontal',
        edgeFriction: 1,
        wheel: true,
        wheelAxis: 'y',
      },
      {
        onUpdate: (data, { slides }) => {
          slides.forEach(({ element, progress, coord, size }) => {
            const parallax = clamp(progress, 0, 1);
            const x = coord + parallax * (size / 2);

            element!.style.transform = `translateX(${x}px)`;
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
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-width: 100%;
            aspect-ratio: 1.5 / 1;

            overflow: hidden;
            border-radius: 16px;
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            overflow: hidden;
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
        {[
          'https://picsum.photos/id/940/400/600',
          'https://picsum.photos/id/950/400/600',
          'https://picsum.photos/id/960/400/600',
          'https://picsum.photos/id/970/400/600',
          'https://picsum.photos/id/980/400/600',
          'https://picsum.photos/id/990/400/600',
          'https://picsum.photos/id/1000/400/600',
          'https://picsum.photos/id/1020/400/600',
          'https://picsum.photos/id/1040/400/600',
          'https://picsum.photos/id/1050/400/600',
        ].map((src) => (
          <div key={src} className="slide">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
};
