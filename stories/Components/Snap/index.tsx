import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Snap/props';
import { ISnapMutableProps, ISnapStaticProps, Scrollbar, Snap } from '@/index';
import { isRtl } from '@/internal';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS } from './constants';
import { Nav } from './Nav';

type TProps = Omit<
  ISnapStaticProps & ISnapMutableProps,
  '__mutableProp' | '__staticProp' | 'container' | 'eventsEmitter'
>;

const SLIDES = [
  { color: '#A8E6CF', size: 200 },
  { color: '#DCEDC1', size: 600 },
  { color: '#FFD3B6', size: 700 },
  { color: '#FF8B94', size: 150 },
  { color: '#f00', size: 600 },
];

export const Component: FC<TProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Snap>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const infos = Array.from(
      container.querySelectorAll<HTMLElement>('.js-slide-info'),
    );

    const rtl = isRtl(container);

    const mod = new Snap({
      ...input,
      container,
      onUpdate: (data, snap) => {
        snap.slides.forEach(({ element, coord, progress }, index) => {
          const finalCoord =
            rtl && mod.props.direction === 'horizontal' ? -coord : coord;

          element!.style.transform =
            mod.props.direction === 'horizontal'
              ? `translate(${finalCoord}px, 0)`
              : `translate(0, ${finalCoord}px)`;

          const info = infos[index];
          info.innerHTML = `${index} / ${progress.toFixed(2)} / ${Math.round(
            finalCoord,
          )}`;
        });
      },
    });

    setInstance(mod);

    const scrollbar = new Scrollbar({
      container: mod,
      axis: input.direction === 'vertical' ? 'y' : 'x',
      autoHide: true,
    });

    return () => {
      mod.destroy();
      scrollbar.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  const isVertical = props.direction === 'vertical';

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
            
          [dir="rtl"] .snap-test__slide {
            right: 0;
            left: initial;
          }

          .snap-test[data-direction='vertical'] .snap-test__slide {
            width: 300px;
            height: 200px;
          }
        `}
      </style>

      <div ref={ref} className="snap-test" data-direction={props.direction}>
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

      <Nav instance={instance} activeIndex={props.activeIndex} />
    </>
  );
};
