import React, { FC, useEffect, useRef } from 'react';
import { SplitText, NSplitText } from '..';

interface IProps extends Omit<NSplitText.IStaticProps, 'parent' | 'container'> {
  text: string;
}

export const Component: FC<IProps> = ({ text, ...props }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new SplitText({
      ...props,
      container: ref.current,
    });

    return () => instance.destroy();
  }, [props]);

  // eslint-disable-next-line react/no-danger
  return <h1 ref={ref} dangerouslySetInnerHTML={{ __html: text }} />;
};
