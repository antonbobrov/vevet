import React, { FC, useEffect, useRef } from 'react';
import { Snap } from '@/index';

// todo: codepen demo

export const ParallaxStickers: FC = () => {
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
        gap: 20,
        lerp: 0.2,
        freemode: 'sticky',
        swipeSpeed: 0.02,
      },
      {
        onUpdate: (data, { slides }) => {
          slides.forEach(({ element, coord, progress }) => {
            element!.style.transform = `translateX(${coord}px)`;
            element!.style.zIndex = `${-Math.floor(progress)}`;
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
            width: 100%;
            height: 100%;
          }
            
          .slide {
            --size: 20vw;

            position: absolute;
            top: 0;
            left: 0;
            width: calc(var(--size) * 0.02);
            height: 100%;

            @media (orientation: portrait) {
              --size: 20vh;
              width: calc(var(--size) * 0.02);
            }
          }
            
          .slide .area {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: var(--size);
            height: var(--size);

            transform-style: preserve-3d;
            perspective: calc(var(--size) * 15);

            @media (orientation: portrait) {
              perspective: calc(var(--size) * 30);
            }
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
            border-radius: 8px;
            
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);

            font-size: 25px;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {[
          '#F7EFCB',
          '#F9D5BB',
          '#F2B5D4',
          '#E8AEB7',
          '#B8D8D8',
          '#D6EDFF',
          '#FFE0E6',
          '#D0BDF4',
          '#B9FBC0',
          '#FFCBC1',

          '#C7CEB2',
          '#A5B68D',
          '#D1C7B7',
          '#E4D9C5',
          '#CABAC8',
          '#A9A1AE',
          '#8DA7BE',
          '#B4E1FF',
          '#C7F9CC',
          '#E8F3D6',

          '#b5a37aff',
          '#8a7f6eff',
          '#7d6d61ff',
          '#6c5f5bff',
          '#bba58fff',
          '#c2b8a3ff',
          '#a39282ff',
          '#8d7b70ff',
          '#c4a381ff',
          '#ad8b73ff',

          '#d9c5b2ff',
          '#e0d2c1ff',
          '#f5e6ccff',
          '#d4cfc9ff',
          '#c2d2caff',
          '#b8cbd8ff',
          '#c9b6e4ff',
          '#e7d4e9ff',
          '#f3c5d8ff',
          '#f7e3f3ff',

          '#93a17dff',
          '#82936aff',
          '#a5b795ff',
          '#c9dbbaff',
          '#d1e2ccff',
          '#e3eddfff',
          '#a8b8caff',
          '#8799b8ff',
          '#7b8f9dff',
          '#dbe3ebff',
        ].map((color) => (
          <div key={color} className="slide">
            <div className="area">
              <div
                className="wrap"
                style={{ backgroundColor: color }}
                data-snap-parallax-x="-100%"
                data-snap-parallax-x-scope="-1,1"
                data-snap-parallax-y="70%"
                data-snap-parallax-y-scope="-0.5,0.5"
                data-snap-parallax-rotate-y="-50"
                data-snap-parallax-rotate-z="1"
                data-snap-parallax-rotate-z-scope="-Infinity,Infinity"
                data-snap-parallax-z="-10"
                data-snap-parallax-z-scope="-Infinity,Infinity"
                data-snap-parallax-z-abs
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
