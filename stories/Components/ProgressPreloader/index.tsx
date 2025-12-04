import React, { FC, useEffect, useRef, useState } from 'react';
import { ProgressPreloader } from '@/index';

export const Component: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [preloader, setPreloader] = useState<ProgressPreloader | null>(null);
  const [isCustomResourceLoaded, setIsCustomResourceLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new ProgressPreloader(
      {
        container: ref.current,
        preloadImages: true,
        preloadVideos: true,
      },
      {
        onProgress: () => setProgress(instance.progress),
        onResource: (res) => console.log('resource', res),
      },
    );

    setPreloader(instance);

    const timeout = setTimeout(() => setIsCustomResourceLoaded(true), 2000);

    instance.addResource('button', 2);

    return () => {
      instance?.destroy();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ccc',
          fontSize: 40,
          gap: 20,
        }}
      >
        <div>Progress: {(progress * 100).toFixed(0)}%</div>

        <button
          type="button"
          onClick={() => preloader?.resolveResource('button')}
        >
          Load button
        </button>
      </div>

      <br />

      <p
        className="js-preload"
        data-weight="1"
        data-loaded={isCustomResourceLoaded ? 1 : 0}
      >
        Custom invisible resource
      </p>

      <img
        src="https://picsum.photos/400/600"
        alt=""
        crossOrigin="anonymous"
        height={200}
      />

      <img
        src="https://picsum.photos/400/601"
        alt=""
        crossOrigin="anonymous"
        loading="lazy"
        height={200}
      />

      <img
        src="https://picsum.photos/400/602"
        alt=""
        crossOrigin="anonymous"
        className="js-preload-ignore"
        height={200}
      />

      <video
        height={200}
        autoPlay
        muted
        controls
        src="https://www.shutterstock.com/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.mp4"
      />
    </>
  );
};
