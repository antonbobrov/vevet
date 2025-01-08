import React, { FC, useEffect, useRef } from 'react';
import { Swipe } from '@/index';

export const Direction: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Swipe({
      container: ref.current,
    });

    instance.on('start', () => {
      instance.container.innerHTML = 'start';
    });

    instance.on('toLeft', () => {
      instance.container.innerHTML = 'to left';
      console.log('toLeft');
    });

    instance.on('toRight', () => {
      instance.container.innerHTML = 'to right';
    });

    instance.on('toTop', () => {
      instance.container.innerHTML = 'to top';
      console.log('toTop');
    });

    instance.on('toBottom', () => {
      instance.container.innerHTML = 'to bottom';
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
