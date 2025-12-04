import React, { FC, useEffect } from 'react';
import { ScrollProgress } from '@/index';

interface IProps {
  direction: 'x' | 'y';
  root?: HTMLElement | null;
}

export const Inner: FC<IProps> = ({ direction, root }) => {
  useEffect(() => {
    const sections = document.querySelectorAll('.js-section');

    const sectionHandlers = Array.from(sections).map((section) => {
      const handler = new ScrollProgress(
        {
          section,
          root,
        },
        {
          onUpdate: () => {
            const inProgress =
              direction === 'x' ? handler.inProgress.x : handler.inProgress.y;
            const moveProgress =
              direction === 'x'
                ? handler.moveProgress.x
                : handler.moveProgress.y;
            const outProgress =
              direction === 'x' ? handler.outProgress.x : handler.outProgress.y;
            const progress =
              direction === 'x' ? handler.progress.x : handler.progress.y;

            section.innerHTML = `
              <p>in: ${inProgress.toFixed(2)}</p>
              <p>move: ${moveProgress.toFixed(2)}</p>
              <p>out: ${outProgress.toFixed(2)}</p>
              <p>global: ${progress.toFixed(2)}</p>
            `;
          },
        },
      );

      return handler;
    });

    return () => {
      sectionHandlers.forEach((handler) => handler.destroy());
    };
  }, [direction, root]);

  return (
    <>
      <div
        className="js-section"
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: direction === 'x' ? 'calc(120 * var(--unit))' : '100%',
          height: direction === 'y' ? 'calc(120 * var(--unit))' : '100%',
          backgroundColor: '#a00',
        }}
      />

      <div
        className="js-section"
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: direction === 'x' ? 'calc(50 * var(--unit))' : '100%',
          height: direction === 'y' ? 'calc(50 * var(--unit))' : '100%',
          backgroundColor: '#0a0',
        }}
      />

      <div
        className="js-section"
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: direction === 'x' ? 'calc(100 * var(--unit))' : '100%',
          height: direction === 'y' ? 'calc(100 * var(--unit))' : '100%',
          backgroundColor: '#00a',
        }}
      />

      <div
        className="js-section"
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: direction === 'x' ? 'calc(120 * var(--unit))' : '100%',
          height: direction === 'y' ? 'calc(120 * var(--unit))' : '100%',
          backgroundColor: '#aa0',
        }}
      />

      <div
        className="js-section"
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: direction === 'x' ? 'calc(100 * var(--unit))' : '100%',
          height: direction === 'y' ? 'calc(100 * var(--unit))' : '100%',
          backgroundColor: '#0aa',
        }}
      />
    </>
  );
};
