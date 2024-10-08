/* eslint-disable no-alert */
import React, { FC, useEffect, useRef, useState } from 'react';
import { CustomScrollKeyboardPlugin } from '..';
import { CustomScroll } from '@/components/CustomScroll';
import { times } from '@/utils/internal/times';

export const Component: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scroll, setScroll] = useState<CustomScroll>();

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new CustomScroll({
      container: containerRef.current,
    });

    setScroll(instance);

    instance.addPlugin(new CustomScrollKeyboardPlugin());

    return () => instance.destroy();
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => scroll?.changeProps({ isEnabled: true })}
      >
        Enable
      </button>

      <button
        type="button"
        onClick={() => scroll?.changeProps({ isEnabled: false })}
      >
        Disable
      </button>

      <br />

      <br />

      <div
        ref={containerRef}
        className="v-custom-scroll"
        style={{ height: 500, maxWidth: 500, backgroundColor: '#ccc' }}
      >
        <div className="v-custom-scroll__wrapper">
          <button type="button">Test button</button>

          <br />

          <br />

          <input type="text" placeholder="Test input" />

          {times(
            (index) => (
              <div key={index}>
                {'Lorem ipsum dolor sit amet '}

                <br />

                <br />

                <a href="/">Link</a>

                <br />

                <br />

                <button type="button" onClick={() => alert('click')}>
                  Test button
                </button>
              </div>
            ),
            40,
          )}

          <button type="button">Test button</button>
        </div>
      </div>
    </div>
  );
};
