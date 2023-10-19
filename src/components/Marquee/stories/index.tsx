import React, { FC, useEffect, useRef, useState } from 'react';
import { Marquee, NMarquee } from '..';

interface IProps extends NMarquee.IChangeableProps {}

export const Component: FC<IProps> = ({
  speed,
  isEnabled,
  pauseOnHover,
  isFpsNormalized,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(400);
  const [marquee, setMarquee] = useState<Marquee | undefined>();

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Marquee({
      container: ref.current,
      speed,
      isEnabled,
      pauseOnHover,
      isFpsNormalized,
    });

    setMarquee(instance);

    return () => instance.destroy();
  }, [isEnabled, isFpsNormalized, pauseOnHover, speed]);

  return (
    <>
      <button type="button" onClick={() => setWidth((val) => val + 20)}>
        Rezize
      </button>

      <button
        type="button"
        onClick={() => marquee?.changeProps({ isEnabled: true })}
      >
        Play
      </button>

      <button
        type="button"
        onClick={() => marquee?.changeProps({ isEnabled: false })}
      >
        Pause
      </button>

      <button type="button" onClick={() => marquee?.render()}>
        Manual render
      </button>

      <br />
      <br />

      <div style={{ background: '#ccc', width }}>
        <span ref={ref}>Marquee</span>
      </div>
    </>
  );
};
