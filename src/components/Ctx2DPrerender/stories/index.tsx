import React, { FC, useEffect, useRef, useState } from 'react';
import { Ctx2DPrerender, NCtx2DPrerender } from '..';

export const Component: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [ctx2d, setCtx2d] = useState<Ctx2DPrerender>();
  const [image, setImage] = useState<HTMLImageElement>();
  const [position, setPosition] =
    useState<NCtx2DPrerender.IChangeableProps['posRule']>('cover');

  useEffect(() => {
    if (!containerRef.current || !image) {
      return undefined;
    }

    const instance = new Ctx2DPrerender({
      media: image,
      container: containerRef.current,
      hasResize: true,
      posRule: 'cover',
    });

    setCtx2d(instance);

    return () => instance.destroy();
  }, [image]);

  useEffect(() => {
    if (!ctx2d) {
      return;
    }

    ctx2d.changeProps({ posRule: position });
  }, [ctx2d, position]);

  return (
    <>
      <img
        src="https://picsum.photos/400/600"
        alt=""
        onLoad={(event) => setImage(event.currentTarget)}
      />

      <br />
      <br />

      <p>Set position:</p>

      {[
        'cover',
        'contain',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'center',
      ].map((rule) => (
        <button
          key={rule}
          type="button"
          onClick={() => setPosition(rule as any)}
        >
          {rule}
        </button>
      ))}

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: 300,
          height: 300,
        }}
      />
    </>
  );
};
