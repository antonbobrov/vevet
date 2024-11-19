/* eslint-disable no-param-reassign */
import React, { FC, useEffect, useRef } from 'react';
import { CustomScroll } from '../../CustomScroll';
import { SectionScrollProgress } from '..';

export const WithCustomScrollComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const scroll = new CustomScroll({
      container: containerRef.current,
    });

    const sections = containerRef.current.querySelectorAll('.js-section');

    const sectionHandlers = Array.from(sections).map((section) => {
      const handler = new SectionScrollProgress({
        scrollContainer: scroll,
        section,
      });

      const render = () => {
        section.innerHTML = `
          <p>progressGlobal: ${handler.progressGlobal.toFixed(2)}</p>
          <p>progressIn: ${handler.progressIn.toFixed(2)}</p>
          <p>progressMove: ${handler.progressMove.toFixed(2)}</p>
          <p>progressOut: ${handler.progressOut.toFixed(2)}</p>
        `;
      };

      render();

      handler.on('render', () => render());

      return handler;
    });

    return () => {
      scroll.destroy();
      sectionHandlers.forEach((handler) => handler.destroy());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="v-custom-scroll"
      style={{ height: '100vh', backgroundColor: '#ccc' }}
    >
      <div className="v-custom-scroll__wrapper">
        <div
          className="js-section"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100vh',
            backgroundColor: '#a00',
          }}
        />

        <div
          className="js-section"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '150vh',
            backgroundColor: '#0a0',
          }}
        />

        <div
          className="js-section"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100vh',
            backgroundColor: '#00a',
          }}
        />
      </div>
    </div>
  );
};
