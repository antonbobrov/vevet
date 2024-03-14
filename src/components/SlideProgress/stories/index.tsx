/* eslint-disable no-param-reassign */
import React, { FC, useEffect, useRef } from 'react';
import { SlideProgress } from '..';
import { times } from '@/utils/common';

export const Component: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94'];
  const { length } = colors;

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new SlideProgress({
      container: containerRef.current,
      min: 0,
      max: length - 1,
      step: 0.5,
      dragDirection: 'x',
      friction: 0,
      stickyEndDuration: 250,
      ease: 0.5,
    });

    const elements = Array.from(containerRef.current.children) as HTMLElement[];

    instance.addCallback('render', () => {
      elements.forEach((element, index) => {
        const x = instance.progress * -100 + index * 100;
        element.style.transform = `translate(${x}%, 0)`;
      });
    });

    instance.render();

    return () => instance.destroy();
  }, [length]);

  return (
    <>
      <p>Scroll the block below</p>

      {times(
        (index) => (
          <br key={index} />
        ),
        15,
      )}

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: 300,
          height: 300,
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {colors.map((color) => (
          <div
            key={color}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: color,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Drag me horizontally
          </div>
        ))}
      </div>

      {times(
        (index) => (
          <br key={index} />
        ),
        50,
      )}
    </>
  );
};
