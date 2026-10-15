import React, { FC, useRef, useState } from 'react';

import {
  MUTABLE_PROPS,
  STATIC_PROPS,
} from '@/components/ProgressPreloader/props';
import {
  IProgressPreloaderCallbacksMap,
  IProgressPreloaderMutableProps,
  IProgressPreloaderStaticProps,
  ProgressPreloader,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  IProgressPreloaderStaticProps & IProgressPreloaderMutableProps,
  '__mutableProp' | '__staticProp' | 'container' | 'resourceContainer'
>;

const LOG_EVENTS: Record<keyof IProgressPreloaderCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  loaded: true,
  hide: true,
  requestHide: true,
  hidden: true,
  progress: false,
  resource: true,
  timelineStart: true,
  timelineEnd: true,
  timelineUpdate: false,
};

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const resourceContainerRef = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<ProgressPreloader>();
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCustomResourceLoaded, setIsCustomResourceLoaded] = useState(false);

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input) => {
    const container = ref.current;
    const resourceContainer = resourceContainerRef.current;

    if (!container || !resourceContainer) {
      return undefined;
    }

    const mod = new ProgressPreloader({
      ...input,
      container: ref.current,
      resourceContainer: resourceContainerRef.current,
      onProgress: (data, { progress }) => setProgress(progress),
      onRequestHide: () => setIsLoaded(true),
    });

    setInstance(mod);

    mod.addResource('button', 2);

    const timeout = setTimeout(() => setIsCustomResourceLoaded(true), 2000);

    return () => {
      mod.destroy();
      setInstance(undefined);

      clearTimeout(timeout);

      setIsCustomResourceLoaded(false);
      setProgress(0);
      setIsLoaded(false);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          height: 250,
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          color: '#fff',
        }}
      >
        <div>Progress: {(progress * 100).toFixed(0)}%</div>

        {!isLoaded && (
          <button
            type="button"
            onClick={() => instance?.resolveResource('button')}
          >
            Load custom resource
          </button>
        )}

        {!props.hide && isLoaded && (
          <button type="button" onClick={() => instance?.hide(500)}>
            Hide
          </button>
        )}
      </div>

      <div ref={resourceContainerRef}>
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
      </div>
    </>
  );
};
