import React, { FC, useEffect, useRef } from 'react';
import { times } from '@/utils/common';
import { ScrollBar } from '..';

export const WithInnerScrollComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const scrollBar = new ScrollBar({
      container: containerRef.current,
      domParent: document.body,
    });

    return () => scrollBar.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: 500,
        maxWidth: 500,
        backgroundColor: '#eee',
        overflow: 'auto',
      }}
    >
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
  );
};
