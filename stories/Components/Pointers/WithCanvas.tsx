import React, { FC, useEffect, useRef } from 'react';
import { Canvas, Pointers } from '@/index';

export const WithCanvas: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const colors = ['red', 'green', 'blue', 'yellow'];

    const ctx2d = new Canvas({
      container,
      append: true,
      resizeOnInit: true,
      resizeOnRuntime: true,
      dpr: 1,
    });

    const fingers = new Pointers({
      container,
      relative: true,
      onPointermove: ({ pointer }) => {
        const color = colors[pointer.index] || 'white';

        ctx2d.render(({ ctx, dpr }) => {
          ctx.beginPath();
          ctx.quadraticCurveTo(
            pointer.prev.x,
            pointer.prev.y,
            pointer.current.x,
            pointer.current.y,
          );
          ctx.lineWidth = 3 * dpr;
          ctx.strokeStyle = color;
          ctx.stroke();
          ctx.closePath();
        });
      },
    });

    return () => {
      fingers.destroy();
      ctx2d.destroy();
    };
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
        `}
      </style>

      <div ref={ref} className="container" />
    </>
  );
};
