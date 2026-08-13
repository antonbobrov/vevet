import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Canvas/props';
import {
  Canvas,
  ICanvasCallbacksMap,
  ICanvasMutableProps,
  ICanvasStaticProps,
  TCanvasRender,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  ICanvasStaticProps & ICanvasMutableProps,
  '__mutableProp' | '__staticProp' | 'container'
>;

const LOG_EVENTS: Record<keyof ICanvasCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  resize: true,
};

const render: TCanvasRender = ({ ctx, width, height }) => {
  ctx.beginPath();
  ctx.fillStyle = '#ccc';
  ctx.fillRect(0, 0, width, height);
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = '#000';
  ctx.fillRect(10, 10, 50, 50);
  ctx.closePath();
};

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [instance, setInstance] = useState<Canvas>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input) => {
    const mod = new Canvas({
      ...input,
      container: ref.current,
    });

    setInstance(mod);

    mod.render(render);
    mod.on('resize', () => mod.render(render));

    return () => {
      mod.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: 300,
        maxWidth: '100%',
        height: 300,
      }}
    />
  );
};
