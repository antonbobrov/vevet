import React, { FC, useEffect, useRef, useState } from 'react';
import { SmoothScrollDragPlugin } from '..';
import { SmoothScroll } from '@/components/SmoothScroll';
import { times } from '@/utils/common';

export const Component: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [smoothScroll, setSmoothScroll] = useState<SmoothScroll>();

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new SmoothScroll({
      container: containerRef.current,
    });

    setSmoothScroll(instance);

    instance.addPlugin(new SmoothScrollDragPlugin());

    return () => instance.destroy();
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => smoothScroll?.changeProps({ isEnabled: true })}
      >
        Enable
      </button>

      <button
        type="button"
        onClick={() => smoothScroll?.changeProps({ isEnabled: false })}
      >
        Disable
      </button>

      <br />
      <br />

      <div
        ref={containerRef}
        className="v-smooth-scroll"
        style={{ height: 500, maxWidth: 500, backgroundColor: '#ccc' }}
      >
        <div className="v-smooth-scroll__wrapper">
          <button type="button">Test button</button>

          <br />
          <br />

          <input type="text" placeholder="Test input" />

          {times(
            (index) => (
              <div key={index}>
                Lorem ipsum dolor sit amet
                <br />
                <br />
                <button type="button">Test button</button>
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
