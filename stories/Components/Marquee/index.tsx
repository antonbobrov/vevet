import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Marquee/props';
import {
  IMarqueeCallbacksMap,
  IMarqueeMutableProps,
  IMarqueeStaticProps,
  Marquee,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  IMarqueeStaticProps & IMarqueeMutableProps,
  '__mutableProp' | '__staticProp' | 'container'
>;

const LOG_EVENTS: Record<keyof IMarqueeCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  render: false,
  resize: true,
  clone: true,
};

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState(400);
  const [instance, setInstance] = useState<Marquee>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input) => {
    if (!ref.current) {
      return undefined;
    }

    const mod = new Marquee({
      ...input,
      container: ref.current,
    });

    setInstance(mod);

    return () => {
      mod.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <button type="button" onClick={() => setSize((val) => val + 20)}>
        Resize (changes parent size)
      </button>

      <button type="button" onClick={() => setSize(400)}>
        Reset size
      </button>

      <div
        style={{
          background: '#ccc',
          width: props.direction === 'vertical' ? '100%' : size,
          height: props.direction === 'horizontal' ? '100%' : size,
          maxWidth: '100%',
          fontSize: 20,
        }}
      >
        <div ref={ref}>
          <span>Text 1</span>

          <span>Text 2</span>

          <span>Text 3</span>
        </div>
      </div>
    </>
  );
};
