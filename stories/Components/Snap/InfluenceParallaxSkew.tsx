import React, { FC, useEffect, useRef } from 'react';
import { Snap } from '@/index';

export const InfluenceParallaxSkew: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap(
      {
        container: ref.current,
        centered: true,
        loop: true,
        shortSwipes: false,
        gap: 20,
        lerp: 0.2,
        freemode: true,
      },
      {
        onUpdate: (data, { slides }) => {
          slides.forEach(({ element, coord }) => {
            element!.style.transform = `translateX(${coord}px)`;
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
            --size: min(30vw, 50vh);

            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: var(--size);
            overflow: hidden;

            @media (orientation: portrait) {
              --size: min(30vh, 50vw);
            }
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: var(--size);
            height: 100%;
          }
            
          .slide .wrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            
            display: flex;
            justify-content: center;
            align-items: center;
            
            font-size: 25px;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {[
          '#A8E6CF',
          '#DCEDC1',
          '#FFD3B6',
          '#FF8B94',
          'rgba(172, 162, 92, 1)',
          '#654b4bff',
          '#61783bff',
          '#9e6a48ff',
          '#a33c45ff',
          'rgba(149, 112, 112, 1)',
        ].map((color, index) => (
          <div key={color} className="slide">
            <div
              className="wrap"
              style={{ backgroundColor: color }}
              data-snap-parallax-skew="-40"
              data-snap-parallax-skew-min="-40"
              data-snap-parallax-skew-max="40"
              data-snap-parallax-skew-scope="const"
              data-snap-parallax-skew-influence="5"
              data-snap-parallax-skew-directional
            >
              {index}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
