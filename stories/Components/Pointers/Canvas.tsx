import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Pointers/props';
import {
  Canvas,
  IPointersCallbacksMap,
  IPointersMutableProps,
  IPointersStaticProps,
  Pointers,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  IPointersStaticProps & IPointersMutableProps,
  '__mutableProp' | '__staticProp' | 'container'
>;

const LOG_EVENTS: Record<keyof IPointersCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  start: true,
  pointerdown: true,
  pointermove: false,
  move: true,
  pointerup: true,
  end: true,
};

export const CanvasComponent: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Pointers>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const colors = ['red', 'green', 'blue', 'yellow'];

    const ctx2d = new Canvas({
      container,
      append: true,
      resizeOnInit: true,
      resizeOnRuntime: true,
      dpr: 1,
    });

    const mod = new Pointers({
      ...input,
      container,
      onPointermove: ({ pointer }) => {
        const color = colors[pointer.index] || 'white';

        ctx2d.render(({ ctx, dpr }) => {
          ctx.beginPath();
          ctx.quadraticCurveTo(
            pointer.prev.x,
            pointer.prev.y,
            pointer.current.x,
            pointer.current.y,
          );
          ctx.lineWidth = 3 * dpr;
          ctx.strokeStyle = color;
          ctx.stroke();
          ctx.closePath();
        });
      },
    });

    setInstance(mod);

    return () => {
      mod.destroy();
      ctx2d.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <style>
        {`
          .container {
            position: relative;
            width: 100%;
            height: 80svh;
            background-color: #000;
            touch-action: none;
            background-color: #000;
            touch-action: none;
          }
        `}
      </style>

      <div ref={ref} className="container" />
    </>
  );
};
