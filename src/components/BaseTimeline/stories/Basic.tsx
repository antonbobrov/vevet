import React, { FC, useEffect, useRef, useState } from 'react';
import { BaseTimeline } from '..';
import { Easing } from '@/utils/math';

export const Basic: FC = () => {
  const thumbRef = useRef<HTMLDivElement>(null);

  const [timeline, setTimeline] = useState<BaseTimeline>();

  useEffect(() => {
    const instance = new BaseTimeline({ easing: Easing.easeInOutBounce });
    setTimeline(instance);

    instance.addCallback('progress', ({ easing }) => {
      if (!thumbRef.current) {
        return;
      }

      thumbRef.current.style.left = `${easing * 100}%`;
    });

    return () => instance.destroy();
  }, []);

  return (
    <>
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
        style={{
          position: 'relative',
          marginTop: '10px',
          width: '100%',
          height: '20px',
          backgroundColor: '#dedede',
        }}
      >
        <div
          ref={thumbRef}
          style={{
            position: 'absolute',
            top: '-5px',
            left: 0,
            width: '10px',
            height: '30px',
            transform: 'translate(-50%, 0)',
            backgroundColor: '#000',
          }}
        />
      </div>
    </>
  );
};
