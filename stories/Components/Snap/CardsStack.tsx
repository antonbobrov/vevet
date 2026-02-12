import React, { FC, useEffect, useRef } from 'react';

import { clamp, Snap } from '@/index';

// Inspired by: https://cards-stack-slider.uiinitiative.com/

// Cards from Figma: https://www.figma.com/community/file/1265351701227098516/free-150-credit-cards-e-wallet-bank-cards

export const CardsStack: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap(
      {
        container: ref.current,
        direction: 'horizontal',
        centered: true,
        loop: true,
        gap: 20,
        wheel: true,
        wheelAxis: 'y',
      },
      {
        onUpdate: (data, { slides }) => {
          slides.forEach(({ element, size, progress }) => {
            const translationAmp = size * 0.5;

            const isPrev = progress > 0;
            const rotateAmp = isPrev ? 20 : 160;

            let rotate = rotateAmp * Math.abs(progress);
            rotate = clamp(rotate, 0, 180);

            const depth = progress ** 2 * -size * (isPrev ? 0.35 : 0.5);
            const x = translationAmp * -progress;

            element!.style.transform = `translateX(${x}px) translateZ(${depth}px) rotateY(${rotate}deg)`;
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
            width: 350px;
            height: 220px;

            transform-style: preserve-3d;
            perspective: 1000px;
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {[0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3].map((num) => (
          <div
            key={num}
            className="slide"
            style={{ backgroundImage: `url(/cards/${num}.png)` }}
          />
        ))}
      </div>
    </>
  );
};
