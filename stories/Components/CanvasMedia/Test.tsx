import React, { FC, useEffect, useRef, useState } from 'react';
import { CanvasMedia, ICanvasMediaMutableProps } from '@/index';

export const Test: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [image, setImage] = useState<HTMLImageElement>();
  const [instance, setInstance] = useState<CanvasMedia>();
  const [rule, setRule] = useState<ICanvasMediaMutableProps['rule']>('cover');

  useEffect(() => {
    if (!ref.current || !image) {
      return undefined;
    }

    const media = new CanvasMedia({
      media: image,
      container: ref.current,
      resizeOnRuntime: true,
      rule: 'cover',
    });

    setInstance(media);

    return () => media.destroy();
  }, [image]);

  useEffect(() => {
    if (!instance) {
      return;
    }

    instance.updateProps({ rule });
  }, [instance, rule]);

  return (
    <>
      {[
        'cover',
        'contain',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'center',
      ].map((key) => (
        <button key={key} type="button" onClick={() => setRule(key as any)}>
          {key}
        </button>
      ))}

      <div
        ref={ref}
        style={{
          position: 'relative',
          width: 300,
          maxWidth: '100%',
          height: 300,
          background: '#ccc',
        }}
      />

      <br />

      <p>Original media</p>

      <img
        src="https://picsum.photos/400/600"
        alt=""
        onLoad={(event) => setImage(event.currentTarget)}
      />
    </>
  );
};
