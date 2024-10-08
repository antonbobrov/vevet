import React, { FC, useEffect } from 'react';
import { ScrollBar } from '..';
import { times } from '@/utils/internal/times';

export const WithDefaultComponent: FC = () => {
  useEffect(() => {
    const scrollBar = new ScrollBar();

    return () => scrollBar.destroy();
  }, []);

  return (
    <div>
      {times(
        (index) => (
          <div key={index}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
            quibusdam fugit at quos. Quod repellendus placeat provident. Iste
            saepe veniam iure, reiciendis a dolor in commodi dolores placeat
            mollitia illum?
          </div>
        ),
        200,
      )}
    </div>
  );
};
