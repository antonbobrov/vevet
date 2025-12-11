/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { clamp, lerp, Snap, Timeline, vevet } from '@/index';

export const DynamicWidth: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const timelineIndex = useRef(0);

  const [snap, setSnap] = useState<Snap>();

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap(
      {
        container: ref.current,
        direction: 'horizontal',
        gap: '1vw',
        wheel: true,
        wheelAxis: 'y',
        freemode: true,
        stickOnResize: false,
        edgeFriction: 1,
        grabCursor: true,
      },
      {
        onUpdate: (data, { slides }) => {
          slides.forEach(({ element, coord }) => {
            element!.style.transform = `translateX(${coord}px)`;
          });
        },
      },
    );

    setSnap(instance);

    return () => instance.destroy();
  }, []);

  const toggleSlide = useCallback(
    (index: number) => {
      if (!snap) {
        return;
      }

      timelineIndex.current = index;

      const slide = snap.slides[index];
      const element = slide.element!;

      element.classList.toggle('active');
      const isExpanding = element.classList.contains('active');

      const fromWidth = (element.offsetWidth / vevet.width) * 100;
      const startTrack = snap.track.current;

      const tm = new Timeline(
        {
          duration: 500,
        },
        {
          onUpdate: ({ eased }) => {
            const toWidth = isExpanding ? 45 : 20;
            element.style.width = `${lerp(fromWidth, toWidth, eased)}vw`;

            slide.resize();

            if (timelineIndex.current === index) {
              if (isExpanding) {
                snap.track.set(
                  lerp(
                    startTrack,
                    clamp(slide.staticCoord, snap.track.min, snap.track.max),
                    eased,
                  ),
                );
              } else {
                snap.track.clampTarget();
              }
            }
          },
        },
      );

      tm.play();
    },
    [snap],
  );

  return (
    <>
      <style>
        {`
          .slider {
            position: fixed;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100%;
            height: 30vw;
          }
            
          .slide {
            position: absolute;
            width: 20vw;
            height: 30vw;
            border-radius: 16px;
            overflow: hidden;
            background: #000;
          }

          .slide img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div ref={ref} className="slider">
        {[
          'https://picsum.photos/id/1040/1000/1500',
          'https://picsum.photos/id/1050/1000/1500',
          'https://picsum.photos/id/1060/1000/1500',
          'https://picsum.photos/id/1070/1000/1500',
          'https://picsum.photos/id/1080/1000/1500',
          'https://picsum.photos/id/1081/1000/1500',
          'https://picsum.photos/id/1082/1000/1500',
        ].map((src, index) => (
          <div key={src} className="slide" onClick={() => toggleSlide(index)}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
};
