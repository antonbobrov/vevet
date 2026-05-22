import React, { FC, useEffect, useRef } from 'react';

import { Swipe } from '@/index';

export const Lever: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !thumbRef.current || !rotateRef.current) {
      return undefined;
    }

    const instance = new Swipe({
      container: ref.current,
      thumb: thumbRef.current,
      inertia: true,
      relative: true,
      grabCursor: true,
      bounds: () => ({ angle: [-180, 180] }),
      onMove: ({ movement }) => {
        rotateRef.current!.style.transform = `rotate(${movement.angle}deg)`;
      },
      // todo: realtime snap
      snap: () => ({ angle: [90, 10] }),
      snapRadius: 10,
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
            width: 300px;
            height: 300px;

            touch-action: none;
          }

          .thumb_container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 2px solid #fff;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff00005e, #0000ff5e);
          }

          .thumb {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            background: linear-gradient(45deg, #ff0000ff, #0000ffff);
            border-radius: 50%;
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
        <div ref={rotateRef} className="thumb_container">
          <div ref={thumbRef} className="thumb" />
        </div>
      </div>
    </>
  );
};
