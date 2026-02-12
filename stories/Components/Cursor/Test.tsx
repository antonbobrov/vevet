import React, { FC, useEffect, useRef } from 'react';

import { Cursor } from '@/index';

export const Test: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const refWithSize = useRef<HTMLButtonElement>(null);
  const refWithType = useRef<HTMLButtonElement>(null);
  const refWithSnap = useRef<HTMLButtonElement>(null);
  const refWithNegativeSticky = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Cursor({
      container: ref.current,
      width: '7rem',
      height: '7rem',
      lerp: 0.2,
    });

    const defaultCursor = document.createElement('div');
    defaultCursor.innerHTML = 'default';

    const someTypeCursor = document.createElement('div');
    someTypeCursor.innerHTML = 'some_type';

    instance.attachCursor({
      element: defaultCursor,
      type: 'default',
    });

    instance.attachCursor({
      element: someTypeCursor,
      type: 'some_type',
    });

    instance.attachHover({
      element: instance.domContainer,
      type: 'default',
    });

    if (refWithSize.current) {
      instance.attachHover({
        element: refWithSize.current,
        width: 'auto',
        height: 'auto',
        padding: 10,
      });
    }

    if (refWithType.current) {
      instance.attachHover({
        element: refWithType.current,
        type: 'some_type',
        width: null,
        height: null,
      });
    }

    if (refWithSnap.current) {
      instance.attachHover({
        element: refWithSnap.current,
        width: '10rem',
        height: 'auto',
        padding: '2rem',
        snap: true,
        sticky: true,
        stickyLerp: 0.2,
        stickyAmplitude: { x: '2rem', y: 'auto' },
      });
    }

    if (refWithNegativeSticky.current) {
      instance.attachHover({
        element: refWithNegativeSticky.current,
        emitter: refWithNegativeSticky.current.parentElement,
        sticky: true,
        stickyLerp: 0.2,
        stickyFriction: 0.2,
      });
    }

    return () => instance.destroy();
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <div ref={ref}>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
          voluptate provident ratione, libero explicabo illum iusto minima,
          fugiat sint nemo iure? Enim debitis, quidem id repudiandae distinctio
          sequi culpa harum!
        </p>

        <button ref={refWithSize} type="button">
          Change size on hover
        </button>

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
          voluptate provident ratione, libero explicabo illum iusto minima,
          fugiat sint nemo iure? Enim debitis, quidem id repudiandae distinctio
          sequi culpa harum!
        </p>

        <button ref={refWithType} type="button">
          Change type
        </button>

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
          voluptate provident ratione, libero explicabo illum iusto minima,
          fugiat sint nemo iure? Enim debitis, quidem id repudiandae distinctio
          sequi culpa harum!
        </p>

        <button
          ref={refWithSnap}
          type="button"
          style={{ display: 'block', margin: 'auto', height: 100 }}
        >
          Snap on hover
        </button>

        <div
          style={{
            margin: 'auto',
            width: 'max-content',
            padding: 50,
            textAlign: 'center',
            background: '#eee',
          }}
        >
          <button
            ref={refWithNegativeSticky}
            type="button"
            style={{ height: 100 }}
          >
            Sticky & Friction
          </button>
        </div>
      </div>
    </div>
  );
};
