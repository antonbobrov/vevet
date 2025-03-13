import React, { FC, useEffect, useRef } from 'react';
import { InView } from '@/index';

export const Component: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new InView({
      hasOut: true,
    });

    instance.on('in', ({ element }) => {
      if (element instanceof HTMLElement) {
        element.style.background = '#f00';
      }
    });

    instance.on('out', ({ element }) => {
      if (element instanceof HTMLElement) {
        element.style.background = '#000';
      }
    });

    const elements = ref.current.querySelectorAll('*');
    elements.forEach((element) => instance.addElement(element));

    return () => instance.destroy();
  }, []);

  return (
    <div ref={ref}>
      <div
        data-in-view-class="viewed"
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        className="test"
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 100,
          background: '#ccc',
        }}
      />
    </div>
  );
};
