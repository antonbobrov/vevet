import React, { FC, useEffect, useRef, useState } from 'react';
import { Snap } from '@/index';

export const Test: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [snap, setSnap] = useState<Snap>();

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const infos = Array.from(
      document.querySelectorAll<HTMLElement>('.js-slide-info'),
    );

    const instance = new Snap({
      container: ref.current,
      direction: 'horizontal',
      wheel: true,
      followWheel: true,
      wheelAxis: 'y',
      centered: false,
      loop: false,
      duration: 1000,
      gap: 20,
      grabCursor: true,
    });

    setSnap(instance);

    instance.on('activeSlide', () => {
      setActiveIndex(instance.activeIndex);
    });

    instance.on('update', () => {
      setIsStart(instance.track.isStart);
      setIsEnd(instance.track.isEnd);
    });

    instance.on('update', () => {
      instance.slides.forEach(({ element, coord, progress }, index) => {
        element!.style.transform = `translateX(${coord}px)`;

        const info = infos[index];
        info.innerHTML = `${index} / ${progress.toFixed(2)} / ${Math.round(coord)}`;
      });
    });

    return () => instance.destroy();
  }, []);

  return (
    <>
      <style>
        {`
          .container {
            position: relative;
            margin: 0 auto;
            width: 400px;
            max-width: 80%;
            height: 300px;
            background: #000;

            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 50%;
              width: 1px;
              height: 100%;
              background: red;
            }
          }
            
          .slide {
            position: absolute;
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
        `}
      </style>

      <div ref={ref} className="container">
        {[
          { color: '#A8E6CF', size: 200 },
          { color: '#DCEDC1', size: 800 },
          { color: '#FFD3B6', size: 300 },
          { color: '#FF8B94', size: 400 },
          { color: '#f00', size: 800 },
        ].map(({ color, size }, index) => (
          <div
            key={color}
            className="slide"
            style={{ backgroundColor: color, width: size }}
          >
            <p className="js-slide-info">{index}</p>

            <button type="button" onClick={() => alert('test')}>
              click me
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => snap?.prev()}>
        Prev
      </button>

      <button type="button" onClick={() => snap?.next()}>
        Next
      </button>

      <br />

      <br />

      <button type="button" disabled={isStart} onClick={() => snap?.toSlide(0)}>
        Start
      </button>

      {snap?.slides.map((slide, index) => (
        <button
          key={slide.id}
          type="button"
          disabled={activeIndex === index}
          onClick={() => snap?.toSlide(index)}
        >
          {index}
        </button>
      ))}

      <button
        type="button"
        disabled={isEnd}
        onClick={() => snap?.toSlide(snap.slides.length - 1)}
      >
        End
      </button>
    </>
  );
};
