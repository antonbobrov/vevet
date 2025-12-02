import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { ISplitTextStaticProps, SplitText } from '@/index';

interface IProps
  extends Pick<
    ISplitTextStaticProps,
    'letters' | 'lines' | 'linesWrapper' | 'ignore'
  > {
  text?: string;
  children?: ReactNode;
}

export const Component: FC<IProps> = ({
  letters,
  lines,
  linesWrapper,
  ignore,
  text,
  children,
}) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    // const segmenter = new Intl.Segmenter('th', { granularity: 'word' });

    const instance = new SplitText({
      container,
      letters,
      lines,
      linesWrapper,
      ignore,
      onSplit: () => {
        console.log('split props');
      },
      // wordDelimiter: ',',
      // wordDelimiterOutput: '--',
      // prepareText: (source) =>
      //   [...segmenter.segment(source)].map((s) => s.segment).join(','),
    });

    return () => instance.destroy();
  }, [ignore, letters, lines, linesWrapper]);

  const style = { fontSize: '30px', lineHeight: '30px' } as any;

  return (
    <>
      <h1>Vevet Split Text</h1>

      {text && (
        <div
          ref={ref}
          style={style}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}

      {children && (
        <div ref={ref} style={style}>
          {children}
        </div>
      )}

      <br />

      <br />

      <h1>Reference text</h1>

      {text && <div style={style} dangerouslySetInnerHTML={{ __html: text }} />}

      {children && <div style={style}>{children}</div>}
    </>
  );
};
