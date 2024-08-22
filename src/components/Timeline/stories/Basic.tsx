import React, { FC, useEffect, useRef, useState } from 'react';
import { Timeline } from '..';
import { EaseInOutBounce } from '@/utils/math';

export const Basic: FC = () => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [timeline, setTimeline] = useState<Timeline>();

  useEffect(() => {
    const instance = new Timeline({
      duration: 3500,
      easing: EaseInOutBounce,
    });

    setTimeline(instance);

    instance.addCallback('progress', ({ e, p }) => {
      if (inputRef.current) {
        inputRef.current.value = `${p}`;
      }

      if (thumbRef.current) {
        thumbRef.current.style.left = `${e * 100}%`;
      }
    });

    return () => instance.destroy();
  }, []);

  return (
    <>
      <button type="button" onClick={() => timeline?.play()}>
        Play
      </button>
      <button type="button" onClick={() => timeline?.pause()}>
        Pause
      </button>
      <button type="button" onClick={() => timeline?.reverse()}>
        Reverse
      </button>
      <button type="button" onClick={() => timeline?.reset()}>
        Reset
      </button>

      <input
        ref={inputRef}
        type="range"
        min={0}
        max={1}
        defaultValue={0}
        step={0.0001}
        style={{ width: '100%' }}
        onChange={(event) => {
          if (timeline) {
            timeline.p = parseFloat(event.currentTarget.value);
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
