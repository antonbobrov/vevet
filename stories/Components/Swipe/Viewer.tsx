import React, { FC, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Swipe/props';
import { addEventListener, clamp, onResize, Pointers, Swipe } from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS, TProps } from './constants';

type TCustomProps = TProps & {
  interaction: 'simple' | 'pinch';
};

export const ViewerComponent: FC<TCustomProps> = ({
  interaction,
  ...props
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);
  const touchCenterRef = useRef<HTMLDivElement>(null);

  const [instance, setInstance] = useState<Swipe>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const wrapper = wrapperRef.current;
    const thumb = thumbRef.current;
    const touchCenter = touchCenterRef.current;

    function getThumSizes() {
      return { width: thumb!.clientWidth, height: thumb!.clientHeight };
    }

    function getWrapperSize() {
      return { width: wrapper!.clientWidth, height: wrapper!.clientHeight };
    }

    if (!wrapper || !thumb || !touchCenter) {
      return undefined;
    }

    const maxScale = 5;
    const minScale = 1;
    const stepScale = 1;
    const pointersCount = interaction === 'pinch' ? 2 : 1;

    const mod = new Swipe({
      ...input,
      container: wrapper,
      pointers: (type) => (type === 'mouse' ? 1 : pointersCount),
      relative: true,
      buttons: (type) =>
        type === 'touch' ? [0] : [interaction === 'simple' ? 0 : 2],
      inertiaRatio: interaction === 'simple' ? 1 : 0.1,
      bounds: ({ scale }) => {
        const wrapperSize = getWrapperSize();
        const thumbSize = getThumSizes();

        return {
          x: [0, wrapperSize.width - thumbSize.width * scale],
          y: [0, wrapperSize.height - thumbSize.height * scale],
        };
      },
      onMove: ({ movement, scale }) => {
        thumb.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;
      },
    });

    setInstance(mod);

    const wheeler = addEventListener(
      thumb,
      'wheel',
      (evt) => {
        evt.preventDefault();

        if (mod.isSwiping) {
          return;
        }

        mod.cancelInertia();

        mod.setScale(
          clamp(mod.scale - evt.deltaY * 0.001, minScale, maxScale),
          evt,
        );
      },
      { passive: false },
    );

    const clicker = addEventListener(thumb, 'dblclick', (evt) => {
      if (mod.scale >= maxScale) {
        mod.setScale(minScale, evt);
      } else {
        mod.setScale(clamp(mod.scale + stepScale, minScale, maxScale), evt);
      }
    });

    const resizer = onResize({
      element: [wrapper, thumb],

      callback: () => {
        if (mod.scale === minScale) {
          const wrapperSize = getWrapperSize();
          const thumbSize = getThumSizes();

          mod.setMovement({
            x: (wrapperSize.width - thumbSize.width) / 2,
            y: (wrapperSize.height - thumbSize.height) / 2,
          });
        }

        mod.calculateBounds();
        mod.releaseBounce(0);
      },
    });

    const twoPointers = new Pointers({
      container: wrapper,
      minPointers: 2,
      maxPointers: 2,
      relative: false,
      onMove: ({ prevScale, scale, startCenter }) => {
        if (prevScale === scale) {
          return;
        }

        touchCenter.style.top = `${startCenter.y}px`;
        touchCenter.style.left = `${startCenter.x}px`;

        mod.setScale(
          clamp(mod.scale * (scale / prevScale), minScale, maxScale),
          startCenter,
        );
      },
      onStart: () => {
        if (interaction === 'simple') {
          mod.updateProps({ enabled: false, inertia: false });
        }
      },
      onEnd: () => {
        if (interaction === 'simple') {
          setTimeout(() => {
            mod.updateProps({ enabled: true, inertia: true });
          });
        }
      },
    });

    return () => {
      mod.destroy();
      setInstance(undefined);

      resizer.remove();
      wheeler();
      clicker();
      twoPointers.destroy();
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <style>
        {`
          .touch-center {
            position: fixed;
            top: 0;
            left: 0;
            width: 4px;
            height: 4px;
            background: #f00;
            z-index: 9;
            pointer-events: none;
          }

          .wrapper {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            min-height: 300px;
            overflow: hidden;

            background: #ddd;
          }

          .thumb {
            display: block;
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;

            transform-origin: top left;
          }
        `}
      </style>

      <div ref={touchCenterRef} className="touch-center" />

      <div ref={wrapperRef} className="wrapper">
        <img
          ref={thumbRef}
          className="thumb"
          src="https://fastly.picsum.photos/id/314/1920/1080.jpg?hmac=QAv7htpuXdwRq9YJDaEo_1mEiiAkEJeJFoBlSp-l7VY"
          alt=""
        />
      </div>
    </>
  );
};
