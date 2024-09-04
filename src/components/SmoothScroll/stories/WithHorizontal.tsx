import React, { FC, useEffect, useRef, useState } from 'react';
import { SmoothScroll } from '..';
import { times } from '@/utils/common';

export const WithHorizontalComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [smoothScroll, setSmoothScroll] = useState<SmoothScroll>();

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new SmoothScroll({
      container: containerRef.current,
      elements: '.js-element',
      direction: 'horizontal',
      isInversedHandlerDirection: true,
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: 'max-content',
            }}
          >
            {times(
              (index, count) => (
                <div
                  key={index}
                  className="js-element"
                  data-smooth-scroll-lerp={0.1 - (index / count) * 0.035}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',

                    minWidth: 200,
                    height: 200,

                    background: '#333',
                    color: '#fff',
                  }}
                >
                  Lorem ipsum
                </div>
              ),
              20,
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
