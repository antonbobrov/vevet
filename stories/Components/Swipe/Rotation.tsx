import React, { FC, useEffect, useRef } from 'react';

import { Swipe } from '@/index';

export const Rotation: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !rotateRef.current) {
      return undefined;
    }

    const instance = new Swipe({
      container: ref.current,
      inertia: true,
      relative: true,
      maxVelocity: { x: 7, y: 7, angle: 3 },
      overflow: () => 10,
      bounds: () => ({ angle: [-360, 360] }),
      ratio: 0.5,
      inertiaRatio: 2,
      onMove: ({ movement }) => {
        rotateRef.current!.style.transform = `rotate(${movement.angle}deg)`;
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
            width: 200px;
            height: 200px;

            touch-action: none;
            
            background: #000;
          }

          .rotate {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            background: linear-gradient(45deg, #ff000074, #0000ff77);
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container">
        <div ref={rotateRef} className="rotate">
          Rotate Me
        </div>
      </div>
    </>
  );
};
