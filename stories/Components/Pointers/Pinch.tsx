import React, { FC, useEffect, useRef } from 'react';

import { clamp, Pointers } from '@/index';

export const Pinch: FC = () => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thumb = thumbRef.current;
    const content = contentRef.current;

    if (!thumb || !content) {
      return undefined;
    }

    let scale = 1;
    let rotate = 0;
    let x = 0;
    let y = 0;

    const instance = new Pointers({
      container: thumb,
      minPointers: 2,
      maxPointers: 2,
      relative: false,
      onMove: (data) => {
        scale = clamp(scale + data.scale - data.prevScale, 0.5, 2);
        rotate += data.angle - data.prevAngle;
        x += data.center.x - data.prevCenter.x;
        y += data.center.y - data.prevCenter.y;
        thumb.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

        content.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
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
            width: 100%;
            height: 80svh;
            
            touch-action: pan-y;
            
            background: #ddd;
          }

          .thumb {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 180px;
            height: 180px;

            background: #f00;
          }

          .content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            border-radius: 12px;
            background: #0000009e;
            color: #fff;
          }
        `}
      </style>

      <div className="container">
        <div ref={thumbRef} className="thumb">
          <div ref={contentRef} className="content">
            Pinch & Rotate
          </div>
        </div>
      </div>
    </>
  );
};
