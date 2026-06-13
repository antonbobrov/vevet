import React, { FC, useEffect, useRef } from 'react';

import { addEventListener, clamp, onResize, Pointers, Swipe } from '@/index';

export type TViewerInteraction = 'simple' | 'pinch';

export interface IViewerProps {
  interaction?: TViewerInteraction;
}

export const Viewer: FC<IViewerProps> = ({ interaction = 'simple' }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);
  const touchCenterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    const swipe = new Swipe({
      container: wrapper,
      pointers: (type) => (type === 'mouse' ? 1 : pointersCount),
      relative: true,
      inertia: true,
      grabCursor: true,
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

    const wheeler = addEventListener(
      thumb,
      'wheel',
      (evt) => {
        evt.preventDefault();

        if (swipe.isSwiping) {
          return;
        }

        swipe.cancelInertia();

        swipe.setScale(
          clamp(swipe.scale - evt.deltaY * 0.001, minScale, maxScale),
          evt,
        );
      },
      { passive: false },
    );

    const clicker = addEventListener(thumb, 'dblclick', (evt) => {
      if (swipe.scale >= maxScale) {
        swipe.setScale(minScale, evt);
      } else {
        swipe.setScale(clamp(swipe.scale + stepScale, minScale, maxScale), evt);
      }
    });

    const resizer = onResize({
      element: [wrapper, thumb],

      callback: () => {
        if (swipe.scale === minScale) {
          const wrapperSize = getWrapperSize();
          const thumbSize = getThumSizes();

          swipe.setMovement({
            x: (wrapperSize.width - thumbSize.width) / 2,
            y: (wrapperSize.height - thumbSize.height) / 2,
          });
        }

        swipe.calculateBounds();
        swipe.releaseBounce(0);
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

        swipe.setScale(
          clamp(swipe.scale * (scale / prevScale), minScale, maxScale),
          startCenter,
        );
      },
      onStart: () => {
        if (interaction === 'simple') {
          swipe.updateProps({ enabled: false, inertia: false });
        }
      },
      onEnd: () => {
        if (interaction === 'simple') {
          setTimeout(() => {
            swipe.updateProps({ enabled: true, inertia: true });
          });
        }
      },
    });

    return () => {
      swipe.destroy();
      resizer.remove();
      wheeler();
      clicker();
      twoPointers.destroy();
    };
  }, [interaction]);

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
