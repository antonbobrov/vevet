import React, { FC, useEffect, useRef } from 'react';
import { Ctx2D, NCtx2D } from '..';

export const Component: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new Ctx2D({
      container: containerRef.current,
    });

    const render: NCtx2D.TRender = ({ ctx, width, height }) => {
      ctx.beginPath();
      ctx.fillStyle = '#ccc';
      ctx.fillRect(0, 0, width, height);
      ctx.closePath();

      ctx.beginPath();
      ctx.fillStyle = '#000';
      ctx.fillRect(10, 10, 50, 50);
      ctx.closePath();
    };

    instance.render(render);
    instance.on('resize', () => instance.render(render));

    return () => instance.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: 300,
        height: 300,
      }}
    />
  );
};
