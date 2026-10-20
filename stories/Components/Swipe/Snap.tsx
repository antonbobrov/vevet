import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Swipe/props';
import { onResize, Swipe } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS, TProps } from './constants';

const COLS = 5;
const ROWS = 2;
const CELLS = COLS * ROWS;

export const SnapComponent: FC<TProps> = (props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Swipe>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const wrapper = wrapperRef.current;
    const thumb = thumbRef.current;

    if (!wrapper || !thumb) {
      return undefined;
    }

    const layout = () => {
      const cellW = wrapper.clientWidth / COLS;
      const cellH = wrapper.clientHeight / ROWS;

      thumb.style.width = `${cellW}px`;
      thumb.style.height = `${cellH}px`;

      return { cellW, cellH };
    };

    layout();

    const mod = new Swipe({
      ...input,
      container: wrapper,
      thumb,
      bounds: () => {
        const { cellW, cellH } = layout();

        return {
          x: [0, cellW * (COLS - 1)],
          y: [0, cellH * (ROWS - 1)],
        };
      },
      snap: () => {
        const { cellW, cellH } = layout();

        return {
          x: Array.from({ length: COLS }, (_, i) => i * cellW),
          y: Array.from({ length: ROWS }, (_, i) => i * cellH),
        };
      },
      onMove: ({ movement }) => {
        thumb.style.transform = `translate(${movement.x}px, ${movement.y}px)`;
      },
    });

    setInstance(mod);

    const resizer = onResize({
      element: wrapper,
      resizeDebounce: 100,
      callback: () => {
        mod.cancelInertia();
        mod.setMovement({ x: mod.movement.x, y: mod.movement.y });
      },
    });

    return () => {
      mod.destroy();
      setInstance(undefined);
      resizer.remove();
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <style>
        {`
          .snap-wrapper {
            position: relative;
            margin: 0 auto;

            width: 100%;
            height: 500px;

            display: grid;
            grid-template-columns: repeat(${COLS}, 1fr);
            grid-template-rows: repeat(${ROWS}, 1fr);

            background: #ddd;
          }

          .snap-cell {
            box-sizing: border-box;
            border: 1px solid #999;
            pointer-events: none;
          }

          .snap-thumb {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;

            display: flex;
            align-items: center;
            justify-content: center;

            box-sizing: border-box;
            border: 2px solid #111;
            background: #0000009e;
            color: #fff;
            font: 14px/1.2 sans-serif;
          }
        `}
      </style>

      <div ref={wrapperRef} className="snap-wrapper">
        {Array.from({ length: CELLS }, (_, i) => (
          <div key={i} className="snap-cell" />
        ))}

        <div ref={thumbRef} className="snap-thumb">
          Drag
        </div>
      </div>
    </>
  );
};
