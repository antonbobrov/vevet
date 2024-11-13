import React, { FC, useEffect, useRef, useState } from 'react';
import { Marquee, NMarquee } from '..';
import { times } from '@/utils/internal/times';

interface IProps extends NMarquee.IChangeableProps {}

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
      gap: 10,
      isCentered: true,
    });

    setMarquee(instance);

    return () => instance.destroy();
  }, [props]);

  return (
    <>
      <button type="button" onClick={() => setWidth((val) => val + 20)}>
        Rezize (changes parent width)
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

      <button type="button" onClick={() => marquee?.destroy()}>
        Destroy
      </button>

      <br />

      <br />

      <div style={{ background: '#ccc', width, fontSize: 20 }}>
        <div ref={ref}>
          {times(
            (index) => (
              <div key={index}>
                <span>Text {index}</span>
              </div>
            ),
            3,
          )}
        </div>
      </div>
    </>
  );
};
