import React, { FC, useEffect, useRef } from 'react';

import { Swipe } from '@/index';

import { TSwipeStoryProps } from './types';

export const Bounds: FC<TSwipeStoryProps> = ({
  inertiaType = 'exponential',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const thumb = thumbRef.current;

    if (!wrapper || !thumb) {
      return undefined;
    }

    const instance = new Swipe({
      container: thumb,
      inertia: true,
      inertiaType,
      grabCursor: true,
      bakeBounds: () => {
        const thumbBound = thumb.getBoundingClientRect();
        const wrapperBound = wrapper.getBoundingClientRect();

        return {
          x: [
            wrapperBound.left - thumbBound.x,
            wrapperBound.right - thumbBound.right,
          ],
          y: [
            wrapperBound.top - thumbBound.y,
            wrapperBound.bottom - thumbBound.bottom,
          ],
        };
      },
      onMove: ({ total }) => {
        instance.container.style.transform = `translate(${total.x}px, ${total.y}px)`;
      },
    });

    return () => instance.destroy();
  }, [inertiaType]);

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

            width: 300px;
            height: 300px;

            display: flex;
            justify-content: center;
            align-items: center;

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
