import React, { FC, useEffect, useRef } from 'react';
import { Cursor } from '@/index';

export const Component: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const refWithSize = useRef<HTMLButtonElement>(null);
  const refWithSnap = useRef<HTMLButtonElement>(null);
  const refWithType = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Cursor({
      container: window,
      width: 60,
      height: 60,
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

    if (refWithSnap.current) {
      instance.attachElement({
        element: refWithSnap.current,
        width: 'auto',
        height: 'auto',
        padding: 10,
        snap: true,
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

    return () => instance.destroy();
  }, []);

  return (
    <div ref={ref}>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
        voluptate provident ratione, libero explicabo illum iusto minima, fugiat
        sint nemo iure? Enim debitis, quidem id repudiandae distinctio sequi
        culpa harum!
      </p>

      <button ref={refWithSize} type="button">
        Change size on hover
      </button>

      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
        voluptate provident ratione, libero explicabo illum iusto minima, fugiat
        sint nemo iure? Enim debitis, quidem id repudiandae distinctio sequi
        culpa harum!
      </p>

      <button ref={refWithType} type="button">
        Change type
      </button>

      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
        voluptate provident ratione, libero explicabo illum iusto minima, fugiat
        sint nemo iure? Enim debitis, quidem id repudiandae distinctio sequi
        culpa harum!
      </p>

      <button ref={refWithSnap} type="button">
        Snap on hover
      </button>
    </div>
  );
};
