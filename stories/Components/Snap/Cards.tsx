import React, { FC, useEffect, useRef } from 'react';

import { clamp, inRange, Snap } from '@/index';

// Inspired by: https://swiperjs.com/

export const Cards: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }
    let startIndex = 0;

    const instance = new Snap({
      container: ref.current,
      direction: 'horizontal',
      wheel: true,
      wheelAxis: 'y',
      onSwipeStart: (data, { activeIndex }) => {
        startIndex = activeIndex;
      },
      onUpdate: (data, { slides }) => {
        const baseRotation = 6;
        const baseX = 12;
        const baseZ = -100;
        const maxVisible = 6;

        console.log(startIndex);

        slides.forEach(({ element, index, progress }) => {
          let x = -baseX * progress;
          let rotate = progress * -baseRotation;
          const z = Math.abs(progress) * baseZ;

          if (inRange(progress, -1, 1)) {
            if (startIndex === index) {
              x += Math.sin(Math.PI * progress) * -60;
            } else {
              x += Math.sin(Math.PI * progress) * -20;
            }
          }

          x = clamp(x, -baseX * maxVisible, baseX * maxVisible);

          rotate = clamp(
            rotate,
            -baseRotation * maxVisible,
            baseRotation * maxVisible,
          );

          element!.style.transform = `translateX(${x}%) translateZ(${z}px) rotate(${rotate}deg)`;
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
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 240px;
            height: 320px;

            transform-style: preserve-3d;
            perspective: 1000px;
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            border-radius: 20px;

            font-family: 'Arial';
            font-weight: bold;
            font-size: 20px;
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {[
          '#FF4C4C',
          '#FF8000',
          '#FFD700',
          '#00CC66',
          '#0099FF',
          '#9933FF',
          '#FF33CC',
        ].map((color, index) => (
          <div key={color} className="slide" style={{ backgroundColor: color }}>
            Slide {index}
          </div>
        ))}
      </div>
    </>
  );
};
