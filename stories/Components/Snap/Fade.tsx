import React, { FC, useEffect, useRef } from 'react';
import { clamp, Snap } from '@/index';

export const Fade: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap(
      {
        container: ref.current,
        direction: 'horizontal',
        followSwipe: false,
        loop: true,
      },
      {
        onUpdate: (data, { slides }) => {
          slides.forEach(({ element, progress }) => {
            const opacity = clamp(1 - Math.abs(progress));

            element!.style.opacity = `${opacity}`;
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
          'https://picsum.photos/id/1070/400/600',
          'https://picsum.photos/id/1080/400/600',
          'https://picsum.photos/id/1082/400/600',
        ].map((src) => (
          <div key={src} className="slide">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
};
