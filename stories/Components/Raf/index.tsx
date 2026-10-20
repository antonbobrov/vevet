import React, { FC, useCallback, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Raf/props';
import {
  addEventListener,
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
  const dampRef = useRef<HTMLDivElement>(null);
  const springRef = useRef<HTMLDivElement>(null);

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
    const dampEl = dampRef.current;
    const springEl = springRef.current;

    if (!dampEl || !springEl) {
      return undefined;
    }

    const mod = new Raf(input);

    setInstance(mod);
    syncState(mod);

    const springEase = {
      stiffness: 100,
      damping: 10,
    };

    mod.add('dampX', { value: 0, ease: 0.1 });
    mod.add('dampY', { value: 0, ease: 0.1 });
    mod.add('springX', { value: 0, ease: springEase });
    mod.add('springY', { value: 0, ease: springEase });

    mod.on('toggle', () => syncState(mod));
    mod.on('props', () => syncState(mod));

    mod.on('frame', () => {
      syncState(mod);

      dampEl.style.transform = `translate(${mod.value('dampX')}px, ${mod.value('dampY')}px)`;
      springEl.style.transform = `translate(${mod.value('springX')}px, ${mod.value('springY')}px)`;
    });

    const listener = addEventListener(window, 'mousemove', (evt) => {
      mod.target('dampX', evt.clientX);
      mod.target('dampY', evt.clientY);
      mod.target('springX', evt.clientX);
      mod.target('springY', evt.clientY);
    });

    return () => {
      mod.destroy();
      setInstance(undefined);
      listener();
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <ul>
        <li>Target FPS: {targetFps}</li>

        <li>Current FPS: {currentFps}</li>

        <li>FPS Factor: {fpsFactor.toFixed(2)}</li>

        <li>Time: {time.toFixed(0)}</li>

        <li>Frame: {frame}</li>

        <li>Red = damp, blue = spring</li>
      </ul>

      <div ref={dampRef} className="raf-dot raf-dot--damp" />
      <div ref={springRef} className="raf-dot raf-dot--spring" />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .raf-dot {
            position: fixed;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            margin: -20px 0 0 -20px;
            border-radius: 50%;
            pointer-events: none;
          }

          .raf-dot--damp {
            background-color: rgba(255, 0, 0, 0.5);
          }

          .raf-dot--spring {
            background-color: rgba(0, 100, 255, 0.5);
          }
        `,
        }}
      />
    </>
  );
};
