import React, { FC, useEffect, useRef } from 'react';
import { CustomScroll } from '@/components/CustomScroll';
import { ScrollBar } from '..';
import { times } from '@/utils/internal/times';

export const WithCustomScrollComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const scroll = new CustomScroll({
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
      className="v-custom-scroll"
      style={{ height: 500, maxWidth: 500, backgroundColor: '#eee' }}
    >
      <div className="v-custom-scroll__wrapper">
        {times(
          (index) => (
            <div key={index}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              quibusdam fugit at quos. Quod repellendus placeat provident. Iste
              saepe veniam iure, reiciendis a dolor in commodi dolores placeat
              mollitia illum?
            </div>
          ),
          40,
        )}
      </div>
    </div>
  );
};
