import React, { FC, useEffect, useRef } from 'react';

import { clamp, Swipe, vevet } from '@/index';

export const Drag: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    let x = 0;
    let y = 0;

    const instance = new Swipe({
      container: ref.current,
      inertia: true,
      grabCursor: true,
      inertiaRatio: 0.5,
      velocityModifier: (source) => ({
        ...source,
        x: clamp(source.x, -x - vevet.width / 2, vevet.width / 2 - x),
        y: clamp(source.y, -y - vevet.height / 2, vevet.height / 2 - y),
      }),
      onMove: ({ step }) => {
        x = clamp(x + step.x, -vevet.width / 2, vevet.width / 2);
        y = clamp(y + step.y, -vevet.height / 2, vevet.height / 2);

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

            display: flex;
            justify-content: center;
            align-items: center;

            touch-action: none;
            
            background: #000;
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container">
        Drag Me
      </div>
    </>
  );
};
