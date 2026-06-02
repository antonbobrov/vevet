import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import { Responsive, Scrollbar, Snap } from '@/index';
import type { ISnapMutableProps } from '@/index';

export type TTestSnapProps = Partial<Omit<ISnapMutableProps, 'slides'>>;

const BASE_SNAP_PROPS: TTestSnapProps = {
  wheel: true,
  wheelAxis: 'y',
  origin: 'start',
  loop: false,
  freemode: false,
  gap: 20,
  grabCursor: true,
};

export interface ITestProps {
  snapProps?: TTestSnapProps;
}

const SLIDES = [
  { color: '#A8E6CF', size: 200 },
  { color: '#DCEDC1', size: 600 },
  { color: '#FFD3B6', size: 700 },
  { color: '#FF8B94', size: 150 },
  { color: '#f00', size: 600 },
];

function getSnapProps(snapProps?: TTestSnapProps) {
  return {
    ...BASE_SNAP_PROPS,
    ...snapProps,
  };
}

export const Test: FC<ITestProps> = ({ snapProps }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carousel, setCarousel] = useState<Snap>();

  const resolvedProps = useMemo(() => getSnapProps(snapProps), [snapProps]);
  const isVertical = resolvedProps.direction === 'vertical';

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const container = ref.current;
    const props = resolvedProps;
    const axis = props.direction === 'vertical' ? 'y' : 'x';

    const infos = Array.from(
      container.querySelectorAll<HTMLElement>('.js-slide-info'),
    );

    const instance = new Snap({
      ...props,
      container,
      onActiveSlide: (slide) => setActiveIndex(slide.index),
      onUpdate: (data, snap) => {
        setIsStart(snap.isStart);
        setIsEnd(snap.isEnd);

        snap.slides.forEach(({ element, coord, progress }, index) => {
          element!.style.transform =
            axis === 'x' ? `translateX(${coord}px)` : `translateY(${coord}px)`;

          const info = infos[index];
          info.innerHTML = `${index} / ${progress.toFixed(2)} / ${Math.round(
            coord,
          )}`;
        });
      },
    });

    new Responsive(instance, [
      { at: '@media (max-width: 600px)', props: { gap: 10 } },
    ]);

    instance.on('idle', () => {
      console.log('idle');
    });

    const scrollbar = new Scrollbar({
      container: instance,
      axis,
      autoHide: false,
    });

    setCarousel(instance);

    return () => {
      instance.destroy();
      scrollbar.destroy();
    };
  }, [resolvedProps]);

  useEffect(() => {
    carousel?.toSlide(activeIndex);
  }, [activeIndex]);

  return (
    <>
      <style>
        {`
          .snap-test {
            position: relative;
            margin: 0 auto;
            width: 400px;
            max-width: 80%;
            height: 300px;
            background: #000;
            overflow: hidden;
          }

          .snap-test[data-direction='vertical'] {
            width: 300px;
            height: 400px;
          }
            
          .snap-test__slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 20px;
            opacity: 0.75;
            overflow: hidden;
          }

          .snap-test[data-direction='vertical'] .snap-test__slide {
            width: 300px;
            height: 200px;
          }

          .snap-test__props {
            margin: 16px auto;
            width: 400px;
            max-width: 80%;
            white-space: pre-wrap;
            font-size: 12px;
          }

        `}
      </style>

      <pre className="snap-test__props">
        {JSON.stringify(resolvedProps, null, 2)}
      </pre>

      <div
        ref={ref}
        className="snap-test"
        data-direction={isVertical ? 'vertical' : 'horizontal'}
      >
        {SLIDES.map(({ color, size }, index) => (
          <div
            key={color}
            className="snap-test__slide"
            style={{
              backgroundColor: color,
              width: isVertical ? undefined : size,
              height: isVertical ? size : undefined,
            }}
          >
            <p className="js-slide-info">{index}</p>

            <button type="button" onClick={() => alert('test')}>
              click me
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => carousel?.prev()}>
        Prev
      </button>

      <button type="button" onClick={() => carousel?.next()}>
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

      {SLIDES.map((slide, index) => (
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
        onClick={() => setActiveIndex(SLIDES.length - 1)}
      >
        End
      </button>
    </>
  );
};
