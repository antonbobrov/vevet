import React, { FC, useCallback, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Timeline/props';
import {
  ITimelineCallbacksMap,
  ITimelineMutableProps,
  ITimelineProgressArg,
  ITimelineStaticProps,
  Timeline,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  ITimelineStaticProps & ITimelineMutableProps,
  '__mutableProp' | '__staticProp'
>;

const LOG_EVENTS: Record<keyof ITimelineCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  start: true,
  update: false,
  end: true,
  play: true,
  reverse: true,
  pause: true,
  reset: true,
  resume: true,
};

export const Component: FC<TProps> = (props) => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [instance, setInstance] = useState<Timeline>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eased, setEased] = useState(0);
  const [duration, setDuration] = useState(MUTABLE_PROPS.duration);

  useLogEvents(instance, LOG_EVENTS);

  const syncState = useCallback(
    (timeline: Timeline, payload?: ITimelineProgressArg) => {
      const nextProgress = payload?.progress ?? timeline.progress;
      const nextEased = payload?.eased ?? timeline.eased;

      setIsPlaying(timeline.isPlaying);
      setIsPaused(timeline.isPaused);
      setIsReversed(timeline.isReversed);
      setDuration(timeline.duration);
      setProgress(nextProgress);
      setEased(nextEased);

      if (inputRef.current) {
        inputRef.current.value = `${nextProgress}`;
      }

      if (thumbRef.current) {
        thumbRef.current.style.left = `${nextEased * 100}%`;
      }
    },
    [],
  );

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const mod = new Timeline(input);

    mod.on('update', (payload) => syncState(mod, payload));
    mod.on('props', () => syncState(mod));
    mod.on('start', () => syncState(mod));
    mod.on('end', () => syncState(mod));

    setInstance(mod);
    syncState(mod);

    return () => {
      mod.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  const handlePlay = () => {
    if (!instance) {
      return;
    }

    instance.play();
    syncState(instance);
  };

  const handlePause = () => {
    if (!instance) {
      return;
    }

    instance.pause();
    syncState(instance);
  };

  const handleReverse = () => {
    if (!instance) {
      return;
    }

    instance.reverse();
    syncState(instance);
  };

  const handleReset = () => {
    if (!instance) {
      return;
    }

    instance.reset();
    syncState(instance);
  };

  return (
    <>
      <button type="button" onClick={handlePlay}>
        Play
      </button>

      <button type="button" onClick={handlePause}>
        Pause
      </button>

      <button type="button" onClick={handleReverse}>
        Reverse
      </button>

      <button type="button" onClick={handleReset}>
        Reset
      </button>

      <input
        ref={inputRef}
        type="range"
        min={0}
        max={1}
        value={progress}
        step={0.0001}
        style={{ width: '100%' }}
        onChange={(event) => {
          if (instance) {
            instance.progress = parseFloat(event.currentTarget.value);
            syncState(instance);
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

      <ul>
        <li>Duration: {duration}</li>

        <li>Progress: {progress.toFixed(4)}</li>

        <li>Eased: {eased.toFixed(4)}</li>

        <li>Is Playing: {String(isPlaying)}</li>

        <li>Is Paused: {String(isPaused)}</li>

        <li>Is Reversed: {String(isReversed)}</li>
      </ul>
    </>
  );
};
