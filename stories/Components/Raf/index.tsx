import React, { FC, useCallback, useEffect, useState } from 'react';
import { IRafMutableProps, Raf } from '@/index';

interface IProps extends Pick<IRafMutableProps, 'fps'> {}

export const Component: FC<IProps> = ({ fps: fpsProp }) => {
  const [raf, setRaf] = useState<Raf>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [targetFps, setTargetFps] = useState<Raf['props']['fps']>(0);
  const [currentFps, setCurrentFps] = useState(0);
  const [fpsFactor, setFpsFactor] = useState(0);
  const [time, setTime] = useState(0);
  const [frame, setFrame] = useState(0);

  const updateProps = useCallback((instance: Raf) => {
    setTargetFps(instance.props.fps);
    setCurrentFps(instance.fps);
    setFpsFactor(instance.fpsFactor);
    setTime(instance.timestamp);
    setFrame(instance.index);
  }, []);

  useEffect(() => {
    const instance = new Raf({
      fps: fpsProp,
      enabled: true,
    });

    instance.on('toggle', () => setIsPlaying(instance.isPlaying));
    instance.on('frame', () => updateProps(instance));
    instance.on('props', () => updateProps(instance));

    setRaf(instance);
    updateProps(instance);

    return () => instance.destroy();
  }, [fpsProp, updateProps]);

  return (
    <div>
      <button type="button" onClick={() => raf?.play()} disabled={isPlaying}>
        Play
      </button>

      <button type="button" onClick={() => raf?.pause()} disabled={!isPlaying}>
        Pause
      </button>

      <ul>
        <li>Target FPS: {targetFps}</li>

        <li>Current FPS: {currentFps}</li>

        <li>FPS Factor: {fpsFactor.toFixed(2)}</li>

        <li>Time: {time.toFixed(0)}</li>

        <li>Frame: {frame}</li>
      </ul>
    </div>
  );
};
