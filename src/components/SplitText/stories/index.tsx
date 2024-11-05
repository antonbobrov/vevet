/* eslint-disable react/no-danger */
import React, { FC, useEffect, useRef } from 'react';
import { NSplitText } from '../types';
import { SplitText } from '..';

interface IProps extends Omit<NSplitText.IStaticProps, 'parent' | 'container'> {
  text: string;
}

export const Component: FC<IProps> = ({ text, hasLetters, hasLines }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return undefined;
    }

    const instance = new SplitText({
      container,
      hasLetters,
      hasLines,
    });

    return () => instance.destroy();
  }, [hasLetters, hasLines]);

  const style = { fontSize: '30px', fontKerning: 'none' } as any;

  return (
    <>
      <h1>Vevet Split Text</h1>

      <div ref={ref} style={style} dangerouslySetInnerHTML={{ __html: text }} />

      <br />

      <br />

      <h1>Reference text</h1>

      <div style={style} dangerouslySetInnerHTML={{ __html: text }} />
    </>
  );
};
