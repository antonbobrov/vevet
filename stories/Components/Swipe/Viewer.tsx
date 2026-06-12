import React, { FC, useEffect, useRef } from 'react';

import { addEventListener, clamp, onResize, Swipe } from '@/index';

export const Viewer: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const thumb = thumbRef.current;

    function getThumSizes() {
      return { width: thumb!.clientWidth, height: thumb!.clientHeight };
    }

    function getWrapperSize() {
      return { width: wrapper!.clientWidth, height: wrapper!.clientHeight };
    }

    if (!wrapper || !thumb) {
      return undefined;
    }

    const maxScale = 3;
    const minScale = 1;
    const stepScale = 1;

    const instance = new Swipe({
      container: wrapper,
      thumb,
      relative: true,
      inertia: true,
      grabCursor: true,
      buttons: [0],
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

        if (instance.isSwiping) {
          return;
        }

        instance.setScale(
          clamp(instance.scale - evt.deltaY * 0.001, minScale, maxScale),
          evt,
        );
      },
      { passive: false },
    );

    const clicker = addEventListener(thumb, 'dblclick', (evt) => {
      if (instance.scale >= maxScale) {
        instance.setScale(minScale, evt);
      } else {
        instance.setScale(
          clamp(instance.scale + stepScale, minScale, maxScale),
          evt,
        );
      }
    });

    const resizer = onResize({
      element: [wrapper, thumb],

      callback: () => {
        if (instance.scale === minScale) {
          const wrapperSize = getWrapperSize();
          const thumbSize = getThumSizes();

          instance.setMovement({
            x: (wrapperSize.width - thumbSize.width) / 2,
            y: (wrapperSize.height - thumbSize.height) / 2,
          });
        }

        instance.calculateBounds();
        instance.releaseBounce(0);
      },
    });

    return () => {
      instance.destroy();
      resizer.remove();
      wheeler();
      clicker();
    };
  }, []);

  return (
    <>
      <style>
        {`
          .wrapper {
            position: fixed;
            z-index: 1;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 80%;
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

      <div ref={wrapperRef} className="wrapper">
        <img
          ref={thumbRef}
          className="thumb"
          src="https://fastly.picsum.photos/id/314/1920/1080.jpg?hmac=QAv7htpuXdwRq9YJDaEo_1mEiiAkEJeJFoBlSp-l7VY"
        ></img>
      </div>
    </>
  );
};
