import React, { FC } from 'react';
import { Inner } from './Inner';

interface IProps {
  direction: 'x' | 'y';
}

export const InWindow: FC<IProps> = ({ direction }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction === 'x' ? 'row' : 'column',
      width: direction === 'x' ? 'max-content' : 'inherit',
      // @ts-ignore
      '--unit': direction === 'x' ? '1vw' : '1vh',
    }}
  >
    <Inner direction={direction} />
  </div>
);
