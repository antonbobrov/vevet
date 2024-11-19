/* eslint-disable no-param-reassign */
import React, { FC, useEffect } from 'react';
import { SectionScrollProgress } from '..';

export const DefalultComponent: FC = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.js-section');

    const sectionHandlers = Array.from(sections).map((section) => {
      const handler = new SectionScrollProgress({
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
      sectionHandlers.forEach((handler) => handler.destroy());
    };
  }, []);

  return (
    <>
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
    </>
  );
};
