import React, { FC, useEffect, useRef } from 'react';
import { addEventListener, lerp, Snap, Timeline, vevet } from '@/index';

export const DynamicWidth: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap({
      container: ref.current,
      direction: 'horizontal',
      gap: '1vw',
      wheel: true,
      wheelAxis: 'y',
      freemode: true,
      stickOnResize: false,
      edgeFriction: 1,
    });

    // todo: try calculating target & current on resize by slides progress

    instance.on('update', () => {
      instance.slides.forEach(({ element, coord }) => {
        element!.style.transform = `translateX(${coord}px)`;
      });
    });

    const listeners = instance.slides.map((slide) =>
      addEventListener(slide.element!, 'click', () => {
        const element = slide.element!;

        element.classList.toggle('active');
        const isExpanding = element.classList.contains('active');

        const fromWidth = (element.offsetWidth / vevet.width) * 100;
        const tm = new Timeline({ duration: 500 });

        tm.on('update', ({ eased }) => {
          const toWidth = isExpanding ? 45 : 20;
          element.style.width = `${lerp(fromWidth, toWidth, eased)}vw`;

          slide.resize(true);
        });

        tm.on(
          'end',
          () => {
            if (!isExpanding) {
              instance.stick();
            }
          },
          { timeout: 100 },
        );

        tm.play();
      }),
    );

    return () => {
      instance.destroy();
      listeners.forEach((listener) => listener());
    };
  }, []);

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
        ].map((src) => (
          <div key={src} className="slide">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
};
