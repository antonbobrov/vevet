import React, { FC, useEffect, useRef } from 'react';

import { Swipe, vevet } from '@/index';

const items = Array(50)
  .fill(0)
  .map((item, index) => index);

export const Scroll: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return undefined;
    }

    let y = 0;

    const elements = Array.from(container.children) as HTMLDivElement[];

    const instance = new Swipe({
      container,
      inertia: true,
      grabCursor: true,
      getDiffBounds: () => ({
        y: [-(container.clientHeight - vevet.height + y), -y],
      }),
      onMove: ({ step }) => {
        y = y + step.y; // clamp(y + step.y, -(container.clientHeight - vevet.height), 0);

        elements.forEach((div) => {
          div.style.transform = `translateY(${y}px)`;
        });
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
            top: 0;
            left: 0;
            width: 100%;

            display: grid;
            gap: 16px;
            
            padding: 16px;
            box-sizing: border-box;

            background: #000;

            touch-action: none;
          }

          .container > div {
            padding: 16px;
            box-sizing: border-box;

            border-radius: 8px;
            background: #fff;
            will-change: transform;

            font-size: 20px;
            color: #000;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {items.map((item) => (
          <div key={item}>
            {item + 1} Lorem ipsum dolor sit amet consectetur adipiscing elit
          </div>
        ))}
      </div>
    </>
  );
};
