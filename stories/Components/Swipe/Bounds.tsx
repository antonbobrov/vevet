import React, { FC, useEffect, useRef } from 'react';

import { Swipe } from '@/index';

export const Bounds: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const thumb = thumbRef.current;

    if (!wrapper || !thumb) {
      return undefined;
    }

    const instance = new Swipe({
      container: wrapper,
      thumb,
      inertia: true,
      grabCursor: true,
      relative: true,
      overflow: () => 50,
      bounds: () => ({ x: [0, 300], y: [0, 300] }),
      onInertia: () => console.log('inertia'),
      onInertiaStart: () => console.log('inertia start'),
      onInertiaEnd: () => console.log('inertia end'),
      onInertiaCancel: () => console.log('inertia cancel'),
      onInertiaFail: () => console.log('inertia fail'),
      onMove: ({ movement }) => {
        thumb.style.transform = `translate(${movement.x}px, ${movement.y}px)`;
      },
    });

    instance.setMovement({ x: 150, y: 150 });

    return () => instance.destroy();
  }, []);

  return (
    <>
      <style>
        {`
          .wrapper {
            position: fixed;
            z-index: 1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            width: 400px;
            height: 400px;

            background: #ddd;
          }

          .thumb {
            width: 100px;
            height: 100px;

            display: flex;
            justify-content: center;
            align-items: center;
            
            background: #0000009e;
            color: #fff;
          }
        `}
      </style>

      <div ref={wrapperRef} className="wrapper">
        <div ref={thumbRef} className="thumb">
          Drag Me
        </div>
      </div>
    </>
  );
};
