import React, { FC, useEffect, useRef, useState } from 'react';
import { CustomScroll } from '..';
import { times } from '@/utils/internal/times';

export const WithHorizontalComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scroll, setScroll] = useState<CustomScroll>();

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new CustomScroll({
      container: containerRef.current,
      elements: '.js-element',
      direction: 'horizontal',
      isInversedHandlerDirection: true,
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
                  data-custom-scroll-lerp={0.1 - (index / count) * 0.035}
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
