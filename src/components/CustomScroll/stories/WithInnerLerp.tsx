import React, { FC, useEffect, useRef, useState } from 'react';
import { CustomScroll } from '..';
import { times } from '@/utils/internal/times';

export const WithInnerLerpComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scroll, setScroll] = useState<CustomScroll>();

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new CustomScroll({
      container: containerRef.current,
      elements: '.js-element',
    });

    setScroll(instance);

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
          {times(
            (index, count) => (
              <div
                key={index}
                className="js-element"
                data-custom-scroll-lerp={0.5 - (index / count) * 0.35}
              >
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
