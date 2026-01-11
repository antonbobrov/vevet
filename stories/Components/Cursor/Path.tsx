import React, { FC, useEffect, useRef } from 'react';
import { Cursor } from '@/index';

export const Path: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !svgRef.current) {
      return undefined;
    }

    const instance = new Cursor({
      container: ref.current,
      width: '2rem',
      height: '2rem',
      lerp: 0.005,
      behavior: 'path',
      transformModifier: (coords) =>
        `translate(${coords.x}px, ${coords.y}px) rotate(${coords.angle}deg) `,
    });

    svgRef.current.append(instance.path);
    instance.path.style.strokeWidth = '6';

    return () => instance.destroy();
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
      }}
    >
      <svg
        ref={svgRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={ref}
        style={{
          position: 'relative',
          margin: 20,
          width: 700,
          height: 700,
          background: '#eeeeee96',
        }}
      />
    </div>
  );
};
