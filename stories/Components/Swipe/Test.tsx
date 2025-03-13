import React, { FC, useEffect, useRef } from 'react';
import { Swipe } from '@/index';

export const Test: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Swipe({
      container: ref.current,
    });

    instance.on('move', (data) => {
      instance.container.innerHTML = `${data.diff.x.toFixed(2)} ${data.diff.y.toFixed(2)}`;
    });

    instance.on('end', () => {
      console.log('end');
      ref.current!.innerHTML = 'end';
    });

    return () => instance.destroy();
  }, []);

  return (
    <>
      <style>
        {`
          .container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;

            display: flex;
            justify-content: center;
            align-items: center;
            
            touch-action: pan-y;
            
            background: #000;
            color: #fff;
          }
        `}
      </style>

      <div ref={ref} className="container">
        Swipe me
      </div>
    </>
  );
};
