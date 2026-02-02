import React, { FC, useEffect, useRef } from 'react';
import { Snap } from '@/index';

export const Circular: FC = () => {
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
        swipeAxis: 'angle',
        wheelAxis: 'y',
        loop: true,
        freemode: true,
      },
      {
        onUpdate: (data, { containerSize, slides }) => {
          const radius = containerSize / 2;
          const p2 = Math.PI * 2;
          const offset = Math.PI * -0.5;

          slides.forEach((slide) => {
            const element = slide.element!;
            const progress = -slide.progress / slides.length;

            const x = Math.cos(p2 * progress + offset) * radius;
            const y = Math.sin(p2 * progress + offset) * radius;
            const rotation = p2 * progress;

            element.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rotation}rad)`;
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
            --size: min(50vh, 50vw);

            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: var(--size);
            height: var(--size);
          }
            
          .slide {
            --slide-size: calc(var(--size) / 5);

            position: absolute;
            top: calc(50% - var(--slide-size) / 2);
            left: calc(50% - var(--slide-size) / 2);
            width: var(--slide-size);
            height: var(--slide-size);

            display: flex;
            justify-content: center;
            align-items: center;
          }

          .wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            border-radius: 8px;
            overflow: hidden;
          }

          .wrapper img {
            position: absolute;
            top: 0;
            left: 0;
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
            <div
              className="wrapper"
              data-snap-parallax-scale="-5"
              data-snap-parallax-scale-min="0.755"
              data-snap-parallax-scale-influence
              data-snap-parallax-scale-abs
              data-snap-parallax-scale-scope="1,1"
              data-snap-parallax-skew="-200"
              data-snap-parallax-skew-min="-30"
              data-snap-parallax-skew-max="30"
              data-snap-parallax-skew-influence
              data-snap-parallax-skew-directional
              data-snap-parallax-skew-scope="1,1"
            >
              <img src={src} alt="" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
