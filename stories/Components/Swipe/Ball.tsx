import React, { FC, useEffect, useRef } from 'react';
import { clamp, Swipe, vevet } from '@/index';

export const Ball: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    let x = 0;
    let y = 0;
    let xDir = 1;
    let yDir = 1;

    const instance = new Swipe({
      container: ref.current,
      inertia: true,
      grabCursor: true,
      onStart: () => {
        xDir = 1;
        yDir = 1;
      },
      onMove: ({ step }) => {
        if (instance.hasInertia) {
          if (x >= vevet.width / 2 || x <= -vevet.width / 2) {
            xDir *= -1;
          }

          if (y >= vevet.height / 2 || y <= -vevet.height / 2) {
            yDir *= -1;
          }
        }

        x = clamp(x + step.x * xDir, -vevet.width / 2, vevet.width / 2);
        y = clamp(y + step.y * yDir, -vevet.height / 2, vevet.height / 2);

        instance.container.style.transform = `translate(${x}px, ${y}px)`;
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
            margin: -50px 0 0 -50px;
            width: 100px;
            height: 100px;
            border-radius: 50%;

            display: flex;
            justify-content: center;
            align-items: center;

            touch-action: none;
            
            background: #000;
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container" />
    </>
  );
};
