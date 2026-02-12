import React, { FC, useEffect } from 'react';

import { Scrollbar } from '@/components';

export const InWindow: FC = () => {
  useEffect(() => {
    const scrollbarY = new Scrollbar();

    const scrollbarX = new Scrollbar({
      axis: 'x',
      class: 'my-custom-scrollbar',
    });

    return () => {
      scrollbarY.destroy();
      scrollbarX.destroy();
    };
  }, []);

  return (
    <>
      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 300,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '200%',
          height: 300,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 300,
          background: '#ccc',
        }}
      />

      <div
        style={{
          marginTop: 10,
          width: '100%',
          height: 300,
          background: '#ccc',
        }}
      />
    </>
  );
};
