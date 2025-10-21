import React, { FC, useEffect, useRef } from 'react';
import { Snap } from '@/index';

export const Carousel: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap({
      container: ref.current,
      direction: 'horizontal',
      grabCursor: true,
      wheel: true,
      wheelAxis: 'y',
      centered: true,
      loop: true,
      shortSwipes: false,
      freemode: 'sticky',
    });

    instance.on('update', () => {
      instance.slides.forEach(({ element, coord, progress }) => {
        const z = Math.abs(progress ** 2) * -150;
        const rZ = progress * 5;

        element!.style.transform = `translateX(${coord}px) translateZ(${z}px) rotateZ(${rZ}deg)`;
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
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100%;
            height: 360px;
            perspective: 600px;
            transform-style: preserve-3d;
          }
            
          .slide {
            position: absolute;
            width: 240px;
            height: 360px;
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
