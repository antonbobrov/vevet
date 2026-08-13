import React, { FC, useCallback, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Raf/props';
import {
  IRafCallbacksMap,
  IRafMutableProps,
  IRafStaticProps,
  Raf,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

type TProps = Omit<
  IRafStaticProps & IRafMutableProps,
  '__mutableProp' | '__staticProp'
>;

const LOG_EVENTS: Record<keyof IRafCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  play: true,
  pause: true,
  toggle: true,
  frame: false,
};

export const Component: FC<TProps> = (props) => {
  const [instance, setInstance] = useState<Raf>();
  const [targetFps, setTargetFps] = useState<Raf['props']['fps']>(0);
  const [currentFps, setCurrentFps] = useState(0);
  const [fpsFactor, setFpsFactor] = useState(0);
  const [time, setTime] = useState(0);
  const [frame, setFrame] = useState(0);

  useLogEvents(instance, LOG_EVENTS);

  const syncState = useCallback((instance: Raf) => {
    setTargetFps(instance.props.fps);
    setCurrentFps(instance.fps);
    setFpsFactor(instance.fpsFactor);
    setTime(instance.timestamp);
    setFrame(instance.index);
  }, []);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    const mod = new Raf(input);

    mod.on('toggle', () => syncState(mod));
    mod.on('frame', () => syncState(mod));
    mod.on('props', () => syncState(mod));

    setInstance(mod);
    syncState(mod);

    return () => {
      mod.destroy();
      setInstance(undefined);
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <ul>
      <li>Target FPS: {targetFps}</li>

      <li>Current FPS: {currentFps}</li>

      <li>FPS Factor: {fpsFactor.toFixed(2)}</li>

      <li>Time: {time.toFixed(0)}</li>

      <li>Frame: {frame}</li>
    </ul>
  );
};
