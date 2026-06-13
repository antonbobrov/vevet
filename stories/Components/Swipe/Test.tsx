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
      axis: 'x',
      onMove: ({ diff }) => {
        instance.container.innerHTML = `${diff.x.toFixed(2)} ${diff.y.toFixed(2)}`;
      },
      onEnd: () => {
        console.log('end');
        ref.current!.innerHTML = 'end';
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
            margin: 0 auto;
            width: 200px;
            height: 200px;

            display: flex;
            justify-content: center;
            align-items: center;          
            
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
