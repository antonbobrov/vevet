import React, { FC, useEffect, useRef } from 'react';
import { times } from '@/utils/common';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ScrollBar } from '..';

export const WithSmoothScrollComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const scroll = new SmoothScroll({
      container: containerRef.current,
    });

    const scrollBar = new ScrollBar({
      container: scroll,
    });

    return () => {
      scrollBar.destroy();
      scroll.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="v-smooth-scroll"
      style={{ height: 500, maxWidth: 500, backgroundColor: '#eee' }}
    >
      <div className="v-smooth-scroll__wrapper">
        {times(
          (index) => (
            <div key={index}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              quibusdam fugit at quos. Quod repellendus placeat provident. Iste
              saepe veniam iure, reiciendis a dolor in commodi dolores placeat
              mollitia illum?
            </div>
          ),
          40
        )}
      </div>
    </div>
  );
};
