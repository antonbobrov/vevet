import React, { FC, useEffect, useState } from 'react';

import { Snap } from '@/components';

interface IProps {
  instance?: Snap | undefined;
  activeIndex?: number;
}

export const Nav: FC<IProps> = ({
  instance,
  activeIndex: initialActiveIndex,
}) => {
  const [count, setCount] = useState(0);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(true);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    if (!instance) {
      return undefined;
    }

    setCount(instance.slides.length);

    const onUpdate = instance.on('update', () => {
      setIsStart(instance.isStart);
      setIsEnd(instance.isEnd);
    });

    const onIndex = instance.on('activeSlide', () => {
      setActiveIndex(instance.activeIndex);
    });

    return () => {
      setIsStart(false);
      setIsEnd(false);
      setActiveIndex(0);

      onUpdate();
      onIndex();
    };
  }, [instance]);

  useEffect(() => {
    instance?.toSlide(activeIndex);
  }, [instance, activeIndex]);

  return (
    <>
      <br />

      <br />

      <button type="button" onClick={() => instance?.prev()}>
        Prev
      </button>

      <button type="button" onClick={() => instance?.next()}>
        Next
      </button>

      <br />

      <br />

      <button
        type="button"
        disabled={isStart}
        onClick={() => setActiveIndex(0)}
      >
        Start
      </button>

      {new Array(count)
        .fill(0)
        .map((_, index) => index)
        .map((slide, index) => (
          <button
            key={index}
            type="button"
            disabled={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          >
            {index}
          </button>
        ))}

      <button
        type="button"
        disabled={isEnd}
        onClick={() => setActiveIndex(count - 1)}
      >
        End
      </button>
    </>
  );
};
