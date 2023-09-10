import React, { FC, useEffect, useRef } from 'react';
import { CustomCursor } from '..';

export const Component: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const refWithSize = useRef<HTMLButtonElement>(null);
  const refWithSticky = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new CustomCursor({
      container: ref.current,
    });

    // @ts-ignore
    window.instance = instance;

    if (refWithSize.current) {
      instance.addHoverElement({
        element: refWithSize.current,
        width: 'auto',
        height: 'auto',
        padding: 10,
      });
    }

    if (refWithSticky.current) {
      instance.addHoverElement({
        element: refWithSticky.current,
        width: 'auto',
        height: 'auto',
        padding: 10,
        isSticky: true,
      });
    }

    return () => instance.destroy();
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
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

      <button ref={refWithSticky} type="button">
        Sticky on hover
      </button>
    </div>
  );
};
