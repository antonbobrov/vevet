import React, { FC, useEffect, useRef } from 'react';

import { Swipe } from '@/index';

export const Direction: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Swipe(
      {
        container: ref.current,
      },
      {
        onStart: () => {
          instance.container.innerHTML = 'start';
        },
        onToLeft: () => {
          instance.container.innerHTML = 'to left';
        },
        onToRight: () => {
          instance.container.innerHTML = 'to right';
        },
        onToTop: () => {
          instance.container.innerHTML = 'to top';
        },
        onToBottom: () => {
          instance.container.innerHTML = 'to bottom';
        },
      },
    );

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
            
            touch-action: none;
            
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
