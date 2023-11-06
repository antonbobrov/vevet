import React, { FC, useEffect, useRef, useState } from 'react';
import { SmoothScroll } from '..';
import { times } from '@/utils/common';

export const DefaultComponent: FC = () => {
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
          {times(
            (index) => (
              <div key={index}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Pariatur quibusdam fugit at quos. Quod repellendus placeat
                provident. Iste saepe veniam iure, reiciendis a dolor in commodi
                dolores placeat mollitia illum?
              </div>
            ),
            40,
          )}
        </div>
      </div>
    </div>
  );
};
