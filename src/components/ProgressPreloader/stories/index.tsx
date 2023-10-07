import React, { FC, useEffect, useRef, useState } from 'react';
import { ProgressPreloader } from '..';

export const Component: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [isTestElementInDom, setIsTestElementInDom] = useState(true);
  const [isCustomResourceLoaded, setIsCustomResourceLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const instance = new ProgressPreloader({
      container,
      canPreloadImages: true,
      canPreloadVideos: true,
    });

    instance.addCallback('progress', ({ progress: progressProp }) => {
      setProgress(progressProp);
    });

    instance.addCallback('resourceLoad', (data) => {
      // eslint-disable-next-line no-console
      console.log('resourceLoad', data);
    });

    setIsTestElementInDom(false);

    const timeout = setTimeout(() => setIsCustomResourceLoaded(true), 2000);

    return () => {
      instance?.destroy();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="v-preloader"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ccc',
          fontSize: 40,
        }}
      >
        {(progress * 100).toFixed(0).padStart(2, '0')}
      </div>

      <img src="https://picsum.photos/400/600" alt="" crossOrigin="anonymous" />
      <img src="https://picsum.photos/400/601" alt="" crossOrigin="anonymous" />
      <img src="https://picsum.photos/400/602" alt="" crossOrigin="anonymous" />

      {isTestElementInDom && (
        <video
          autoPlay
          muted
          controls
          src="https://www.shutterstock.com/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.mp4"
        />
      )}

      <p
        className="js-preload"
        data-is-loaded={isCustomResourceLoaded ? 'true' : 'false'}
      >
        Custom preload
      </p>
    </>
  );
};
