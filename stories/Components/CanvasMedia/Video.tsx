import React, { FC, useMemo, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/CanvasMedia/props';
import {
  CanvasMedia,
  ICanvasMediaCallbacksMap,
  ICanvasMediaMutableProps,
  ICanvasMediaStaticProps,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  ICanvasMediaStaticProps & ICanvasMediaMutableProps,
  '__mutableProp' | '__staticProp' | 'container'
>;

const LOG_EVENTS: Record<keyof ICanvasMediaCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  resize: true,
  render: false,
};

const VIDEO_SRC =
  'https://www.shutterstock.com/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.mp4';

export const Video: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [media, setMedia] = useState<HTMLVideoElement>();
  const [instance, setInstance] = useState<CanvasMedia>();

  useLogEvents(instance, LOG_EVENTS);

  const deps = useMemo(() => [media], [media]);

  useOnProps(
    props,
    STATIC_PROPS,
    (input) => {
      if (!media) {
        return;
      }

      const mod = new CanvasMedia({
        ...input,
        container: ref.current,
        media,
      });

      setInstance(mod);

      return () => {
        mod.destroy();
        setInstance(undefined);
      };
    },
    deps,
  );

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
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

      <p>Original media</p>

      <video
        height={200}
        autoPlay
        muted
        controls
        playsInline
        src={VIDEO_SRC}
        onLoadedMetadata={(event) => setMedia(event.currentTarget)}
      />
    </>
  );
};
