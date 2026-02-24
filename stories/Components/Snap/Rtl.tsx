import React, { FC, useEffect, useRef } from 'react';

import { Snap } from '@/index';

export const Rtl: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap({
      container: ref.current,
      direction: 'horizontal',
      wheel: true,
      wheelAxis: 'y',
      loop: true,
      gap: 20,
      swipeSpeed: -1,
      onUpdate: (data, { slides }) => {
        slides.forEach(({ element, coord }) => {
          const x = -coord;
          element!.style.transform = `translateX(${x}px)`;
        });
      },
    });

    return () => instance.destroy();
  }, []);

  return (
    <>
      <style>
        {`
          .container {
            position: relative;
            margin: 0 auto;
            width: 400px;
            max-width: 80%;
            height: 300px;
            background: #000;

            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 50%;
              width: 1px;
              height: 100%;
              background: red;
            }
          }
            
          .slide {
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 20px;
            opacity: 0.75;
            overflow: hidden;
          }
        `}
      </style>

      <div ref={ref} className="container" dir="rtl">
        {[
          { color: '#A8E6CF', size: 200 },
          { color: '#DCEDC1', size: 180 },
          { color: '#FFD3B6', size: 700 },
          { color: '#FF8B94', size: 150 },
          { color: '#f00', size: 600 },
        ].map(({ color, size }, index) => (
          <div
            key={color}
            className="slide"
            style={{ backgroundColor: color, width: size }}
          >
            {index}
          </div>
        ))}
      </div>
    </>
  );
};
