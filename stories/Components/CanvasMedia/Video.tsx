import React, { FC, useEffect, useRef, useState } from 'react';

import { CanvasMedia, ICanvasMediaMutableProps } from '@/index';

export const Video: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);

  const [instance, setInstance] = useState<CanvasMedia>();
  const [rule, setRule] = useState<ICanvasMediaMutableProps['rule']>('cover');

  useEffect(() => {
    if (!ref.current || !mediaRef.current) {
      return undefined;
    }

    const media = new CanvasMedia({
      media: mediaRef.current,
      container: ref.current,
      resizeOnRuntime: false,
      rule: 'cover',
    });

    setInstance(media);

    return () => media.destroy();
  }, []);

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

      <video
        ref={mediaRef}
        height={200}
        autoPlay
        muted
        controls
        src="https://www.shutterstock.com/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.mp4"
      />
    </>
  );
};
