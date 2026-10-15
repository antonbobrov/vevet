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
  render: true,
};

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [image, setImage] = useState<HTMLImageElement>();
  const [instance, setInstance] = useState<CanvasMedia>();

  useLogEvents(instance, LOG_EVENTS);

  const deps = useMemo(() => [image], [image]);

  useOnProps(
    props,
    STATIC_PROPS,
    (input) => {
      if (!image) {
        return;
      }

      const mod = new CanvasMedia({
        ...input,
        container: ref.current,
        media: image,
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

      <img
        src="https://picsum.photos/400/600"
        alt=""
        onLoad={(event) => setImage(event.currentTarget)}
      />
    </>
  );
};
