import React, { FC, useEffect, useRef } from 'react';
import { Preloader, NPreloader } from '..';

interface IProps extends Pick<NPreloader.IChangeableProps, 'hideAnimation'> {}

export const Component: FC<IProps> = ({ hideAnimation }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Preloader({
      container: ref.current,
      hideAnimation,
    });

    return () => instance.destroy();
  }, [hideAnimation]);

  return (
    <>
      <div ref={ref} className="v-preloader" />

      <img src="https://picsum.photos/400/600" alt="" />
      <img src="https://picsum.photos/400/601" alt="" />
      <img src="https://picsum.photos/400/602" alt="" />
    </>
  );
};
