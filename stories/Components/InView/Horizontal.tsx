import React, { FC, useEffect, useRef } from 'react';
import { InView } from '@/index';

export const Horizontal: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const isRtl = true;

    if (isRtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    }

    const instance = new InView(
      {
        hasOut: true,
        rootMargin: isRtl ? '0% 0% 0% -15%' : '0% -15% 0% 0%',
        scrollDirection: 'horizontal',
      },
      {
        onIn: ({ element }) => {
          if (element instanceof HTMLElement) {
            element.style.background = '#f00';
          }
        },
        onOut: ({ element }) => {
          if (element instanceof HTMLElement) {
            element.style.background = '#000';
          }
        },
      },
    );

    const elements = ref.current.querySelectorAll('*');
    elements.forEach((element) => instance.addElement(element));

    return () => instance.destroy();
  }, []);

  return (
    <div
      style={{
        height: 300,
        width: '100%',
        overflow: 'auto',
      }}
    >
      <div
        ref={ref}
        style={{
          height: 200,
          padding: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyItems: 'center',
          width: 'max-content',
          gap: 20,
        }}
      >
        <div
          data-in-view-class="viewed|viewed-reverse"
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          className="test"
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />

        <div
          style={{
            width: 200,
            height: 200,
            background: '#ccc',
          }}
        />
      </div>
    </div>
  );
};
