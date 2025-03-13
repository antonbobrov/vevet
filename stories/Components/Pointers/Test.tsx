import React, { FC, useEffect, useRef } from 'react';
import { Pointers } from '@/index';

export const Test: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    const thumbs = Array.from(ref.current?.children || []) as HTMLElement[];

    if (!container || thumbs.length === 0) {
      return undefined;
    }

    const instance = new Pointers({
      container,
      relative: true,
      minPointers: 2,
      maxPointers: 5,
    });

    instance.on('pointermove', ({ pointer }) => {
      const finger = thumbs[pointer.index];

      finger.style.opacity = '1';
      finger.style.transform = `translate(${pointer.current.x}px, ${pointer.current.y}px)`;
    });

    instance.on('pointerup', ({ pointer }) => {
      const finger = thumbs[pointer.index];

      finger.style.opacity = '0';
    });

    instance.on('start', () => {
      container.style.backgroundColor = '#ccc';
    });

    instance.on('end', () => {
      container.style.backgroundColor = '';
    });

    return () => instance?.destroy();
  }, []);

  return (
    <>
      <style>
        {`
          .container {
            position: fixed;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 80%;
            background-color: #000;
            touch-action: none;
          }
            
          .thumb {
            position: absolute;
            top: -25px;
            left: -25px;
            width: 50px;
            height: 50px;
            border-radius: 50%;

            opacity: 0;
          }
        `}
      </style>

      <div ref={ref} className="container">
        <div className="thumb" style={{ background: 'red' }} />

        <div className="thumb" style={{ background: 'green' }} />

        <div className="thumb" style={{ background: 'blue' }} />

        <div className="thumb" style={{ background: 'yellow' }} />

        <div className="thumb" style={{ background: 'white' }} />
      </div>
    </>
  );
};
