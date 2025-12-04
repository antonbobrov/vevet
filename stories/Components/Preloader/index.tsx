import React, { FC, useEffect, useRef, useState } from 'react';
import { IPreloaderStaticProps, Preloader } from '@/index';

interface IProps extends Pick<IPreloaderStaticProps, 'hide'> {}

export const Component: FC<IProps> = ({ hide }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [preloader, setPreloader] = useState<Preloader>();

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Preloader(
      {
        container: ref.current,
        hide,
      },
      {
        onDestroy: () => console.log('destroy'),
        onHidden: () => console.log('hidden'),
        onHide: () => console.log('hide'),
        onLoaded: () => console.log('loaded'),
        onProps: () => console.log('props'),
      },
    );

    setPreloader(instance);

    return () => instance.destroy();
  }, [hide]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!hide && (
          <button type="button" onClick={() => preloader?.hide(5000)}>
            Hide
          </button>
        )}
      </div>

      <img src="https://picsum.photos/400/600" alt="" />

      <img src="https://picsum.photos/400/601" alt="" />

      <img src="https://picsum.photos/400/602" alt="" />
    </div>
  );
};
