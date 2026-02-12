import React, { FC, useEffect, useRef, useState } from 'react';

import {
  IMarqueeMutableProps,
  IMarqueeStaticProps,
  Marquee,
  Responsive,
} from '@/index';

interface IProps extends IMarqueeStaticProps, IMarqueeMutableProps {}

export const Component: FC<IProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(400);
  const [marquee, setMarquee] = useState<Marquee | undefined>();

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Marquee({
      ...props,
      container: ref.current,
    });

    const responsive = new Responsive(instance, [
      {
        at: '@media (min-width: 768px)',
        props: { gap: 50 },
      },
    ]);

    setMarquee(instance);

    return () => {
      instance.destroy();
      responsive.destroy();
    };
  }, [props]);

  return (
    <>
      <button type="button" onClick={() => setWidth((val) => val + 20)}>
        Resize (changes parent width)
      </button>

      <button
        type="button"
        onClick={() => marquee?.updateProps({ enabled: true })}
      >
        Play
      </button>

      <button
        type="button"
        onClick={() => marquee?.updateProps({ enabled: false })}
      >
        Pause
      </button>

      <button type="button" onClick={() => marquee?.render()}>
        Manual render
      </button>

      <button type="button" onClick={() => marquee?.destroy()}>
        Destroy
      </button>

      <br />

      <br />

      <div
        style={{ background: '#ccc', width, maxWidth: '100%', fontSize: 20 }}
      >
        <div ref={ref}>
          <div>
            <span>Text 1</span>
          </div>

          <div>
            <span>Text 2</span>
          </div>

          <div>
            <span>Text 3</span>
          </div>
        </div>
      </div>
    </>
  );
};
