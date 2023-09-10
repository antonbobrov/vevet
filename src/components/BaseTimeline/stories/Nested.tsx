import React, { FC, useEffect, useRef, useState } from 'react';
import { BaseTimeline } from '..';
import { Easing, spreadScope } from '@/utils/math';

export const Nested: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<BaseTimeline>();

  useEffect(() => {
    const instance = new BaseTimeline({
      easing: Easing.easeInOutBounce,
      hasNestedEasingProgress: true,
    });
    setTimeline(instance);

    if (containerRef.current) {
      const children = Array.from(
        containerRef.current.children
      ) as HTMLElement[];

      const scopes = spreadScope(children.length, 0.9);

      children.forEach((child, index) => {
        const nestedTm = new BaseTimeline({
          nestedScope: scopes[index],
          easing: Easing.easeInOutBounce,
        });

        nestedTm.addCallback('progress', ({ easing }) => {
          // eslint-disable-next-line no-param-reassign
          child.style.transform = `scale(${easing}, 1)`;
        });

        instance.addNestedTimeline(nestedTm);
      });
    }

    return () => instance.destroy();
  }, []);

  return (
    <div>
      <input
        type="range"
        min={0}
        max={1}
        defaultValue={0}
        step={0.0001}
        style={{ width: '100%' }}
        onChange={(event) => {
          if (timeline) {
            timeline.progress = parseFloat(event.currentTarget.value);
          }
        }}
      />

      <div
        ref={containerRef}
        style={{
          marginTop: 20,
          width: '100%',
          display: 'grid',
          gap: 10,
        }}
      >
        <div
          style={{
            height: '30px',
            backgroundColor: '#F7DBA7',
            transform: 'scale(0, 1)',
          }}
        />

        <div
          style={{
            height: '30px',
            backgroundColor: '#F1AB86',
            transform: 'scale(0, 1)',
          }}
        />

        <div
          style={{
            height: '30px',
            backgroundColor: '#C57B57',
            transform: 'scale(0, 1)',
          }}
        />

        <div
          style={{
            height: '30px',
            backgroundColor: '#1E2D2F',
            transform: 'scale(0, 1)',
          }}
        />

        <div
          style={{
            height: '30px',
            backgroundColor: '#041F1E',
            transform: 'scale(0, 1)',
          }}
        />
      </div>
    </div>
  );
};
