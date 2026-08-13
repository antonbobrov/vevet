import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Cursor/props';
import { ICursorStaticProps, ICursorMutableProps, Cursor } from '@/index';
import { isFiniteNumber } from '@/internal';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { LOG_EVENTS } from './constants';

type TProps = Omit<
  ICursorStaticProps & ICursorMutableProps,
  '__mutableProp' | '__staticProp' | 'container' | 'transformModifier'
> & {
  preset: 'elastic' | 'default';
};

export const Component: FC<TProps> = ({ preset, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [instance, setInstance] = useState<Cursor>();

  useLogEvents(instance, LOG_EVENTS);

  const createCursor = useCallback((text: string) => {
    const cursor = document.createElement('div');
    cursor.innerHTML = text;

    return cursor;
  }, []);

  const deps = useMemo(() => [preset], [preset]);

  useOnProps(
    props,
    STATIC_PROPS,
    (input: TProps) => {
      const container = ref.current;

      if (!container) {
        return undefined;
      }

      const mod = new Cursor({
        ...input,
        container,
        transformModifier:
          preset === 'elastic'
            ? ({ x, y, angle, velocity }) => {
                const scale = velocity * 0.4;
                const scaleX = 1 + scale;
                const scaleY = 1 - scale;

                return `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
              }
            : undefined,
      });

      setInstance(mod);

      mod.attachCursor({
        element: createCursor('default'),
        type: 'default',
      });

      mod.attachCursor({
        element: createCursor('some_type'),
        type: 'some_type',
      });

      mod.attachHover({
        element: mod.domContainer,
        type: 'default',
      });

      const els = container.querySelectorAll('[data-el]');

      els.forEach((el) => {
        const type = el.getAttribute('data-type') ?? undefined;

        let width: 'auto' | number | null = null;
        let height: 'auto' | number | null = null;

        if (el.getAttribute('data-width')) {
          if (el.getAttribute('data-width') === 'auto') {
            width = 'auto';
          } else {
            const num = parseInt(el.getAttribute('data-width') ?? '');
            width = isFiniteNumber(num) ? num : null;
          }
        }

        if (el.getAttribute('data-height')) {
          if (el.getAttribute('data-height') === 'auto') {
            height = 'auto';
          } else {
            const num = parseInt(el.getAttribute('data-height') ?? '');
            height = isFiniteNumber(num) ? num : null;
          }
        }

        const sticky = el.hasAttribute('data-sticky');
        const snap = el.hasAttribute('data-snap');
        const friction = el.hasAttribute('data-friction') ? 0.2 : 0;

        mod.attachHover({
          element: el,
          type,
          width,
          hoverDebounce: 16,
          height,
          padding: 5,
          sticky,
          snap,
          stickyLerp: 0.2,
          stickyAmplitude: { x: '2rem', y: 'auto' },
          stickyFriction: friction,
        });
      });

      if (svgRef.current) {
        svgRef.current.append(mod.path);
        mod.path.style.strokeWidth = '6';
      }

      return () => {
        mod.path.remove();
        mod.destroy();
        setInstance(undefined);
      };
    },
    deps,
  );

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <div
      style={{
        overflow: 'hidden',
        background: '#eee',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          button {
            padding: 20px;
          }
        `,
        }}
      ></style>

      <div ref={ref} style={{ padding: '100px 20px' }}>
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

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
          voluptate provident ratione, libero explicabo illum iusto minima,
          fugiat sint nemo iure? Enim debitis, quidem id repudiandae distinctio
          sequi culpa harum!
        </p>

        <div style={{ display: 'flex', gap: 20 }}>
          <button data-el data-width="auto" data-height="auto" type="button">
            Auto size
          </button>

          <button data-el data-width="200" type="button">
            Width 200
          </button>

          <button data-el data-height="200" type="button">
            Height 200
          </button>
        </div>

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
          voluptate provident ratione, libero explicabo illum iusto minima,
          fugiat sint nemo iure? Enim debitis, quidem id repudiandae distinctio
          sequi culpa harum!
        </p>

        <div style={{ display: 'flex', gap: 20 }}>
          <button data-el data-width="auto" data-type="some_type" type="button">
            Some Type
          </button>

          <button data-el data-type="wrong_type" type="button">
            Wrong type
          </button>
        </div>

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt
          voluptate provident ratione, libero explicabo illum iusto minima,
          fugiat sint nemo iure? Enim debitis, quidem id repudiandae distinctio
          sequi culpa harum!
        </p>

        <div style={{ display: 'flex', gap: 20 }}>
          <button type="button" data-el data-sticky>
            Sticky
          </button>

          <button type="button" data-el data-snap>
            Snap
          </button>

          <button type="button" data-el data-sticky data-friction>
            Friction
          </button>
        </div>
      </div>
    </div>
  );
};
