import React, { FC, useEffect, useRef, useState } from 'react';
import { DraggerDirection } from '..';

export const Component: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [dragger, setDragger] = useState<DraggerDirection>();
  const [direction, setDirection] = useState('drag');

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = new DraggerDirection({
      container: containerRef.current,
    });
    setDragger(instance);

    instance.addCallback('down', () => setDirection('down'));
    instance.addCallback('up', () => setDirection('up'));
    instance.addCallback('left', () => setDirection('left'));
    instance.addCallback('right', () => setDirection('right'));

    return () => instance?.destroy();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => dragger?.changeProps({ isEnabled: true })}
      >
        Enable
      </button>

      <button
        type="button"
        onClick={() => dragger?.changeProps({ isEnabled: false })}
      >
        Disable
      </button>

      <div
        ref={containerRef}
        style={{
          width: '200px',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#ccc',
        }}
      >
        {direction}
      </div>
    </>
  );
};
