import React, { FC, useEffect, useRef, useState } from 'react';
import { DraggerMove } from '..';

export const Component: FC = () => {
  const thumbRef = useRef<HTMLDivElement>(null);

  const [dragger, setDragger] = useState<DraggerMove>();

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) {
      return undefined;
    }

    const instance = new DraggerMove({
      container: thumb,
    });

    setDragger(instance);

    instance.addCallback('move', ({ diff }) => {
      thumb.style.transition = '';
      thumb.style.transform = `translate(${diff.x}px, ${diff.y}px)`;
    });

    instance.addCallback('end', () => {
      thumb.style.transition = 'transform 0.35s';
      thumb.style.transform = '';
    });

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
        style={{
          position: 'relative',
          marginTop: 10,
          width: '300px',
          height: '300px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ccc',
        }}
      >
        <div
          ref={thumbRef}
          id="drag-thumb"
          style={{
            position: 'relative',
            width: '250px',
            height: '250px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            cursor: 'pointer',
            textAlign: 'center',
            color: '#fff',
            opacity: 0.75,
            touchAction: 'pan-y',
          }}
        >
          <a href="/" style={{ color: 'currentcolor' }}>
            Drag me
          </a>
        </div>
      </div>
    </>
  );
};
