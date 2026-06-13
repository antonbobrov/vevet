import React, { FC, useEffect, useRef } from 'react';

import { clamp, Pointers, Swipe } from '@/index';

export const Bounds: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const scalableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const thumb = thumbRef.current;
    const scalable = scalableRef.current;

    if (!wrapper || !thumb || !scalable) {
      return undefined;
    }

    const instance = new Swipe({
      container: wrapper,
      thumb,
      inertia: true,
      grabCursor: true,
      relative: true,
      pointers: (type) => (type === 'mouse' ? 1 : 2),
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

    let currentScale = 1;
    let currentAngle = 0;

    const pointers = new Pointers({
      container: wrapper,
      minPointers: 2,
      maxPointers: 2,
      onMove: ({ scale, prevScale, angle, prevAngle }) => {
        currentScale = clamp(currentScale + (scale - prevScale), 1, 2);
        currentAngle += angle - prevAngle;

        scalable.style.transform = `scale(${currentScale}) rotate(${currentAngle}deg)`;
      },
    });

    instance.setMovement({ x: 150, y: 150 });

    return () => {
      instance.destroy();
      pointers.destroy();
    };
  }, []);

  return (
    <>
      <style>
        {`
          .wrapper {
            position: relative;
            margin: 0 auto;

            width: 400px;
            max-width: 100%;
            height: 400px;

            background: #ddd;
          }

          .thumb {
            position: relative;
            width: 150px;
            height: 150px;
          }

          .scalable {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;


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
          <div ref={scalableRef} className="scalable">
            Drag Me
          </div>
        </div>
      </div>
    </>
  );
};
