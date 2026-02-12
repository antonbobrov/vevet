import React, { FC, useEffect, useRef } from 'react';

import { Scrollbar } from '@/components';

export const InElement: FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parentRef.current || !scrollableRef.current) {
      return undefined;
    }

    const scrollbarY = new Scrollbar({
      container: scrollableRef.current,
      parent: parentRef.current,
    });

    const scrollbarX = new Scrollbar({
      container: scrollableRef.current,
      parent: parentRef.current,
      axis: 'x',
    });

    return () => {
      scrollbarY.destroy();
      scrollbarX.destroy();
    };
  }, []);

  return (
    <div ref={parentRef} style={{ position: 'relative', width: 250 }}>
      <div ref={scrollableRef} style={{ overflow: 'auto', height: 250 }}>
        <div
          style={{
            marginTop: 10,
            width: '100%',
            height: 150,
            background: '#ccc',
          }}
        />

        <div
          style={{
            marginTop: 10,
            width: '200%',
            height: 150,
            background: '#ccc',
          }}
        />

        <div
          style={{
            marginTop: 10,
            width: '100%',
            height: 150,
            background: '#ccc',
          }}
        />
      </div>
    </div>
  );
};
