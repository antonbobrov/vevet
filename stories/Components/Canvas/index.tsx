import React, { FC, useEffect, useRef } from 'react';

import { Canvas, TCanvasRender } from '@/index';

export const Component: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Canvas({
      container: ref.current,
      resizeOnInit: true,
      resizeOnRuntime: true,
    });

    const render: TCanvasRender = ({ ctx, width, height }) => {
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
      ref={ref}
      style={{
        position: 'relative',
        width: 300,
        maxWidth: '100%',
        height: 300,
      }}
    />
  );
};
