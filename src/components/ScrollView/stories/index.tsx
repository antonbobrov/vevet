/* eslint-disable no-param-reassign */
import React, { FC, useEffect, useRef } from 'react';
import { ScrollView } from '..';
import { times } from '@/utils/internal/times';

export const Component: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new ScrollView({ states: 'inout' });

    const elements = containerRef.current.querySelectorAll('*');
    elements.forEach((element) => instance.addElement(element));

    instance.on('in', ({ element }) => {
      if (element instanceof HTMLElement) {
        element.style.opacity = '1';
      }
    });

    instance.on('out', ({ element }) => {
      if (element instanceof HTMLElement) {
        element.style.opacity = '0';
      }
    });

    return () => instance.destroy();
  }, []);

  return (
    <div ref={containerRef}>
      {times(
        (index) => (
          <div
            key={index}
            style={{ marginTop: 10, opacity: 0, transition: 'opacity 0.35s' }}
          >
            {index} Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </div>
        ),
        200,
      )}
    </div>
  );
};
