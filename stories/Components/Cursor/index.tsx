import React, { FC, useEffect, useRef } from 'react';
import { Cursor } from '@/index';

// todo: demo with sticky hover both x & y axis

export const Component: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const refWithSize = useRef<HTMLButtonElement>(null);
  const refWithSnap = useRef<HTMLButtonElement>(null);
  const refWithType = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ref.current || !svgRef.current) {
      return undefined;
    }

    const instance = new Cursor({
      container: ref.current,
      width: '7rem',
      height: '5rem',
      lerp: 0.2,
      // behavior: 'path', // todo: fix snap with path
    });

    svgRef.current.append(instance.path);
    instance.path.style.fill = 'transparent';
    instance.path.style.stroke = '#f00';

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

    instance.attachElement({
      element: instance.domContainer,
      type: 'default',
    });

    if (refWithSize.current) {
      instance.attachElement({
        element: refWithSize.current,
        width: 'auto',
        height: 'auto',
        padding: 10,
      });
    }

    if (refWithType.current) {
      instance.attachElement({
        element: refWithType.current,
        type: 'some_type',
        width: null,
        height: null,
      });
    }

    if (refWithSnap.current) {
      instance.attachElement({
        element: refWithSnap.current,
        width: '10rem',
        height: 'auto',
        padding: '2rem',
        snap: true,
        sticky: true,
        stickyLerp: 0.2,
        stickyAmplitude: { x: 'auto', y: 'auto' },
      });
    }

    return () => instance.destroy();
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <svg
        ref={svgRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

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
          style={{ margin: 200, height: 100 }}
        >
          Snap on hover
        </button>
      </div>
    </div>
  );
};
