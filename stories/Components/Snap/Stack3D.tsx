import React, { FC, useEffect, useRef } from 'react';
import { inRange, lerp, Snap } from '@/index';

export const Stack3D: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const instance = new Snap({
      container: ref.current,
      direction: 'vertical',
      wheel: true,
      wheelAxis: 'y',
    });

    instance.on('update', () => {
      const ampX = 0.2;
      const ampY = 0.6;
      const ampZ = 0.5;
      const rotateYAmp = -35;

      instance.slides.forEach(({ element, progress, size }) => {
        let opacity = 0;
        let y = 0;
        let x = 0;
        let z = 0;
        let rotateX = 0;
        let rotateZ = 0;
        let brightness = 1;
        let skew = 0;

        if (inRange(progress, 0, 1)) {
          const sine = Math.sin(Math.PI * progress);
          y = sine * size * ampY * -1;
          x = sine * size * ampX * -1;
          z = progress * size * ampZ * -1;
          rotateX = progress * 180;
          rotateZ = sine * rotateYAmp;
          opacity = 1;
          brightness = lerp(1, 0.25, progress);
          skew = lerp(0, 10, sine);
        } else if (inRange(progress, -1, 0)) {
          z = progress * size * ampZ;
          opacity = 1;
        }

        element!.style.opacity = `${opacity}`;
        element!.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) skew(${skew}deg)`;
        element!.style.filter = `brightness(${brightness})`;
      });
    });

    return () => instance.destroy();
  }, []);

  return (
    <>
      <style>
        {`
          .container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-width: 100%;
            aspect-ratio: 1.5 / 1;

            transform-style: preserve-3d;
            perspective: 1000px;
          }
            
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 16px;
            overflow: hidden;
            background-color: #fff;
          }
            
          .slide img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div ref={ref} className="container">
        {[
          'https://picsum.photos/id/940/400/600',
          'https://picsum.photos/id/950/400/600',
          'https://picsum.photos/id/960/400/600',
          'https://picsum.photos/id/970/400/600',
          'https://picsum.photos/id/980/400/600',
          'https://picsum.photos/id/990/400/600',
          'https://picsum.photos/id/1000/400/600',
          'https://picsum.photos/id/1020/400/600',
          'https://picsum.photos/id/1040/400/600',
          'https://picsum.photos/id/1050/400/600',
        ].map((src) => (
          <div key={src} className="slide">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
};
