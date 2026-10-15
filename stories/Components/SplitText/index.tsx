import React, { FC, useRef, useState } from 'react';

import { GET_STATIC_PROPS, MUTABLE_PROPS } from '@/components/SplitText/props';
import {
  ISplitTextCallbacksMap,
  ISplitTextMutableProps,
  ISplitTextStaticProps,
  SplitText,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  ISplitTextStaticProps & ISplitTextMutableProps,
  '__mutableProp' | '__staticProp' | 'container'
> & {
  text: string;
};

const LOG_EVENTS: Record<keyof ISplitTextCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  beforeSplit: true,
  split: true,
};

const STATIC_PROPS = GET_STATIC_PROPS('v-split-text');

const style = {
  fontSize: '32px',
  lineHeight: '30px',
  fontKerning: 'none',
} as any;

export const Component: FC<TProps> = ({ text, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<SplitText>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const mod = new SplitText({
      ...input,
      container,
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .v-split-text__letter:nth-of-type(even) {
              background-color: rgba(150, 0, 0, 0.1);
            }
              
            .v-split-text__word:nth-of-type(even) {
              background-color: rgba(0, 150, 0, 0.1);
            }
              
            .v-split-text__line:nth-of-type(even) {
              background-color: rgba(0, 0, 150, 0.1);
            }
              
            .v-split-text__line-wrapper:nth-of-type(even) {
              background-color: rgba(150, 0, 150, 0.1);
            }

            .js-ignore {
              background-color: rgba(255, 0, 0, 0.3);
            }
        `,
        }}
      ></style>

      <h1>SplitText</h1>

      <div
        style={{
          resize: 'horizontal',
          overflow: 'hidden',
          maxWidth: 600,
          background: 'rgba(0, 0, 0, 0.1)',
          padding: 10,
        }}
      >
        {text && (
          <div
            ref={ref}
            style={style}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}

        <br />

        <h1>Reference</h1>

        {text && (
          <div style={style} dangerouslySetInnerHTML={{ __html: text }} />
        )}
      </div>
    </>
  );
};
