import React, { FC, useEffect, useState } from 'react';
import { AnimationFrame, NAnimationFrame } from '..';

interface IProps {
  fps: 'auto' | number;
}

export const Component: FC<IProps> = ({ fps }) => {
  const [animationFrame, setAnimationFrame] = useState<AnimationFrame>();

  const [targetFps, setTargetFps] =
    useState<NAnimationFrame.IChangeableProps['fps']>(0);
  const [computedFps, setComputedFps] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const frame = new AnimationFrame({ fps }, false);

    frame.addResponsiveProps({
      breakpoint: 'viewport_phone',
      settings: {
        fps: 10,
      },
    });

    frame.init();
    frame.init();

    setAnimationFrame(frame);
    setTargetFps(frame.props.fps);

    frame.on('propsMutate', () => setTargetFps(frame.props.fps));

    frame.on('frame', () => {
      setComputedFps(frame.computedFPS);
      setTime(+new Date());
    });

    frame.on('toggle', () => setIsPlaying(frame.isPlaying));

    frame.on('destroy', () => {
      // eslint-disable-next-line no-console
      console.log('destroy');
    });

    return () => frame.destroy();
  }, [fps]);

  return (
    <div>
      <button
        type="button"
        onClick={() => animationFrame?.play()}
        disabled={isPlaying}
      >
        Play
      </button>

      <button
        type="button"
        onClick={() => animationFrame?.pause()}
        disabled={!isPlaying}
      >
        Pause
      </button>

      <ul>
        <li>Target FPS: {targetFps}</li>

        <li>Computed FPS: {computedFps}</li>

        <li>Time: {time}</li>
      </ul>
    </div>
  );
};
